const express = require('express');
const authRoutes = require('./routes/auth.route');


const app = express();
app.use(express.json()); // Middleware to parse JSON request bodies.

app.use("/api/auth", authRoutes);

module.exports = app;