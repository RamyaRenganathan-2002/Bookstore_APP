const prisma = require("../lib/client");

// Add to wishlist
const addToWishlist = async (req, res) => {
    try {
        const bookId = parseInt(req.params.bookId);

        // Check if book exists
        const book = await prisma.book.findUnique({ where: { id: bookId } });
        if (!book) return res.status(404).json({ message: "Book not found!" });

        // Check if already in wishlist
        const existing = await prisma.wishlist.findFirst({
            where: { userId: req.user.id, bookId },
        });
        if (existing) {
            return res.status(400).json({ message: "Book already in wishlist!" });
        }

        const wishlistItem = await prisma.wishlist.create({
            data: {
                userId: req.user.id,
                bookId,
            },
        });

        res.status(201).json(wishlistItem);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong!", error });
    }
};

// Get my wishlist
const getMyWishlist = async (req, res) => {
    try {
        const wishlist = await prisma.wishlist.findMany({
            where: { userId: req.user.id },
            include: {
                book: true,
            },
        });

        res.json(wishlist);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong!", error });
    }
};

// Remove from wishlist
const removeFromWishlist = async (req, res) => {
    try {
        const bookId = parseInt(req.params.bookId);

        const wishlistItem = await prisma.wishlist.findFirst({
            where: { userId: req.user.id, bookId },
        });

        if (!wishlistItem) {
            return res.status(404).json({ message: "Item not found in wishlist!" });
        }

        await prisma.wishlist.delete({ where: { id: wishlistItem.id } });

        res.json({ message: "Removed from wishlist!" });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong!", error });
    }
};

module.exports = { addToWishlist, getMyWishlist, removeFromWishlist };