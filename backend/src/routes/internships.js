const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { isOrganization } = require('../middleware/role');
const Internship = require('../models/Internship');
const OrganizationProfile = require('../models/OrganizationProfile');

// GET PUBLIC MARKETPLACE INTERNSHIPS (WITH FILTERS AND SEARCH)
router.get('/', async (req, res) => {
  try {
    const { q, domain, workMode, location, skill, stipend } = req.query;

    let query = { status: 'published' };

    if (q) {
      const searchRegex = new RegExp(q.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { orgName: searchRegex },
        { description: searchRegex },
        { requiredSkills: searchRegex }
      ];
    }

    if (workMode && workMode !== 'All') {
      query.workMode = workMode;
    }

    if (location) {
      query.location = new RegExp(location.trim(), 'i');
    }

    if (skill) {
      query.requiredSkills = new RegExp(skill.trim(), 'i');
    }

    if (stipend && stipend === 'paid') {
      query.stipend = { $not: new RegExp('Unpaid', 'i') };
    }

    const internships = await Internship.find(query).sort({ postedDate: -1 });

    return res.json({
      success: true,
      count: internships.length,
      internships
    });
  } catch (err) {
    console.error('Get internships error:', err);
    return res.status(500).json({ success: false, message: 'Server error retrieving internships.' });
  }
});

// GET ORGANIZATION'S OWN INTERNSHIPS
router.get('/organization/my-posts', auth, isOrganization, async (req, res) => {
  try {
    const internships = await Internship.find({ organization: req.user.id }).sort({ postedDate: -1 });
    return res.json({ success: true, count: internships.length, internships });
  } catch (err) {
    console.error('Get org posts error:', err);
    return res.status(500).json({ success: false, message: 'Server error retrieving internship posts.' });
  }
});

// GET SINGLE INTERNSHIP DETAIL BY ID
router.get('/:id', async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);
    if (!internship) {
      return res.status(404).json({ success: false, message: 'Internship not found.' });
    }

    // Fetch org details if needed
    const orgProfile = await OrganizationProfile.findOne({ user: internship.organization });

    return res.json({
      success: true,
      internship,
      organizationProfile: orgProfile
    });
  } catch (err) {
    console.error('Get internship detail error:', err);
    return res.status(500).json({ success: false, message: 'Server error fetching internship details.' });
  }
});

// POST INTERNSHIP (Organization only)
router.post('/', auth, isOrganization, async (req, res) => {
  try {
    const {
      title,
      description,
      responsibilities,
      requirements,
      requiredSkills,
      duration,
      location,
      workMode,
      stipend,
      eligibility,
      applicationDeadline,
      openings,
      benefits,
      contactDetails,
      status
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Internship title and description are required.' });
    }

    // Fetch Org logo and name
    const orgProfile = await OrganizationProfile.findOne({ user: req.user.id });
    const orgName = orgProfile ? orgProfile.orgName : req.user.fullName;
    const orgLogo = orgProfile ? orgProfile.logo : '';

    const formattedSkills = Array.isArray(requiredSkills)
      ? requiredSkills.map(s => (typeof s === 'string' ? s.trim() : s.name))
      : (typeof requiredSkills === 'string' ? requiredSkills.split(',').map(s => s.trim()) : []);

    const internship = new Internship({
      organization: req.user.id,
      orgName,
      orgLogo,
      title: title.trim(),
      description: description.trim(),
      responsibilities: responsibilities || '',
      requirements: requirements || '',
      requiredSkills: formattedSkills,
      duration: duration || '3 Months',
      location: location || 'Remote',
      workMode: workMode || 'Remote',
      stipend: stipend || 'Stipend Provided',
      eligibility: eligibility || 'Open to all applicants',
      applicationDeadline: applicationDeadline ? new Date(applicationDeadline) : null,
      openings: openings ? parseInt(openings) : 2,
      benefits: benefits || '',
      contactDetails: contactDetails || req.user.email,
      status: status || 'published'
    });

    await internship.save();

    return res.status(201).json({
      success: true,
      message: `Internship ${internship.status === 'draft' ? 'saved as draft' : 'published successfully'}!`,
      internship
    });
  } catch (err) {
    console.error('Post internship error:', err);
    return res.status(500).json({ success: false, message: 'Server error creating internship post.' });
  }
});

// UPDATE INTERNSHIP
router.put('/:id', auth, isOrganization, async (req, res) => {
  try {
    let internship = await Internship.findById(req.params.id);
    if (!internship) {
      return res.status(404).json({ success: false, message: 'Internship not found.' });
    }

    if (internship.organization.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied. You can only edit your own internship posts.' });
    }

    const {
      title,
      description,
      responsibilities,
      requirements,
      requiredSkills,
      duration,
      location,
      workMode,
      stipend,
      eligibility,
      applicationDeadline,
      openings,
      benefits,
      contactDetails,
      status
    } = req.body;

    if (title) internship.title = title.trim();
    if (description) internship.description = description.trim();
    if (responsibilities !== undefined) internship.responsibilities = responsibilities;
    if (requirements !== undefined) internship.requirements = requirements;
    if (requiredSkills !== undefined) {
      internship.requiredSkills = Array.isArray(requiredSkills)
        ? requiredSkills.map(s => (typeof s === 'string' ? s.trim() : s.name))
        : (typeof requiredSkills === 'string' ? requiredSkills.split(',').map(s => s.trim()) : []);
    }
    if (duration) internship.duration = duration;
    if (location) internship.location = location;
    if (workMode) internship.workMode = workMode;
    if (stipend) internship.stipend = stipend;
    if (eligibility) internship.eligibility = eligibility;
    if (applicationDeadline) internship.applicationDeadline = new Date(applicationDeadline);
    if (openings) internship.openings = parseInt(openings);
    if (benefits !== undefined) internship.benefits = benefits;
    if (contactDetails !== undefined) internship.contactDetails = contactDetails;
    if (status) internship.status = status;

    await internship.save();

    return res.json({
      success: true,
      message: 'Internship updated successfully!',
      internship
    });
  } catch (err) {
    console.error('Update internship error:', err);
    return res.status(500).json({ success: false, message: 'Server error updating internship.' });
  }
});

// TOGGLE OR UPDATE INTERNSHIP STATUS (published/draft/closed)
router.patch('/:id/status', auth, isOrganization, async (req, res) => {
  try {
    const { status } = req.body;
    let internship = await Internship.findById(req.params.id);
    if (!internship) {
      return res.status(404).json({ success: false, message: 'Internship post not found.' });
    }

    if (internship.organization.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    internship.status = status;
    await internship.save();

    return res.json({
      success: true,
      message: `Internship status updated to ${status}.`,
      internship
    });
  } catch (err) {
    console.error('Patch status error:', err);
    return res.status(500).json({ success: false, message: 'Server error updating status.' });
  }
});

// DELETE INTERNSHIP
router.delete('/:id', auth, isOrganization, async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);
    if (!internship) {
      return res.status(404).json({ success: false, message: 'Internship not found.' });
    }

    if (internship.organization.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    await Internship.findByIdAndDelete(req.params.id);

    return res.json({ success: true, message: 'Internship post deleted successfully.' });
  } catch (err) {
    console.error('Delete internship error:', err);
    return res.status(500).json({ success: false, message: 'Server error deleting internship.' });
  }
});

module.exports = router;
