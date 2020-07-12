const express = require("express");
const connectDB = require("./config/db");
const mongoose = require("mongoose");
const cors = require("cors");

// Create server
const app = express();

// Connect mongo DB
connectDB();
mongoose.set('useFindAndModify', false);

// Enable CORS
app.use(cors());

// Enable express.json
app.use(express.json({extended: true}));

// Server port
const PORT = process.env.PORT || 4000;

// Import routes
app.use("/api/users", require("./routes/users"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/projects", require("./routes/projects"));
app.use("/api/tasks", require("./routes/tasks"));

// Run server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
