const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Skill = require('../models/Skill');
const ApplicantProfile = require('../models/ApplicantProfile');

// GET ALL SKILLS FOR LOGGED IN APPLICANT
router.get('/', auth, async (req, res) => {
  try {
    const skills = await Skill.find({ user: req.user.id }).sort({ createdAt: -1 });
    return res.json({ success: true, count: skills.length, skills });
  } catch (err) {
    console.error('Get skills error:', err);
    return res.status(500).json({ success: false, message: 'Error retrieving skills.' });
  }
});

// ADD NEW SKILL
router.post('/', auth, async (req, res) => {
  try {
    const { name, category, level } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Skill name is required.' });
    }

    // Check if skill already exists for this user
    const existing = await Skill.findOne({
      user: req.user.id,
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') }
    });

    if (existing) {
      return res.status(400).json({ success: false, message: `Skill '${name.trim()}' is already in your skills list.` });
    }

    const skill = new Skill({
      user: req.user.id,
      name: name.trim(),
      category: category || 'Technical',
      level: level || 'Intermediate'
    });

    await skill.save();

    // Update profile completion percentage
    const profile = await ApplicantProfile.findOne({ user: req.user.id });
    if (profile) {
      const skillsCount = await Skill.countDocuments({ user: req.user.id });
      profile.calculateCompletion(skillsCount);
      await profile.save();
    }

    return res.status(201).json({
      success: true,
      message: 'Skill added successfully!',
      skill
    });
  } catch (err) {
    console.error('Add skill error:', err);
    return res.status(500).json({ success: false, message: 'Server error adding skill.' });
  }
});

// UPDATE SKILL
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, category, level } = req.body;

    let skill = await Skill.findOne({ _id: req.params.id, user: req.user.id });
    if (!skill) {
      return res.status(404).json({ success: false, message: 'Skill not found or access denied.' });
    }

    if (name) skill.name = name.trim();
    if (category) skill.category = category;
    if (level) skill.level = level;

    await skill.save();

    return res.json({
      success: true,
      message: 'Skill updated successfully!',
      skill
    });
  } catch (err) {
    console.error('Update skill error:', err);
    return res.status(500).json({ success: false, message: 'Server error updating skill.' });
  }
});

// DELETE SKILL
router.delete('/:id', auth, async (req, res) => {
  try {
    const skill = await Skill.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!skill) {
      return res.status(404).json({ success: false, message: 'Skill not found or access denied.' });
    }

    // Update completion
    const profile = await ApplicantProfile.findOne({ user: req.user.id });
    if (profile) {
      const skillsCount = await Skill.countDocuments({ user: req.user.id });
      profile.calculateCompletion(skillsCount);
      await profile.save();
    }

    return res.json({ success: true, message: 'Skill removed successfully!' });
  } catch (err) {
    console.error('Delete skill error:', err);
    return res.status(500).json({ success: false, message: 'Server error removing skill.' });
  }
});

module.exports = router;
