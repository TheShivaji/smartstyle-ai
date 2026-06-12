<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0f0c29,30:1a1040,60:302b63,100:24243e&height=200&section=header&text=SmartStyle%20AI&fontSize=52&fontAlign=50&animation=fadeIn&fontAlignY=40&desc=Full%20Stack%20Fashion%20E-Commerce%20%7C%20Seller%20%2B%20Buyer%20%7C%20ImageKit%20CDN&descAlign=50&descAlignY=62&fontColor=ffffff&descColor=a78bfa" />

<br/>

![Stack](https://img.shields.io/badge/Stack-MERN-7c3aed?style=flat-square)
![Status](https://img.shields.io/badge/Status-In%20Progress-a855f7?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-22c55e?style=flat-square)

> **Full stack fashion e-commerce — Seller dashboard + Buyer storefront + Cart system + ImageKit CDN**

</div>

---

## 🛍️ What is SmartStyle AI?

A full stack fashion e-commerce platform with two separate roles — **Seller** and **Buyer**.

Sellers can create products with multiple variants (size, color, etc.), upload images via **ImageKit CDN**, and manage their inventory. Buyers can browse all products, view details, manage their cart with stock validation, and update quantities.

Built with MERN stack + Redux Toolkit + Role-based auth.

---

## ✨ Features

### ✅ Done
- 🔐 **Auth System** — Register, Login, JWT + HTTP-only cookies, bcrypt
- 👤 **Role-based Access** — Seller + Buyer separate routes + middleware
- 📦 **Product Management** — Create, list, view products (Seller)
- 🖼️ **Image Upload** — ImageKit CDN via multer + @imagekit/nodejs
- 🎨 **Product Variants** — Size, color, stock, price per variant
- 🛒 **Cart System** — Add, remove, update quantity, delete cart
- ✅ **Stock Validation** — Can't add more than available stock
- 🔒 **Protected Routes** — Frontend guards (Protected, ProtectedBuyer, Public)
- 📦 **Redux Toolkit** — auth + cart + product slices
- ✅ **Input Validation** — express-validator on backend

### 🔜 Coming Soon
- 💳 Payment integration
- 🔍 Search + filter products
- 📊 Seller analytics dashboard
- 🚀 Deploy

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, React Router v7, Redux Toolkit, Tailwind CSS v4, Vite |
| **Backend** | Node.js, Express 5 |
| **Database** | MongoDB + Mongoose |
| **Image CDN** | ImageKit + multer |
| **Auth** | JWT, bcrypt, HTTP-only Cookies, cookie-parser |
| **Validation** | express-validator |

---

## 📁 Project Structure

```
smartstyle-ai/
├── Backend/
│   ├── server.js
│   ├── dao/
│   │   └── cart.dao.js              ← stock validation logic
│   └── src/
│       ├── app.js                   ← Express + CORS + routes
│       ├── config/
│       │   ├── config.js
│       │   └── database.js          ← MongoDB connection
│       ├── controllers/
│       │   ├── auth.controller.js   ← register, login, logout
│       │   └── product.controller.js← CRUD + cart + variants
│       ├── middlewares/
│       │   ├── auth.middleware.js   ← JWT protectRoute
│       │   └── seller.middleware.js ← seller-only routes
│       ├── models/
│       │   ├── auth.models.js       ← User schema
│       │   ├── product.models.js    ← Product + variants schema
│       │   ├── cart.models.js       ← Cart schema
│       │   └── priceSchema.js       ← Reusable price schema
│       ├── routes/
│       │   ├── auth.routes.js
│       │   └── product.routes.js
│       ├── service/
│       │   └── storage.service.js   ← ImageKit upload
│       ├── utils/
│       │   └── generateToken.js
│       └── validators/
│           ├── auth.validator.js
│           └── cart.validators.js
│
└── Frontend/
    └── src/
        ├── app/
        │   ├── App.jsx
        │   ├── app.routes.jsx        ← role-based route guards
        │   ├── app.store.js          ← Redux store
        │   └── index.css
        └── feature/
            ├── auth/                 ← slice + pages + hook
            ├── cart/                 ← slice + pages + hook
            └── product/
                ├── components/       ← Protected, ProtectedBuyer, Public, Loader
                ├── pages/            ← CreateProduct, ManageProduct,
                │                       ProductDetail, ShowAllProducts
                ├── hook/useProduct.js
                ├── services/product.api.js
                └── state/product.slice.js
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- ImageKit account

### Installation

```bash
git clone https://github.com/TheShivaji/smartstyle-ai.git
cd smartstyle-ai

cd Backend && npm install
cd ../Frontend && npm install
```

### Environment — `Backend/.env`

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id
```

### Run

```bash
# Backend
cd Backend && npm run dev

# Frontend
cd Frontend && npm run dev
```

```
Frontend → http://localhost:5173
Backend  → http://localhost:3000
```

---

## 🔌 API

```
Auth
────────────────────────────────────────
POST  /api/auth/register
POST  /api/auth/login
POST  /api/auth/logout

Products
────────────────────────────────────────
POST  /api/product/create              ← seller only
GET   /api/product/all                 ← seller: own products
GET   /api/product/buyer/all           ← buyer: all products
GET   /api/product/:id                 ← product details
POST  /api/product/:productId/variant  ← add variant

Cart
────────────────────────────────────────
POST   /api/product/:productId/variant/:variantId/cart  ← add to cart
GET    /api/product/cart                                 ← get cart
PATCH  /api/product/:productId/variant/:variantId/cart  ← update qty
DELETE /api/product/:productId/variant/:variantId/cart  ← remove item
DELETE /api/product/cart                                 ← clear cart
```

---

## 📌 Roadmap

- [x] Auth — register, login, JWT + HTTP-only cookies
- [x] Role-based access — Seller + Buyer middleware
- [x] Product CRUD — create, list, view
- [x] Product variants — size, color, stock, price
- [x] Image upload — ImageKit CDN via multer
- [x] Cart system — add, remove, update, delete
- [x] Stock validation — DAO layer
- [x] Redux Toolkit — auth + cart + product
- [x] Route guards — Protected, ProtectedBuyer, Public
- [x] Input validation — express-validator
- [ ] Payment integration
- [ ] Search + filter
- [ ] Seller analytics
- [ ] Deploy

---

<div align="center">

**Built by [Shivaji Jagdale](https://github.com/TheShivaji)**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat-square&logo=linkedin&logoColor=white)](https://linkedin.com/in/prathamesh-jagdale-48817330b)
[![GitHub](https://img.shields.io/badge/GitHub-171515?style=flat-square&logo=github&logoColor=white)](https://github.com/TheShivaji)

*⭐ Star this repo if you find it useful*

</div>

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:24243e,50:302b63,100:0f0c29&height=100&section=footer" />