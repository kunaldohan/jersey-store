# ⚽ JerseyVault — Full Stack Jersey Store

A full-stack e-commerce web app for buying football/sports jerseys. Built with React, Node.js, Express, PostgreSQL, and Prisma.

---

## 🚀 Features

### 🔐 Authentication
- JWT-based login & registration
- Password hashing with bcrypt
- Protected routes via middleware

### 🛍️ Products
- Browse all jerseys
- Filter by team and price range
- Product detail page

### 🛒 Cart
- Add / remove items
- Update quantity
- Cart persisted in the database (not localStorage)

### 📦 Orders
- Place an order from cart
- View order history
- Order status: `pending`, `shipped`, `delivered`

### 🧑‍💼 Admin Panel
- Separate admin login
- Add, edit, delete jerseys
- View all orders and update their status

---

## 🧠 Tech Stack

| Layer      | Tech                          |
|------------|-------------------------------|
| Frontend   | React (Vite) + Tailwind CSS   |
| Backend    | Node.js + Express             |
| Database   | PostgreSQL + Prisma ORM       |
| Auth       | JWT + bcrypt                  |

---

## 📁 Folder Structure

```
jersey-store/
├── server/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js
│   ├── index.js
│   └── package.json
└── client/
    ├── src/
    │   ├── api/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   └── App.jsx
    └── package.json
```

---

## ⚙️ Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/jersey-store.git
cd jersey-store
```

### 2. Setup the Server

```bash
cd server
npm install
cp .env.example .env
# Fill in your DATABASE_URL and JWT_SECRET in .env
npx prisma migrate dev --name init
node prisma/seed.js
npm run dev
```

### 3. Setup the Client

```bash
cd client
npm install
cp .env.example .env
# Set VITE_API_URL=http://localhost:5000
npm run dev
```

### 4. Open in Browser

Visit `http://localhost:5173`

**Default Admin Credentials (from seed):**
- Email: `admin@jerseyvault.com`
- Password: `admin123`

---

## 🌍 Deployment

- **Backend**: Deploy to [Render](https://render.com) or [Railway](https://railway.app)
  - Set `DATABASE_URL` and `JWT_SECRET` in environment variables
  - Start command: `node index.js`

- **Frontend**: Deploy to [Vercel](https://vercel.com)
  - Set `VITE_API_URL` to your backend URL

---

## 🔮 Future Improvements

- Payment integration (Stripe / Razorpay)
- Product image upload (Cloudinary)
- Review and ratings system
- Wishlist feature
- Email notifications on order status change
- Search functionality
- Pagination for products

---

## 👨‍💻 Author

Built as an internship-level full-stack project. Feel free to fork and extend!
