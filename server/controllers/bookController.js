const prisma = require("../lib/client");

// Get all books
const getAllBooks = async (req, res) => {
    try {
        const { genre, search } = req.query;

        const books = await prisma.book.findMany({
            where: {
                AND: [
                    genre ? { genre } : {},
                    search
                        ? {
                            OR: [
                                { title: { contains: search, mode: "insensitive" } },
                                { author: { contains: search, mode: "insensitive" } },
                            ],
                        }
                        : {},
                ],
            },
        });

        res.json(books);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong!", error });
    }
};

// Get single book
const getBook = async (req, res) => {
    try {
        const book = await prisma.book.findUnique({
            where: { id: parseInt(req.params.id) },
            include: { reviews: true },
        });

        if (!book) return res.status(404).json({ message: "Book not found!" });

        res.json(book);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong!", error });
    }
};

// Create book (admin only)
const createBook = async (req, res) => {
    try {
        const { title, author, description, price, cover, genre, stock } = req.body;

        const book = await prisma.book.create({
            data: { title, author, description, price, cover, genre, stock },
        });

        res.status(201).json(book);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong!", error });
    }
};

// Update book (admin only)
const updateBook = async (req, res) => {
    try {
        const book = await prisma.book.update({
            where: { id: parseInt(req.params.id) },
            data: req.body,
        });

        res.json(book);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong!", error });
    }
};

// Delete book (admin only)
const deleteBook = async (req, res) => {
    try {
        await prisma.book.delete({
            where: { id: parseInt(req.params.id) },
        });

        res.json({ message: "Book deleted successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong!", error });
    }
};

module.exports = { getAllBooks, getBook, createBook, updateBook, deleteBook };