const express = require("express");
const cors = require("cors");

const hotelsRouter = require("./routes/hotels");
const bookingsRouter = require("./routes/bookings");
const usersRouter = require("./routes/users");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "ota-booking-engine" });
});

app.use("/api/hotels", hotelsRouter);
app.use("/api/bookings", bookingsRouter);
app.use("/api/users", usersRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`OTA Server running on port ${PORT}`);
});
