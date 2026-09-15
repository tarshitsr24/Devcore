const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { isApplicant } = require('../middleware/role');
const Internship = require('../models/Internship');
const Skill = require('../models/Skill');
const ApplicantProfile = require('../models/ApplicantProfile');
const { getRecommendations, getCertificationRecommendations } = require('../utils/aiClient');

// GET AI RECOMMENDED INTERNSHIPS FOR LOGGED-IN APPLICANT
router.get('/internships', auth, isApplicant, async (req, res) => {
  try {
    const applicantSkills = await Skill.find({ user: req.user.id });
    const profile = await ApplicantProfile.findOne({ user: req.user.id });
    const publishedInternships = await Internship.find({ status: 'published' }).sort({ postedDate: -1 });

    if (publishedInternships.length === 0) {
      return res.json({ success: true, count: 0, data: [] });
    }

    const careerInterests = profile ? (profile.careerDetails.interests || []) : [];
    const preferredDomain = profile ? (profile.careerDetails.preferredDomain || '') : '';

    const recommendations = await getRecommendations(
      applicantSkills,
      careerInterests,
      preferredDomain,
      publishedInternships
    );

    return res.json({
      success: true,
      count: recommendations.length,
      recommendations
    });
  } catch (err) {
    console.error('Get AI internship recommendations error:', err);
    return res.status(500).json({ success: false, message: 'Server error retrieving AI recommendations.' });
  }
});

// GET AI RECOMMENDED CERTIFICATIONS & SKILL GAP COURSES FOR APPLICANT
router.get('/certifications', auth, isApplicant, async (req, res) => {
  try {
    const applicantSkills = await Skill.find({ user: req.user.id });
    const profile = await ApplicantProfile.findOne({ user: req.user.id });

    const careerInterests = profile ? (profile.careerDetails.interests || []) : [];
    const preferredDomain = profile ? (profile.careerDetails.preferredDomain || '') : '';

    const certs = await getCertificationRecommendations(
      applicantSkills,
      careerInterests,
      preferredDomain
    );

    return res.json({
      success: true,
      count: certs.length,
      certifications: certs
    });
  } catch (err) {
    console.error('Get certification recommendations error:', err);
    return res.status(500).json({ success: false, message: 'Server error retrieving certification recommendations.' });
  }
});

module.exports = router;
