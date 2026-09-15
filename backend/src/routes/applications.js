const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { isApplicant, isOrganization } = require('../middleware/role');
const Application = require('../models/Application');
const Internship = require('../models/Internship');
const Skill = require('../models/Skill');
const ApplicantProfile = require('../models/ApplicantProfile');
const { getMatchScore } = require('../utils/aiClient');

// SUBMIT INTERNSHIP APPLICATION (Applicant only)
router.post('/', auth, isApplicant, async (req, res) => {
  try {
    const {
      internshipId,
      fullName,
      email,
      phone,
      college,
      course,
      resume,
      github,
      linkedin,
      portfolio,
      coverLetter,
      relevantSkills,
      availability
    } = req.body;

    if (!internshipId) {
      return res.status(400).json({ success: false, message: 'Internship ID is required.' });
    }

    const internship = await Internship.findById(internshipId);
    if (!internship) {
      return res.status(404).json({ success: false, message: 'Internship not found or no longer available.' });
    }

    if (internship.status !== 'published') {
      return res.status(400).json({ success: false, message: 'This internship is no longer accepting applications.' });
    }

    // Check for existing application (prevent duplicates)
    const existing = await Application.findOne({
      internship: internshipId,
      applicant: req.user.id
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted an application for this internship.',
        application: existing
      });
    }

    // Get applicant skills for AI match scoring
    const applicantSkills = await Skill.find({ user: req.user.id });
    const profile = await ApplicantProfile.findOne({ user: req.user.id });

    // Calculate real AI match score
    const aiResult = await getMatchScore({
      applicant_skills: applicantSkills,
      career_interests: profile ? profile.careerDetails.interests : [],
      preferred_domain: profile ? profile.careerDetails.preferredDomain : '',
      internship_title: internship.title,
      internship_requirements: internship.requirements || internship.description,
      required_skills: internship.requiredSkills || []
    });

    const application = new Application({
      internship: internship._id,
      organization: internship.organization,
      applicant: req.user.id,
      fullName: fullName || req.user.fullName,
      email: email || req.user.email,
      phone: phone || (profile ? profile.phone : ''),
      college: college || '',
      course: course || '',
      resume: resume || (profile && profile.links ? profile.links.resume : ''),
      github: github || (profile && profile.links ? profile.links.github : ''),
      linkedin: linkedin || (profile && profile.links ? profile.links.linkedin : ''),
      portfolio: portfolio || (profile && profile.links ? profile.links.portfolio : ''),
      coverLetter: coverLetter || '',
      relevantSkills: Array.isArray(relevantSkills) ? relevantSkills : applicantSkills.map(s => s.name),
      availability: availability || 'Immediate',
      status: 'Applied',
      compatibilityScore: aiResult.compatibility_score || 75
    });

    await application.save();

    return res.status(201).json({
      success: true,
      message: 'Application submitted successfully! You can track its status in My Applications.',
      application
    });

  } catch (err) {
    console.error('Submit application error:', err);
    return res.status(500).json({ success: false, message: 'Server error submitting application.' });
  }
});

// GET MY APPLICATIONS (Applicant view)
router.get('/my-applications', auth, isApplicant, async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user.id })
      .populate('internship')
      .sort({ appliedDate: -1 });

    return res.json({
      success: true,
      count: applications.length,
      applications
    });
  } catch (err) {
    console.error('Get my applications error:', err);
    return res.status(500).json({ success: false, message: 'Server error fetching applications.' });
  }
});

// GET APPLICATIONS RECEIVED FOR ALL ORGANIZATIONS POSTS (Organization view)
router.get('/received', auth, isOrganization, async (req, res) => {
  try {
    const { internshipId, status } = req.query;

    let query = { organization: req.user.id };

    if (internshipId) {
      query.internship = internshipId;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    const applications = await Application.find(query)
      .populate('internship')
      .populate('applicant', 'fullName email')
      .sort({ appliedDate: -1 });

    const applicationsWithProfiles = await Promise.all(applications.map(async (application) => {
      const applicantId = application.applicant?._id || application.applicant;
      const applicantProfile = applicantId
        ? await ApplicantProfile.findOne({ user: applicantId })
        : null;
      application.avatar = applicantProfile?.avatar || '';
      return application;
    }));

    return res.json({
      success: true,
      count: applicationsWithProfiles.length,
      applications: applicationsWithProfiles
    });
  } catch (err) {
    console.error('Get received applications error:', err);
    return res.status(500).json({ success: false, message: 'Server error fetching received applications.' });
  }
});

// UPDATE APPLICATION STATUS (Shortlist, Select, Reject, Under Review)
router.patch('/:id/status', auth, isOrganization, async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['Applied', 'Under Review', 'Shortlisted', 'Selected', 'Rejected'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: `Invalid status. Must be one of: ${allowedStatuses.join(', ')}` });
    }

    let application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    // Access control check: org can only manage applications for its own internships
    if (application.organization.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied. You cannot manage applications belonging to other organizations.' });
    }

    application.status = status;
    application.updatedAt = Date.now();
    await application.save();

    return res.json({
      success: true,
      message: `Application status updated to ${status}.`,
      application
    });
  } catch (err) {
    console.error('Update app status error:', err);
    return res.status(500).json({ success: false, message: 'Server error updating application status.' });
  }
});

module.exports = router;
