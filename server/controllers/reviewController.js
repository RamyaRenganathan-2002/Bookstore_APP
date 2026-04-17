const prisma = require("../lib/client");

// Add review
const addReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const bookId = parseInt(req.params.bookId);

        // Check if book exists
        const book = await prisma.book.findUnique({ where: { id: bookId } });
        if (!book) return res.status(404).json({ message: "Book not found!" });

        // Check if user already reviewed this book
        const existingReview = await prisma.review.findFirst({
            where: { userId: req.user.id, bookId },
        });
        if (existingReview) {
            return res.status(400).json({ message: "You already reviewed this book!" });
        }

        const review = await prisma.review.create({
            data: {
                userId: req.user.id,
                bookId,
                rating,
                comment,
            },
        });

        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong!", error });
    }
};

// Get all reviews for a book
const getBookReviews = async (req, res) => {
    try {
        const bookId = parseInt(req.params.bookId);

        const reviews = await prisma.review.findMany({
            where: { bookId },
            include: {
                user: { select: { id: true, name: true } },
            },
        });

        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong!", error });
    }
};

// Update review
const updateReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const reviewId = parseInt(req.params.id);

        const review = await prisma.review.findUnique({
            where: { id: reviewId },
        });

        if (!review) return res.status(404).json({ message: "Review not found!" });

        if (review.userId !== req.user.id) {
            return res.status(403).json({ message: "Not authorized!" });
        }

        const updatedReview = await prisma.review.update({
            where: { id: reviewId },
            data: {
                ...(rating !== undefined && { rating }),
                ...(comment !== undefined && { comment }),
            },
        });

        res.json(updatedReview);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong!", error });
    }
};

// Delete review
const deleteReview = async (req, res) => {
    try {
        const review = await prisma.review.findUnique({
            where: { id: parseInt(req.params.id) },
        });

        if (!review) return res.status(404).json({ message: "Review not found!" });

        if (review.userId !== req.user.id) {
            return res.status(403).json({ message: "Not authorized!" });
        }

        await prisma.review.delete({ where: { id: parseInt(req.params.id) } });

        res.json({ message: "Review deleted successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong!", error });
    }
};

module.exports = { addReview, getBookReviews, updateReview, deleteReview };