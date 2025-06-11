const Product = require("../models/Product");

// @desc Create new product
exports.createProduct = async (req, res) => {
  const { name, description, price, image, category, brand, stock } = req.body;

  const product = new Product({
    name,
    description,
    price,
    image,
    category,
    brand,
    stock,
    createdBy: req.user._id,
  });

  const saved = await product.save();
  res.status(201).json(saved);
};

// @desc Get all products
exports.getAllProducts = async (req, res) => {
  const products = await Product.find({});
  res.json(products);
};

// @desc Get single product
exports.getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
};

// @desc Update product
exports.updateProduct = async (req, res) => {
  const { name, description, price, image, category, brand, stock } = req.body;
  const product = await Product.findById(req.params.id);

  if (!product) return res.status(404).json({ message: "Product not found" });

  product.name = name || product.name;
  product.description = description || product.description;
  product.price = price || product.price;
  product.image = image || product.image;
  product.category = category || product.category;
  product.brand = brand || product.brand;
  product.stock = stock || product.stock;

  const updated = await product.save();
  res.json(updated);
};

// @desc Delete product
exports.deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });

  await product.deleteOne();
  res.json({ message: "Product deleted" });
};

// @desc Add a product review
exports.createReview = async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (!product) return res.status(404).json({ message: "Product not found" });

  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );

  if (alreadyReviewed)
    return res.status(400).json({ message: "Product already reviewed" });

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  product.reviews.push(review);
  product.numReviews = product.reviews.length;
  product.ratings =
    product.reviews.reduce((acc, r) => r.rating + acc, 0) / product.numReviews;

  await product.save();
  res.status(201).json({ message: "Review added" });
};
