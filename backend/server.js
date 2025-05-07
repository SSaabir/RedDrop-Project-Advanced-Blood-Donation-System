import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import authRoutes from "./routes/auth.route.js";
import healthEvaluationRoutes from "./routes/HealthEvaluation.route.js";
import BloodInventoryRoutes from "./routes/BloodInventory.route.js";
import BloodDonationAppointmentRoutes from "./routes/BloodDonationAppointment.route.js";
import SystemManagerRoutes from "./routes/SystemManager.route.js";
import hospitalRoutes from "./routes/hospital.route.js";
import donorRoutes from "./routes/donor.route.js";
import feedbackRoutes from "./routes/feedback.route.js";
import inquiryRoutes from "./routes/inquiry.route.js";
import EmergencyBRRoutes from "./routes/EmergencyBR.route.js";
import HospitalAdminRoutes from "./routes/HospitalAdmin.route.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import  cron  from "node-cron";
import  Appointment  from "./models/BloodDonationAppointment.model.js";
import  BloodInventory  from "./models/BloodInventory.model.js";
import  HealthEvaluation  from "./models/HealthEvaluation.model.js";
import  EmergencyBR  from "./models/EmergencyBR.model.js";
import reportRoutes from "./routes/report.route.js";
import dashboardRoutes from "./routes/dashboard.route.js";

dotenv.config();

// Handle ES Modules path resolution
const __filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(__filename);

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3020;

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3020", credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Multer Configuration for File Uploads (Your specified version)
const storage = multer.diskStorage({
  destination: "./uploads/", // Directory where files will be stored
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
  },
});

const upload = multer({ storage });

// Serve Uploaded Files Statically
app.use("/uploads", express.static(path.join(_dirname, "uploads")));
app.use("/reports", express.static(path.join(_dirname, "reports")));

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the RedDrop API" }); // Updated to JSON for consistency
});

app.post("/api/upload", upload.single("file"), (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }
    res.status(200).json({ success: true, filePath: `/uploads/${req.file.filename}` });
  } catch (err) {
    next(err);
  }
});



// Google Generative AI setup
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: "System: You are a friendly and informative chatbot named \"Echo\". You provide information about blood donation and assist users with the Red Drop donation system. You will first ask the user for their name and then refer to them by name in subsequent interactions. Do not proceed with any other actions until the user provides their name. Its a web application specifically and only focused on whole bloods.\n\nEcho: Hello! I am Echo, Welcome to Red Drop. May I know your name?\n\nUser: {user_name}\n\nEcho: Hello {user_name}! How can I assist you today?\n\nUser: {user_input}\n\nEcho:",
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseModalities: [],
    responseMimeType: "text/plain",
};

// Store chat history (in-memory for this example)
const chatHistory = []; // Initialize as an empty array!

app.post('/api/chat', async (req, res) => {
    const userMessage = req.body.message;
    if (!userMessage) {
        return res.status(400).send({ error: "No message provided" });
    }

    chatHistory.push({ role: "user", parts: [{ text: userMessage }] });

    try {
        const chatSession = model.startChat({
            generationConfig,
            history: chatHistory,
        });

        const result = await chatSession.sendMessage(userMessage);
        const responseText = result.response.text();

        chatHistory.push({ role: "model", parts: [{ text: responseText }] });

        res.send({ response: responseText });
    } catch (error) {
        console.error("Error processing chat:", error);
        res.status(500).send({ error: "Error processing chat" });
    }
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/healthEvaluation", healthEvaluationRoutes);
app.use("/api/hospital", hospitalRoutes);
app.use("/api/donor", donorRoutes);
app.use("/api/blood-inventory", BloodInventoryRoutes);
app.use("/api/blooddonationappointment", BloodDonationAppointmentRoutes);
app.use("/api/inquiry", inquiryRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/manager", SystemManagerRoutes);
app.use("/api/emergency-requests", EmergencyBRRoutes);
app.use("/api/healthAd", HospitalAdminRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/dashboard', dashboardRoutes);

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

cron.schedule("* * * * *", async () => {
  console.log("Running a task every minute");
  await HealthEvaluation.cancelExpiredEvaluations();
  await EmergencyBR.cancelExpiredRequests();
  await BloodInventory.updateExpiredStatus();
  await Appointment.cancelExpiredAppointments();
  await HealthEvaluation.updateHealthStatusAfter56Days();
  // Add your scheduled task logic here
});

// Global Error Handling Middleware
app.use((error, req, res, next) => {
  console.error("Error:", error.message);
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

app.post('/api/test-notification', async (req, res) => {
  const { userId, userType, message } = req.body;
  const result = await sendNotification({
      userId,
      userType,
      subject: 'Test Notification',
      message,
      channels: ['email', 'sms']
  });
  res.json(result);
});


// Database Connection and Server Start
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO); // No deprecated options
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("MongoDB Connection Error:", err.message);
    process.exit(1); // Exit with failure
  }
};

connectDB();