const { SupabaseModel } = require('../db/supabaseModel');

class JourneyRecord extends SupabaseModel {
  constructor(values = {}) {
    super();
    Object.assign(this, { user: '', type: '', title: '', organizationOrInstitute: '', description: '', dateOrPeriod: '', evidenceUrl: '', isVerified: false }, values);
    if (values._id) this._id = values._id;
    if (values.createdAt) this.createdAt = values.createdAt;
  }
}

module.exports = JourneyRecord;
