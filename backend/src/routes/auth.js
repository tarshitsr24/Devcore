const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const User = require('../models/User');
const ApplicantProfile = require('../models/ApplicantProfile');
const OrganizationProfile = require('../models/OrganizationProfile');
const Skill = require('../models/Skill');

// SIGNUP (Common page for Applicants and Organizations)
router.post('/signup', async (req, res) => {
  try {
    const { fullName, email, password, role, skills } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please fill in all required fields (Name, Email, Password).' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email address already exists.' });
    }

    const userRole = (role === 'organization') ? 'organization' : 'applicant';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      fullName,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: userRole
    });

    await user.save();

    let completionPercentage = 30;

    if (userRole === 'applicant') {
      const profile = new ApplicantProfile({ user: user._id });
      
      // Save optional skills if provided during signup Step 3
      if (Array.isArray(skills) && skills.length > 0) {
        const skillDocs = skills.map(s => ({
          user: user._id,
          name: s.name,
          category: s.category || 'Technical',
          level: s.level || 'Intermediate'
        }));
        await Skill.insertMany(skillDocs);
      }

      completionPercentage = profile.calculateCompletion(Array.isArray(skills) ? skills.length : 0);
      await profile.save();
    } else {
      const profile = new OrganizationProfile({
        user: user._id,
        orgName: fullName,
        officialEmail: email.toLowerCase()
      });
      await profile.save();
    }

    const payload = {
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      role: user.role
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'devcore_super_secret_jwt_key_2026_hackathon',
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        completionPercentage
      }
    });

  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ success: false, message: 'Server error during account registration.' });
  }
});

// LOGIN (Common page for Applicants and Organizations)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both email and password.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid email or password.' });
    }

    let completionPercentage = 100;
    if (user.role === 'applicant') {
      const profile = await ApplicantProfile.findOne({ user: user._id });
      const skillsCount = await Skill.countDocuments({ user: user._id });
      if (profile) {
        completionPercentage = profile.calculateCompletion(skillsCount);
        await profile.save();
      }
    }

    const payload = {
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      role: user.role
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'devcore_super_secret_jwt_key_2026_hackathon',
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        completionPercentage
      }
    });

  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Server error during authentication.' });
  }
});

// GET CURRENT USER PROFILE & AUTH CHECK
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    let profile = null;
    let completionPercentage = 100;

    if (user.role === 'applicant') {
      profile = await ApplicantProfile.findOne({ user: user._id });
      const skillsCount = await Skill.countDocuments({ user: user._id });
      if (profile) {
        completionPercentage = profile.calculateCompletion(skillsCount);
      }
    } else if (user.role === 'organization') {
      profile = await OrganizationProfile.findOne({ user: user._id });
    }

    return res.json({
      success: true,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        completionPercentage
      },
      profile
    });
  } catch (err) {
    console.error('Get me error:', err);
    return res.status(500).json({ success: false, message: 'Server error fetching user details.' });
  }
});

module.exports = router;
