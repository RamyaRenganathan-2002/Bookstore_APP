const prisma = require("../lib/client");

// Create order
const createOrder = async (req, res) => {
    try {
        const { items } = req.body;
        // items = [{ bookId: 1, quantity: 2 }, ...]

        // Calculate total price
        let total = 0;
        const orderItems = [];

        for (const item of items) {
            const book = await prisma.book.findUnique({
                where: { id: item.bookId },
            });

            if (!book) {
                return res.status(404).json({ message: `Book ${item.bookId} not found!` });
            }

            if (book.stock < item.quantity) {
                return res.status(400).json({ message: `Not enough stock for ${book.title}!` });
            }

            total += book.price * item.quantity;
            orderItems.push({
                bookId: book.id,
                quantity: item.quantity,
                price: book.price,
            });
        }

        // Create order with items
        const order = await prisma.order.create({
            data: {
                userId: req.user.id,
                total,
                items: {
                    create: orderItems,
                },
            },
            include: { items: true },
        });

        // Update stock for each book
        for (const item of items) {
            await prisma.book.update({
                where: { id: item.bookId },
                data: { stock: { decrement: item.quantity } },
            });
        }

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong!", error });
    }
};

// Get logged in user's orders
const getMyOrders = async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            where: { userId: req.user.id },
            include: {
                items: {
                    include: { book: true },
                },
            },
        });

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong!", error });
    }
};

// Get single order
const getOrder = async (req, res) => {
    try {
        const order = await prisma.order.findUnique({
            where: { id: parseInt(req.params.id) },
            include: {
                items: {
                    include: { book: true },
                },
            },
        });

        if (!order) return res.status(404).json({ message: "Order not found!" });

        if (order.userId !== req.user.id) {
            return res.status(403).json({ message: "Not authorized!" });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong!", error });
    }
};

module.exports = { createOrder, getMyOrders, getOrder };