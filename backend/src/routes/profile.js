const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const ApplicantProfile = require('../models/ApplicantProfile');
const OrganizationProfile = require('../models/OrganizationProfile');
const Skill = require('../models/Skill');
const upload = require('../middleware/upload');

// GET APPLICANT PROFILE
router.get('/applicant', auth, async (req, res) => {
  try {
    let profile = await ApplicantProfile.findOne({ user: req.user.id });
    if (!profile) {
      profile = new ApplicantProfile({ user: req.user.id });
    }
    const skillsCount = await Skill.countDocuments({ user: req.user.id });
    profile.calculateCompletion(skillsCount);
    await profile.save();

    return res.json({ success: true, profile });
  } catch (err) {
    console.error('Get applicant profile error:', err);
    return res.status(500).json({ success: false, message: 'Server error retrieving profile.' });
  }
});

// UPDATE APPLICANT PROFILE
router.put('/applicant', auth, async (req, res) => {
  try {
    const { fullName, bio, phone, educationHistory, links, careerDetails, avatar } = req.body;

    let profile = await ApplicantProfile.findOne({ user: req.user.id });
    if (!profile) {
      profile = new ApplicantProfile({ user: req.user.id });
    }

    if (bio !== undefined) profile.bio = bio;
    if (phone !== undefined) profile.phone = phone;
    if (avatar !== undefined) profile.avatar = avatar;
    if (educationHistory !== undefined) profile.educationHistory = educationHistory;
    if (links) {
      profile.links = { ...profile.links, ...links };
    }
    if (careerDetails) {
      profile.careerDetails = { ...profile.careerDetails, ...careerDetails };
    }

    if (fullName !== undefined && fullName.trim()) {
      const user = await User.findById(req.user.id);
      if (user) {
        user.fullName = fullName.trim();
        await user.save();
      }
    }

    profile.updatedAt = Date.now();
    const skillsCount = await Skill.countDocuments({ user: req.user.id });
    profile.calculateCompletion(skillsCount);
    await profile.save();

    return res.json({
      success: true,
      message: 'Profile updated successfully!',
      profile
    });
  } catch (err) {
    console.error('Update applicant profile error:', err);
    return res.status(500).json({ success: false, message: 'Server error updating profile.' });
  }
});

// UPLOAD RESUME / FILE
router.post('/upload', auth, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    return res.json({
      success: true,
      message: 'File uploaded successfully!',
      url: fileUrl,
      filename: req.file.originalname
    });
  } catch (err) {
    console.error('Upload error:', err);
    return res.status(500).json({ success: false, message: 'Error handling file upload.' });
  }
});

// GET ORGANIZATION PROFILE
router.get('/organization', auth, async (req, res) => {
  try {
    let profile = await OrganizationProfile.findOne({ user: req.user.id });
    if (!profile) {
      profile = new OrganizationProfile({
        user: req.user.id,
        orgName: req.user.fullName,
        officialEmail: req.user.email
      });
      await profile.save();
    }
    return res.json({ success: true, profile });
  } catch (err) {
    console.error('Get organization profile error:', err);
    return res.status(500).json({ success: false, message: 'Server error retrieving organization profile.' });
  }
});

// UPDATE ORGANIZATION PROFILE
router.put('/organization', auth, async (req, res) => {
  try {
    const { orgName, logo, officialEmail, description, website, linkedIn, industry, location, contactPerson } = req.body;

    let profile = await OrganizationProfile.findOne({ user: req.user.id });
    if (!profile) {
      profile = new OrganizationProfile({ user: req.user.id });
    }

    if (orgName !== undefined) profile.orgName = orgName;
    if (logo !== undefined) profile.logo = logo;
    if (officialEmail !== undefined) profile.officialEmail = officialEmail;
    if (description !== undefined) profile.description = description;
    if (website !== undefined) profile.website = website;
    if (linkedIn !== undefined) profile.linkedIn = linkedIn;
    if (industry !== undefined) profile.industry = industry;
    if (location !== undefined) profile.location = location;
    if (contactPerson !== undefined) profile.contactPerson = contactPerson;

    await profile.save();

    return res.json({
      success: true,
      message: 'Organization profile updated successfully!',
      profile
    });
  } catch (err) {
    console.error('Update organization profile error:', err);
    return res.status(500).json({ success: false, message: 'Server error updating organization profile.' });
  }
});

module.exports = router;
