const express = require('express');
const cookieParser = require('cookie-parser');


const app = express();

app.use(express.json()); // Middleware to parse JSON request bodies.
app.use(cookieParser()); // Middleware to parse cookies.


/**
 * - Route Imports
 */
const authRoutes = require('./routes/auth.route');
const accountRoutes = require('./routes/account.route');


/**
 * - Use Routes
 */
app.use("/api/auth", authRoutes);
app.use("/api/accounts", accountRoutes);



module.exports = app;