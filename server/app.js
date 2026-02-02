import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";

import userRoute from "./routers/user.route.js";
import ownerRouter from "./routers/owner.route.js";
import bookingRouter from "./routers/booking.route.js";
import carsRouter from "./routers/cars.route.js";

const app = express();

// ✅ Connect DB
await connectDB();

// ✅ Frontend origin (dev + prod)
const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";

// ✅ Trust proxy (important for cookies in production)
app.set("trust proxy", 1);

// ✅ CORS
app.use(
  cors({
    origin: clientOrigin,
    credentials: true,
  })
);

// ✅ Middlewares
app.use(express.json());
app.use(cookieParser());

// ✅ Routes
app.use("/api/user", userRoute);
app.use("/api/owner", ownerRouter);
app.use("/api/booking", bookingRouter);
app.use("/api/cars", carsRouter);

// ✅ Port (platform decides in production)
const PORT = process.env.PORT || 5000;

// ✅ Start server (REQUIRED in production)
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
