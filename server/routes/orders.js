const express = require("express");
const router = express.Router();
const {
    createOrder,
    getMyOrders,
    getOrder,
} = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleWare");

router.post("/", protect, createOrder);
router.get("/my-orders", protect, getMyOrders);
router.get("/:id", protect, getOrder);

module.exports = router;