# Chuks Kitchen Backend

This is the backend for **Chuks Kitchen**, a food ordering and customer management platform.  
Built with **Node.js** and **Express**, it supports user registration, food management, cart, orders, and simulated payments.  

Backend API for Chuks Kitchen food ordering system built with Node.js and Express.

---

## 🚀 Features

- User signup and verification
- Browse available food items
- Add food items to cart
- Place orders
- Simulated payment confirmation
- Track and update order status
- Admin simulation for adding food items
- Partial order handling (only available items are processed)

---

## 📌 Project Overview

This system simulates a food ordering platform where users can:

- Register
- Browse available meals
- Add meals to cart
- Place orders
- Make simulated payments
- Track order status

Data is stored in-memory using arrays and objects.

---
## 📊 Backend Flowchart

![Chuks Kitchen Flowchart](./assets/chuks-kitchen-flowchart.png)

---

## 🛠 Tech Stack

### Prerequisites
- Node.js installed
- npm installed

### Technologies Used
- Node.js
- Express.js
- REST API
- In-memory storage

---

## 🚀 Running the Project

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/<cynthia679>/chuks-kitchen.git
cd chuks-kitchen-backend
npm install

### Start Server
```bash
node server.js
```

Server runs at:
```
http://localhost:3000
```

---

## 📚 API Endpoints

### User
- POST /signup → Register user (email/phone)
- POST /verify → Simulated verification (OTP)

### Food
- GET /foods → Return list of food items
- POST /foods → Add food item (Admin simulation)

### Cart
- POST /cart → Add items to cart
- GET /cart/:customer_name → View cart
- DELETE /cart/:customer_name → Clear cart

### Orders
- POST /orders → Create order from cart (only available items)
- POST /orders/:id/pay → Simulated payment
- GET /orders → Get all orders
- GET /orders/:id → Fetch order details & status
- GET /orders/user/:customer_name → Fetch orders for a specific user
- PATCH /orders/:id/status → Update order status (requires payment)
- POST /orders/:id/cancel → Cancel order (only by the customer)
- DELETE /orders/:id → Delete order

---

## 📈 Scalability Thoughts

If scaled to 10,000+ users:

- Replace in-memory storage with a database
- Implement authentication (JWT)
- Add payment gateway integration
- Use role-based access control
- Deploy using Docker and cloud infrastructure

---

## 📄 License

MIT License
