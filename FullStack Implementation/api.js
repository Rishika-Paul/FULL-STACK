import express from "express";

const router = express.Router();

const products = [
  { name: "Laptop", price: 1200 },
  { name: "Mouse", price: 25 },
  { name: "Keyboard", price: 45 },
];

router.get("/products", (req, res) => {
  res.json(products);
});

export default router;
