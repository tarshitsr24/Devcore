const { SupabaseModel } = require('../db/supabaseModel');

class OrganizationProfile extends SupabaseModel {
  constructor(values = {}) {
    super();
    this.user = values.user || '';
    this.orgName = values.orgName || '';
    this.logo = values.logo || '';
    this.officialEmail = values.officialEmail || '';
    this.description = values.description || '';
    this.website = values.website || '';
    this.linkedIn = values.linkedIn || '';
    this.industry = values.industry || 'Technology';
    this.location = values.location || '';
    this.contactPerson = values.contactPerson || '';
    this.isVerified = values.isVerified || false;
    if (values._id) this._id = values._id;
    if (values.createdAt) this.createdAt = values.createdAt;
  }
}

module.exports = OrganizationProfile;
