const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const JourneyRecord = require('../models/JourneyRecord');

// GET ALL JOURNEY RECORDS FOR LOGGED IN USER
router.get('/', auth, async (req, res) => {
  try {
    const records = await JourneyRecord.find({ user: req.user.id }).sort({ createdAt: -1 });
    return res.json({ success: true, count: records.length, records });
  } catch (err) {
    console.error('Get journey records error:', err);
    return res.status(500).json({ success: false, message: 'Server error retrieving journey records.' });
  }
});

// ADD NEW JOURNEY RECORD
router.post('/', auth, async (req, res) => {
  try {
    const { type, title, organizationOrInstitute, description, dateOrPeriod, evidenceUrl, isVerified } = req.body;

    if (!type || !title) {
      return res.status(400).json({ success: false, message: 'Record type and title are required.' });
    }

    const record = new JourneyRecord({
      user: req.user.id,
      type,
      title: title.trim(),
      organizationOrInstitute: organizationOrInstitute || '',
      description: description || '',
      dateOrPeriod: dateOrPeriod || '',
      evidenceUrl: evidenceUrl || '',
      isVerified: Boolean(isVerified)
    });

    await record.save();

    return res.status(201).json({
      success: true,
      message: 'Journey record added successfully!',
      record
    });
  } catch (err) {
    console.error('Add journey record error:', err);
    return res.status(500).json({ success: false, message: 'Server error adding journey record.' });
  }
});

// UPDATE JOURNEY RECORD
router.put('/:id', auth, async (req, res) => {
  try {
    let record = await JourneyRecord.findOne({ _id: req.params.id, user: req.user.id });
    if (!record) {
      return res.status(404).json({ success: false, message: 'Journey record not found or access denied.' });
    }

    const { type, title, organizationOrInstitute, description, dateOrPeriod, evidenceUrl, isVerified } = req.body;

    if (type) record.type = type;
    if (title) record.title = title.trim();
    if (organizationOrInstitute !== undefined) record.organizationOrInstitute = organizationOrInstitute;
    if (description !== undefined) record.description = description;
    if (dateOrPeriod !== undefined) record.dateOrPeriod = dateOrPeriod;
    if (evidenceUrl !== undefined) record.evidenceUrl = evidenceUrl;
    if (isVerified !== undefined) record.isVerified = Boolean(isVerified);

    await record.save();

    return res.json({
      success: true,
      message: 'Journey record updated successfully!',
      record
    });
  } catch (err) {
    console.error('Update journey record error:', err);
    return res.status(500).json({ success: false, message: 'Server error updating journey record.' });
  }
});

// DELETE JOURNEY RECORD
router.delete('/:id', auth, async (req, res) => {
  try {
    const record = await JourneyRecord.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!record) {
      return res.status(404).json({ success: false, message: 'Journey record not found or access denied.' });
    }

    return res.json({ success: true, message: 'Journey record deleted successfully.' });
  } catch (err) {
    console.error('Delete journey record error:', err);
    return res.status(500).json({ success: false, message: 'Server error deleting journey record.' });
  }
});

module.exports = router;
