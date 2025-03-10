import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, userNGO, userNGOrole } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      userNGO: userNGO || "",
      userNGOrole: userNGOrole || ""
    });

    await newUser.save();

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        points: newUser.points,
        userNGO: newUser.userNGO,
        userNGOrole: newUser.userNGOrole,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * POST /api/users/login
 * Authenticates a user by comparing the password hash and issues a JWT token.
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        points: user.points,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * GET /api/users/rankings
 * Retrieves a sorted list of users/NGOs based on points (descending).
 */
router.get('/rankings', async (req, res) => {
  try {
    const users = await User.find()
      .sort({ points: -1 })
      .limit(10)
      .select('-password'); // Exclude password field

    res.json(users);
  } catch (error) {
    console.error('Rankings error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

//Rank based return
router.get('/rankings', async (req, res) => {
  try {
    // Retrieve users sorted by points in descending order (highest score first)
    const rankedUsers = await User.find()
      .sort({ points: -1 })
      .select('-password'); // Exclude password field for security

    res.json(rankedUsers);
  } catch (error) {
    console.error('Rankings error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


export default router;
