# Bookstore App - Ecommerce Website

**Live Demo:** [https://bookstore-client-1tbf.onrender.com/](https://bookstore-client-1tbf.onrender.com/)

A full-stack e-commerce application tailored for book lovers. This application features a clean, responsive design, secure authentication, admin management, and a complete end-to-end shopping workflow.

## ✨ Features

- **📖 Browsing & Filtering**: Explore a catalog of books with functional search and genre filtering.
- **🔐 Secure Authentication**: Full user registration and login system protected with JWT (JSON Web Tokens).
- **🛒 Shopping Cart**: Seamlessly add items, adjust quantities, and view cart totals with persistent local state.
- **💳 Checkout Workflow**: Step-by-step simulated checkout process for finalizing orders (built with mock payment functionality for demonstration purposes, no real charges).
- **🛡️ Admin Dashboard**: Dedicated secure interface for administrators to add, edit, and delete inventory, as well as oversee all customer orders.
- **❤️ Wishlist & User Profiles**: Users can save books for later and manage their profiles and order history.
- **📱 Responsive Layout**: Optimized for seamless use on desktop, tablet, and mobile devices.

## 🚀 Tech Stack

- **Frontend**: [React.js](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Styling**: Vanilla CSS, Framer Motion for animations, and Lucide React for iconography.
- **Backend**: [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: JWT & Bcrypt

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database running locally or in the cloud.

### Local Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/RamyaRenganathan-2002/Bookstore_APP.git
   cd bookstore-app
   ```

2. **Setup Server (Backend)**
   ```bash
   cd server
   npm install
   
   # Duplicate the environment template
   cp .env.example .env
   
   # IMPORTANT: Update your .env with your PostgreSQL DATABASE_URL and a secure JWT_SECRET
   
   # Push your schema to the database:
   npx prisma db push
   
   # Start the Express server
   npm run dev
   ```

3. **Setup Client (Frontend)**
   Open a new terminal window:
   ```bash
   cd client
   npm install
   
   # Duplicate the environment template
   cp .env.example .env
   
   # Ensure VITE_API_URL points to your server (e.g., http://localhost:5000/api)
   
   # Start the Vite development server
   npm run dev
   ```

## 🌐 Production Deployment

This application is deployed as two decoupled services on Render:

### 1. Server (Web Service)
- Connect your GitHub repository to a new Render **Web Service**.
- **Root Directory**: `server`
- **Build Command**: `npm install`
- **Start Command**: `node index.js`
- Set your `DATABASE_URL` and `JWT_SECRET` in the Environment configuration section. Ensure you run `npx prisma db push` against the production DB.

### 2. Client (Static Site)
- Connect your GitHub repository to a new Render **Static Site**.
- **Root Directory**: `client`
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`
- Add a new **Redirects/Rewrites Rule** in the Render Dashboard so React Router can handle routing:
  - **Source**: `/*`
  - **Destination**: `/index.html`
  - **Action**: `Rewrite`
- Set your `VITE_API_URL` environment variable to your newly deployed Backend Web Service URL.

---
Built with ❤️ by Ramya
