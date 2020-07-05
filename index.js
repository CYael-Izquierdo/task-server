const express = require("express");
const connectDB = require("./config/db")

// Create server
const app = express();

// Connect mongo DB
connectDB();

// Enable express.json
app.use(express.json({extended: true}));

// Server port
const PORT = process.env.PORT || 4000;

// Import routes
app.use("/api/users", require("./routes/users"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/projects", require("./routes/projects"));

// Run server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});