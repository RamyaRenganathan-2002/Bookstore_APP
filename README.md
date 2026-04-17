# 📚 The Great Library - Full-Stack Bookstore Application

A premium, full-stack e-commerce experience for book lovers. Built with the MERN-ish stack (React, Node, Express, Prisma, PostgreSQL), this application features a sophisticated design, robust authentication, and a complete shopping workflow.

![Project Banner](https://via.placeholder.com/1200x400?text=The+Great+Library+Project+Hero)

## ✨ Features

- **📖 Elegant Book Browser**: Explore a curated collection of books with advanced filtering and search.
- **🔐 Secure Authentication**: Full user registration and login system with JWT protection.
- **🛒 Shopping Cart**: Seamlessly add books to your cart with persistent state.
- **💳 Checkout Workflow**: Professional checkout process for finalizing book orders.
- **⭐ Reviews & Ratings**: Share your thoughts on your favorite reads.
- **❤️ Wishlist**: Save books for later in your personalized wishlist.
- **🛡️ Admin Dashboard**: specialized interface for managing inventory and orders (Admin only).
- **📱 Fully Responsive**: Optimized for desktop, tablet, and mobile devices.

## 🚀 Tech Stack

- **Frontend**: [React.js](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Styling**: Vanilla CSS with modern Design Tokens & [TailwindCSS](https://tailwindcss.com/)
- **Backend**: [Node.js](https://nodejs.org/) & [Express](https://expressjs.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: JWT (JSON Web Tokens) & Bcrypt
- **API Client**: Axios

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/bookstore-app.git
   cd bookstore-app
   ```

2. **Setup Server**
   ```bash
   cd server
   npm install
   cp .env.example .env
   # Update your .env with your DATABASE_URL and JWT_SECRET
   npx prisma migrate dev
   npm run dev
   ```

3. **Setup Client**
   ```bash
   cd ../client
   npm install
   cp .env.example .env
   # Ensure VITE_API_URL points to your server (e.g., http://localhost:5000/api)
   npm run dev
   ```

## 🌐 Deployment (Render)

### Server (Web Service)
1. In Render, create a new **Web Service**.
2. Connect your GitHub repository.
3. Set **Root Directory** to `server`.
4. **Build Command**: `npm install && npx prisma generate`
5. **Start Command**: `npm start`
6. Add Environment Variables: `DATABASE_URL`, `JWT_SECRET`, etc.

### Client (Static Site)
1. In Render, create a new **Static Site**.
2. Connect your GitHub repository.
3. Set **Root Directory** to `client`.
4. **Build Command**: `npm run build`
5. **Publish Directory**: `dist`
6. Add Environment Variable: `VITE_API_URL` (pointing to your deployed server URL).

## 📝 License
Distributed under the MIT License. See `LICENSE` for more information.

---
Built with ❤️ by [Your Name]
