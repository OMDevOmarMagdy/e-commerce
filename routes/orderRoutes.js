const express = require("express");
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  markOrderPaid,
  getAllOrders,
  markOrderDelivered,
} = require("../controllers/orderController");

const { protect, admin } = require("../middleware/authMiddleware");

// USER ROUTES
router.post("/", protect, createOrder);
router.get("/my", protect, getMyOrders);
router.get("/:id", protect, getOrderById);
router.put("/:id/pay", protect, markOrderPaid);

// ADMIN ROUTES
router.get("/", protect, admin, getAllOrders);
router.put("/:id/deliver", protect, admin, markOrderDelivered);

module.exports = router;
