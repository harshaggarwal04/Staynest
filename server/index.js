const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");

const authRoutes = require("./routes/auth.js");
const listingRoutes = require("./routes/listing.js");
const BookingRoutes = require("./routes/booking.js");
const userRoutes = require("./routes/user.js");


app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

const PORT = 3001;

async function startServer() {
  try {
    
    await mongoose.connect(process.env.MONGO_URL, { dbName: "StayNest" });
    console.log("Connected to MongoDB");

    
    app.use("/auth", authRoutes);
    app.use('/properties', listingRoutes);
    app.use("/bookings", BookingRoutes);
    app.use("/users", userRoutes);


    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
  }
}

// Start everything
startServer();
