const express = require("express");
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  createReview,
} = require("../controllers/productController");

const { protect, admin } = require("../middleware/authMiddleware");

// PUBLIC ROUTES
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/:id/reviews", protect, createReview);

// ADMIN ROUTES
// router.post("/", admin);
router.post("/", protect, admin, createProduct);
router.put("/:id", protect, admin, updateProduct);
router.delete("/:id", protect, admin, deleteProduct);

module.exports = router;
