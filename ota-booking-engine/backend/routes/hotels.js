const express = require("express");
const { hotels } = require("../models/hotel");
const { rooms } = require("../models/room");

const router = express.Router();

router.get("/", (req, res) => {
  const { city, q, minPrice, maxPrice } = req.query;

  const filtered = hotels.filter((hotel) => {
    const cityMatch = city
      ? hotel.city.toLowerCase().includes(String(city).toLowerCase())
      : true;
    const queryMatch = q
      ? `${hotel.name} ${hotel.description}`
          .toLowerCase()
          .includes(String(q).toLowerCase())
      : true;
    const minPriceMatch = minPrice ? hotel.price >= Number(minPrice) : true;
    const maxPriceMatch = maxPrice ? hotel.price <= Number(maxPrice) : true;

    return cityMatch && queryMatch && minPriceMatch && maxPriceMatch;
  });

  res.json(filtered);
});

router.get("/:id", (req, res) => {
  const hotelId = Number(req.params.id);
  const hotel = hotels.find((item) => item.id === hotelId);

  if (!hotel) {
    return res.status(404).json({ status: "error", message: "Hotel not found" });
  }

  const hotelRooms = rooms.filter((room) => room.hotel_id === hotelId);
  return res.json({ ...hotel, rooms: hotelRooms });
});

module.exports = router;
