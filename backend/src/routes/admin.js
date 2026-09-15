const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { isAdmin } = require('../middleware/role');
const User = require('../models/User');
const OrganizationProfile = require('../models/OrganizationProfile');
const Internship = require('../models/Internship');
const Application = require('../models/Application');

// GET ALL ORGANIZATIONS FOR VERIFICATION
router.get('/organizations', auth, isAdmin, async (req, res) => {
  try {
    const orgProfiles = await OrganizationProfile.find().populate('user', 'fullName email createdAt');
    return res.json({ success: true, count: orgProfiles.length, organizations: orgProfiles });
  } catch (err) {
    console.error('Admin get orgs error:', err);
    return res.status(500).json({ success: false, message: 'Error retrieving organization accounts.' });
  }
});

// VERIFY OR REJECT ORGANIZATION ACCOUNT
router.patch('/organizations/:id/verify', auth, isAdmin, async (req, res) => {
  try {
    const { isVerified } = req.body;
    const profile = await OrganizationProfile.findById(req.params.id);
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Organization profile not found.' });
    }

    profile.isVerified = Boolean(isVerified);
    await profile.save();

    return res.json({
      success: true,
      message: `Organization account ${isVerified ? 'verified' : 'unverified'} successfully.`,
      organization: profile
    });
  } catch (err) {
    console.error('Admin verify org error:', err);
    return res.status(500).json({ success: false, message: 'Error updating organization verification.' });
  }
});

// GET PLATFORM OVERVIEW STATISTICS
router.get('/stats', auth, isAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalApplicants = await User.countDocuments({ role: 'applicant' });
    const totalOrganizations = await User.countDocuments({ role: 'organization' });
    const totalInternships = await Internship.countDocuments();
    const activeInternships = await Internship.countDocuments({ status: 'published' });
    const totalApplications = await Application.countDocuments();

    return res.json({
      success: true,
      stats: {
        totalUsers,
        totalApplicants,
        totalOrganizations,
        totalInternships,
        activeInternships,
        totalApplications
      }
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    return res.status(500).json({ success: false, message: 'Error retrieving platform statistics.' });
  }
});

// GET ALL USERS LIST
router.get('/users', auth, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    return res.json({ success: true, count: users.length, users });
  } catch (err) {
    console.error('Admin get users error:', err);
    return res.status(500).json({ success: false, message: 'Error retrieving users.' });
  }
});

module.exports = router;
