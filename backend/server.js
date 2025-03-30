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

// Load environment variables
dotenv.config();

// Handle ES Modules path resolution
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3020;

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000", credentials: true }));
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
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: "Route not found" });
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