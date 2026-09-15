const { SupabaseModel } = require('../db/supabaseModel');

class ApplicantProfile extends SupabaseModel {
  constructor(values = {}) {
    super();
    this.user = values.user || '';
    this.avatar = values.avatar || '';
    this.bio = values.bio || '';
    this.phone = values.phone || '';
    this.educationHistory = values.educationHistory || [];
    this.links = { linkedin: '', github: '', portfolio: '', resume: '', ...(values.links || {}) };
    this.careerDetails = { interests: [], preferredDomain: '', preferredJobRole: '', preferredWorkMode: 'Remote', locationPreference: '', ...(values.careerDetails || {}) };
    this.completionPercentage = values.completionPercentage || 30;
    if (values._id) this._id = values._id;
    if (values.updatedAt) this.updatedAt = values.updatedAt;
  }

  calculateCompletion(skillsCount = 0) {
    let score = 20;
    if (this.bio.trim().length > 10) score += 15;
    if (this.phone.trim().length > 5) score += 10;
    if (this.educationHistory.length > 0) score += 20;
    if (this.links.linkedin || this.links.github || this.links.resume) score += 15;
    if (this.careerDetails.preferredDomain) score += 10;
    if (skillsCount > 0) score += 10;
    this.completionPercentage = Math.min(score, 100);
    return this.completionPercentage;
  }
}

module.exports = ApplicantProfile;
