const express = require('express');
const authRoutes = require('./routes/auth.route');
const cookieParser = require('cookie-parser');


const app = express();
app.use(express.json()); // Middleware to parse JSON request bodies.
app.use(cookieParser()); // Middleware to parse cookies.

app.use("/api/auth", authRoutes);

module.exports = app;