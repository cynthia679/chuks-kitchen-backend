const express = require('express');
const app = express();

// ======================
// Setup
// ======================
app.use(express.json());

// ======================
// In-memory storage
// ======================
let users = [];
let userIdCounter = 1;

let orders = [];
let orderIdCounter = 1;

let carts = {};

const foods = [
  { id: 1, name: "Spaghetti Bolognese", price: 1200, is_available: true },
  { id: 2, name: "Grilled Chicken", price: 1500, is_available: true },
  { id: 3, name: "Beef Burger", price: 900, is_available: true },
  { id: 4, name: "Veggie Pizza", price: 1000, is_available: false }
];

// ======================
// Test route
// ======================
app.get('/', (req, res) => {
  res.send('Chuks Kitchen Backend Running');
});

// ======================
// User routes
// ======================
app.post('/signup', (req, res) => {
  const { name, email, phone, referral_code } = req.body;
  if (!name || (!email && !phone)) {
    return res.status(400).json({ message: "Name and either email or phone required" });
  }

  const duplicate = users.find(u => u.email === email || u.phone === phone);
  if (duplicate) return res.status(400).json({ message: "User already exists" });

  const user = {
    id: userIdCounter++,
    name,
    email: email || null,
    phone: phone || null,
    referral_code: referral_code || null,
    verified: true
  };

  users.push(user);
  res.status(201).json({ message: "User registered successfully", user });
});

app.post('/verify', (req, res) => {
  const { user_id, otp } = req.body;
  const user = users.find(u => u.id === user_id);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.verified = true;
  res.json({ message: "User verified successfully", user });
});

// ======================
// Food routes
// ======================
app.get('/foods', (req, res) => {
  const availableFoods = foods.filter(f => f.is_available);
  res.json(availableFoods);
});

app.post('/foods', (req, res) => {
  const { name, price, is_available } = req.body;
  if (!name || !price) return res.status(400).json({ message: "Name and price required" });

  const food = {
    id: foods.length + 1,
    name,
    price,
    is_available: is_available ?? true
  };

  foods.push(food);
  res.status(201).json({ message: "Food added", food });
});

// ======================
// Cart routes
// ======================
app.post('/cart', (req, res) => {
  const { customer_name, items } = req.body;
  if (!customer_name || !items || !Array.isArray(items)) {
    return res.status(400).json({ message: "Invalid cart data" });
  }

  if (!carts[customer_name]) carts[customer_name] = [];
  carts[customer_name].push(...items);

  res.json({ message: "Items added to cart", cart: carts[customer_name] });
});

app.get('/cart/:customer_name', (req, res) => {
  const customer = req.params.customer_name;
  res.json({ cart: carts[customer] || [] });
});

app.delete('/cart/:customer_name', (req, res) => {
  const customer = req.params.customer_name;
  carts[customer] = [];
  res.json({ message: "Cart cleared" });
});

// ======================
// Orders routes (allow partial orders)
// ======================
app.post('/orders', (req, res) => {
  const { customer_name, items } = req.body || {};
  if (!customer_name || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Invalid order data" });
  }

  const user = users.find(u => u.name === customer_name);
  if (!user) return res.status(400).json({ message: "User must register before placing an order" });

  let total = 0;
  const availableItems = [];
  const unavailableItems = [];

  // Check which items are available
  items.forEach(itemId => {
    const food = foods.find(f => f.id === itemId);
    if (!food || !food.is_available) unavailableItems.push(itemId);
    else {
      total += food.price;
      availableItems.push(itemId);
    }
  });

  if (availableItems.length === 0) {
    return res.status(400).json({ message: "None of the selected items are available", unavailableItems });
  }

  // Create order with only available items
  const order = {
    id: orderIdCounter++,
    customer_name,
    items: availableItems,
    total,
    status: "Pending",
    payment_status: "Unpaid",
    unavailable_items: unavailableItems.length ? unavailableItems : undefined
  };

  orders.push(order);

  // Update cart: keep only unavailable items in the cart
  if (!carts[customer_name]) carts[customer_name] = [];
  carts[customer_name] = carts[customer_name].filter(i => unavailableItems.includes(i));

  res.status(201).json({
    message: "Order created with available items",
    order,
    unavailableItems: unavailableItems.length ? unavailableItems : undefined
  });
});


// Simulated payment
app.post('/orders/:id/pay', (req, res) => {
  const orderId = parseInt(req.params.id);
  const { payment_method } = req.body;

  const order = orders.find(o => o.id === orderId);
  if (!order) return res.status(404).json({ message: "Order not found" });
  if (order.payment_status === "Paid") return res.status(400).json({ message: "Order already paid" });

  order.payment_status = "Paid";
  order.status = "Confirmed";

  res.json({ message: "Payment successful, order confirmed", payment_method: payment_method || "Simulated", order });
});

// Get all orders
app.get('/orders', (req, res) => res.json(orders));

// Get all orders for a specific user
app.get('/orders/user/:customer_name', (req, res) => {
  const customer = req.params.customer_name;
  const userOrders = orders.filter(o => o.customer_name === customer);
  res.json({ orders: userOrders });
});

// Get order by ID
app.get('/orders/:id', (req, res) => {
  const orderId = parseInt(req.params.id);
  const order = orders.find(o => o.id === orderId);
  if (!order) return res.status(404).json({ message: "Order not found" });
  res.json(order);
});

// Update order status (requires payment)
app.patch('/orders/:id/status', (req, res) => {
  const orderId = parseInt(req.params.id);
  const { status } = req.body;
  const validStatuses = ["Pending", "Confirmed", "Preparing", "Out for Delivery", "Completed", "Cancelled"];

  if (!validStatuses.includes(status)) return res.status(400).json({ message: "Invalid status" });

  const order = orders.find(o => o.id === orderId);
  if (!order) return res.status(404).json({ message: "Order not found" });

  if (status !== "Cancelled" && order.payment_status !== "Paid") {
    return res.status(400).json({ message: "Cannot update status. Payment not confirmed." });
  }

  order.status = status;
  res.json({ message: "Order status updated", order });
});

// Customer cancels an order
app.post('/orders/:id/cancel', (req, res) => {
  const orderId = parseInt(req.params.id);
  const { customer_name } = req.body;

  const order = orders.find(o => o.id === orderId);
  if (!order) return res.status(404).json({ message: "Order not found" });

  if (order.customer_name !== customer_name) return res.status(403).json({ message: "You can only cancel your own orders" });
  if (order.status === "Completed") return res.status(400).json({ message: "Completed orders cannot be cancelled" });

  order.status = "Cancelled";
  res.json({ message: "Order cancelled successfully", order });
});

// Delete order
app.delete('/orders/:id', (req, res) => {
  const orderId = parseInt(req.params.id);
  const index = orders.findIndex(o => o.id === orderId);
  if (index === -1) return res.status(404).json({ message: "Order not found" });

  orders.splice(index, 1);
  res.json({ message: "Order deleted successfully" });
});

// ======================
// Start server
// ======================
app.listen(3000, () => console.log('Server running on port 3000'));
