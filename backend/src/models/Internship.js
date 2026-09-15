const { SupabaseModel } = require('../db/supabaseModel');

class Internship extends SupabaseModel {
  constructor(values = {}) {
    super();
    this.organization = values.organization || '';
    this.orgName = values.orgName || '';
    this.orgLogo = values.orgLogo || '';
    this.title = values.title || '';
    this.description = values.description || '';
    this.responsibilities = values.responsibilities || '';
    this.requirements = values.requirements || '';
    this.requiredSkills = values.requiredSkills || [];
    this.duration = values.duration || '3 Months';
    this.location = values.location || 'Remote';
    this.workMode = values.workMode || 'Remote';
    this.stipend = values.stipend || 'Unpaid / Performance Based';
    this.eligibility = values.eligibility || 'Open to all pursuing degree or recent grads';
    this.applicationDeadline = values.applicationDeadline || null;
    this.openings = values.openings || 2;
    this.benefits = values.benefits || 'Certificate, Letter of Recommendation, Mentorship';
    this.contactDetails = values.contactDetails || '';
    this.status = values.status || 'published';
    this.postedDate = values.postedDate || new Date().toISOString();
    if (values._id) this._id = values._id;
  }
}

module.exports = Internship;
