const Order = require("../models/Order");
const Product = require("../models/Product");

// @desc Create new order
exports.createOrder = async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ message: "No order items" });
  }

  const order = new Order({
    user: req.user._id,
    orderItems,
    shippingAddress,
    paymentMethod,
    taxPrice,
    shippingPrice,
    totalPrice,
  });

  const createdOrder = await order.save();
  res.status(201).json(createdOrder);
};

// @desc Get logged-in user's orders
exports.getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
};

// @desc Get single order by ID
exports.getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (!order) return res.status(404).json({ message: "Order not found" });
  res.json(order);
};

// @desc Mark order as paid
exports.markOrderPaid = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentResult = req.body.paymentResult;

  const updated = await order.save();
  res.json(updated);
};

// @desc Admin: Get all orders
exports.getAllOrders = async (req, res) => {
  const orders = await Order.find().populate("user", "id name email");
  res.json(orders);
};

// @desc Admin: Mark as delivered
exports.markOrderDelivered = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  order.isDelivered = true;
  order.deliveredAt = Date.now();
  const updated = await order.save();
  res.json(updated);
};
