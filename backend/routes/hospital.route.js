import express from "express";
import upload from "../utils/multer.js";
import {
    getHospitals,
    getHospitalById,
    createHospital,
    updateHospital,
    deleteHospital,
} from "../controllers/hospital.controller.js";

const router = express.Router();

router.get("/", getHospitals);
router.get("/:id", getHospitalById);
router.post("/", upload.single("image"), createHospital);
router.put("/:id", upload.single("image"), updateHospital);
router.delete("/:id", deleteHospital);

export default router;