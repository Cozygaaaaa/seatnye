const express = require("express");

const router = express.Router();

const users = [
  {
    id: 1,
    name: "Demo User",
    email: "demo@ota.local",
    role: "customer"
  }
];

router.get("/", (_req, res) => {
  res.json(users);
});

router.post("/", (req, res) => {
  const { name, email, role = "customer" } = req.body;

  if (!name || !email) {
    return res.status(400).json({ status: "error", message: "name and email are required" });
  }

  const newUser = { id: users.length + 1, name, email, role };
  users.push(newUser);

  return res.status(201).json({ status: "success", data: newUser });
});

module.exports = router;
