import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors'
import authRoutes from './routes/auth.route.js';
import healthEvaluationRoutes from './routes/HealthEvaluation.route.js';
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

// ✅ Route to Handle File Upload
app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }
    res.status(200).json({ success: true, filePath: `/uploads/${req.file.filename}` });
});

// ✅ Serve Uploaded Files Statically
app.use('/uploads', express.static('uploads'));

// Default route for homepage
app.get('/', (req, res) => {
    res.send('Welcome to the API');
});

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/healthEvaluation', healthEvaluationRoutes);
app.use('/api/hospital', hospitalRoutes);
app.use('/api/donor', donorRoutes);
app.use('/api/blood-inventory', BloodInventoryRoutes);
app.use('/api/blooddonationappointment', BloodDonationAppointmentRoutes);
app.use('/api/inquiry', inquiryRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/manager', SystemManagerRoutes);
app.use('/api/emergency-requests', EmergencyBRRoutes);
app.use('/api/healthAd', HospitalAdminRoutes);

// ✅ Error handling middleware (should be last)
app.use((error, req, res, next) => {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
});

// ✅ Database Connection
mongoose.connect(process.env.MONGO)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(process.env.PORT, () => {
            console.log('Server is running on port 3020');
        });
    })
    .catch((err) => {
        console.error('MongoDB Connection Error:', err);
    });