const express = require("express");
const router = express.Router();
const {
    addReview,
    getBookReviews,
    updateReview,
    deleteReview,
} = require("../controllers/reviewController");
const { protect } = require("../middleware/authMiddleWare");

router.post("/:bookId", protect, addReview);
router.get("/:bookId", getBookReviews);
router.put("/:id", protect, updateReview);
router.delete("/:id", protect, deleteReview);

module.exports = router;