const User = require('../models/User');

// Login User
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credential' });
    }

    // Check password
    if (user.password !== password) {
      return res.status(400).json({ message: 'Invalid credential' });
    }

    return res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};
