
import express from "express";

import {
  createContact,
  getAllContacts,
  getContactById,
  deleteContact,
} from "../controller/contact.js";

const contactRoutes = express.Router();

// Submit inquiry
contactRoutes.post("/", createContact);

// Get all inquiries
contactRoutes.get("/", getAllContacts);

// Get single inquiry
contactRoutes.get("/:id", getContactById);

// Delete inquiry
contactRoutes.delete("/:id", deleteContact);

export default contactRoutes;
