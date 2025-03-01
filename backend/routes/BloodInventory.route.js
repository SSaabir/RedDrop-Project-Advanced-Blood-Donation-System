import express from "express";
import {
    getBloodInventory,
    getBloodInventoryById,
    createBloodInventory,
    updateBloodInventory,
    deleteBloodInventory
} from ".";

const router = express.Router();

router.get("/", getBloodInventory); // Get all blood inventory records
router.get("/:id", getBloodInventoryById); // Get a single record by ID
router.post("/", createBloodInventory); // Create a new record
router.patch("/:id", updateBloodInventory); // Update a record
router.delete("/:id", deleteBloodInventory); // Delete a record

export default router;