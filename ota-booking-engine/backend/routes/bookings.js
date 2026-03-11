const express = require("express");
const { rooms } = require("../models/room");
const { bookings } = require("../models/booking");

const router = express.Router();

router.get("/", (_req, res) => {
  res.json(bookings);
});

router.post("/", (req, res) => {
  const { user_id, room_id, checkin, checkout, guest_name } = req.body;

  if (!user_id || !room_id || !checkin || !checkout || !guest_name) {
    return res.status(400).json({
      status: "error",
      message: "user_id, room_id, guest_name, checkin, and checkout are required"
    });
  }

  const checkinDate = new Date(checkin);
  const checkoutDate = new Date(checkout);
  if (Number.isNaN(checkinDate.getTime()) || Number.isNaN(checkoutDate.getTime())) {
    return res.status(400).json({ status: "error", message: "Invalid checkin/checkout date" });
  }

  if (checkoutDate <= checkinDate) {
    return res
      .status(400)
      .json({ status: "error", message: "Checkout must be after checkin" });
  }

  const room = rooms.find((item) => item.id === Number(room_id));
  if (!room) {
    return res.status(404).json({ status: "error", message: "Room not found" });
  }

  if (room.stock < 1) {
    return res.status(409).json({ status: "error", message: "Room out of stock" });
  }

  const stayInDays = Math.ceil((checkoutDate - checkinDate) / (1000 * 60 * 60 * 24));
  const total_price = stayInDays * room.price;

  const booking = {
    id: bookings.length + 1,
    user_id: Number(user_id),
    room_id: Number(room_id),
    guest_name,
    checkin,
    checkout,
    total_price,
    status: "pending_payment",
    created_at: new Date().toISOString()
  };

  room.stock -= 1;
  bookings.push(booking);

  return res.status(201).json({
    status: "success",
    message: "Booking created",
    data: booking,
    next_step: "Redirect to payment gateway"
  });
});

router.post("/:id/pay", (req, res) => {
  const bookingId = Number(req.params.id);
  const booking = bookings.find((item) => item.id === bookingId);

  if (!booking) {
    return res.status(404).json({ status: "error", message: "Booking not found" });
  }

  booking.status = "confirmed";
  booking.paid_at = new Date().toISOString();

  return res.json({
    status: "success",
    message: "Payment webhook processed",
    data: booking
  });
});

module.exports = router;
