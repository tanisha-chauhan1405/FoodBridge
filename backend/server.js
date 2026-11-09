// Import required packages
const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Create Express application
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Home route
app.get("/", (req, res) => {
    res.send("Welcome to FoodBridge Backend!");
});

// Health check API
app.get("/api/health", (req, res) => {

    res.status(200).json({
        success: true,
        message: "FoodBridge API is running successfully!"
    });

});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`FoodBridge server running on port ${PORT}`);
});