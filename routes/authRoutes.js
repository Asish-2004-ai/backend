import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const router = express.Router();

// Hardcoded user
const hardcodedUser = {
  email: "intern@dacoid.com",
  password: bcrypt.hashSync("Test123", 10),
};

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (email !== hardcodedUser.email) {
    return res.status(401).json({ message: "Invalid email" });
  }

  const isMatch = await bcrypt.compare(password, hardcodedUser.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid password" });
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.json({ token });
});

export default router;
