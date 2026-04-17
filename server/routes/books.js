const express = require("express");
const router = express.Router();
const {
    getAllBooks,
    getBook,
    createBook,
    updateBook,
    deleteBook,
} = require("../controllers/bookController");
const { protect } = require("../middleware/authMiddleWare");

router.get("/", getAllBooks);
router.get("/:id", getBook);
router.post("/", protect, createBook);
router.put("/:id", protect, updateBook);
router.delete("/:id", protect, deleteBook);

module.exports = router;