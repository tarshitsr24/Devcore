const { SupabaseModel } = require('../db/supabaseModel');

class Application extends SupabaseModel {
  constructor(values = {}) {
    super();
    Object.assign(this, { internship: '', organization: '', applicant: '', fullName: '', email: '', phone: '', college: '', course: '', resume: '', github: '', linkedin: '', portfolio: '', coverLetter: '', relevantSkills: [], availability: 'Immediate (Full Time / Part Time)', status: 'Applied', compatibilityScore: 0, appliedDate: new Date().toISOString() }, values);
    if (values._id) this._id = values._id;
  }
}

module.exports = Application;
