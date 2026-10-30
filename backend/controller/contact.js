
import Contact from "../model/contact.js";

export const createContact = async (req, res) => {
  try {
    const {
      fullName,
      email,
      orderType,
      shoeCategory,
      quantity,
      additionalRequirements,
    } = req.body;

    if (
      !fullName ||
      !email ||
      !orderType ||
      !shoeCategory ||
      !quantity
    ) {
      return res.status(400).json({
        ok: false,
        message: "Please fill in all required fields.",
      });
    }

    const validOrderTypes = ["Single Order", "Bulk Order"];

    const validCategories = [
      "Sneakers",
      "Formal Shoes",
      "Loafers",
      "Boots",
      "Casual Shoes",
      "Sandals",
      "Sliders",
      "Sports Shoes",
    ];

    if (!validOrderTypes.includes(orderType)) {
      return res.status(400).json({
        ok: false,
        message: "Invalid order type.",
      });
    }

    if (!validCategories.includes(shoeCategory)) {
      return res.status(400).json({
        ok: false,
        message: "Invalid shoe category.",
      });
    }

    if (!Number.isInteger(Number(quantity)) || Number(quantity) < 1) {
      return res.status(400).json({
        ok: false,
        message: "Quantity must be at least 1.",
      });
    }

    const inquiry = await Contact.create({
      fullName,
      email,
      orderType,
      shoeCategory,
      quantity: Number(quantity),
      additionalRequirements,
    });

    return res.status(201).json({
      ok: true,
      message: "Your inquiry has been submitted successfully.",
      inquiry,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Failed to submit inquiry.",
      error: error.message,
    });
  }
};

export const getAllContacts = async (req, res) => {
  try {
    const inquiries = await Contact.find().sort({ createdAt: -1 });

    return res.status(200).json({
      ok: true,
      total: inquiries.length,
      inquiries,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Failed to fetch inquiries.",
      error: error.message,
    });
  }
};

export const getContactById = async (req, res) => {
  try {
    const inquiry = await Contact.findById(req.params.id);

    if (!inquiry) {
      return res.status(404).json({
        ok: false,
        message: "Inquiry not found.",
      });
    }

    return res.status(200).json({
      ok: true,
      inquiry,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Failed to fetch inquiry.",
      error: error.message,
    });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const inquiry = await Contact.findByIdAndDelete(req.params.id);

    if (!inquiry) {
      return res.status(404).json({
        ok: false,
        message: "Inquiry not found.",
      });
    }

    return res.status(200).json({
      ok: true,
      message: "Inquiry deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Failed to delete inquiry.",
      error: error.message,
    });
  }
};
