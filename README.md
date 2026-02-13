# Chuks Kitchen Backend

Backend API for Chuks Kitchen food ordering system built with Node.js and Express.

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

## 🛠 Tech Stack

- Node.js
- Express.js
- REST API
- In-memory storage

---

## 🚀 Running the Project

### Install Dependencies
```bash
npm install
```

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
- POST /signup
- POST /verify

### Food
- GET /foods
- POST /foods

### Cart
- POST /cart
- GET /cart/:customer_name
- DELETE /cart/:customer_name

### Orders
- POST /orders
- POST /orders/:id/pay
- GET /orders
- GET /orders/:id
- GET /orders/user/:customer_name
- PATCH /orders/:id/status
- POST /orders/:id/cancel
- DELETE /orders/:id

---

## 🔄 Order Lifecycle

Pending → Confirmed → Preparing → Out for Delivery → Completed

Orders may be cancelled before completion.

---

## ⚠ Edge Case Handling

- Duplicate user registration blocked
- Unavailable food items blocked
- Status update blocked if payment not confirmed
- Completed orders cannot be cancelled

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
