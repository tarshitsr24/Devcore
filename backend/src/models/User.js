const { SupabaseModel } = require('../db/supabaseModel');

class User extends SupabaseModel {
  constructor(values = {}) {
    super();
    this.fullName = values.fullName || '';
    this.email = values.email || '';
    this.password = values.password || '';
    this.role = values.role || 'applicant';
    if (values._id) this._id = values._id;
    if (values.createdAt) this.createdAt = values.createdAt;
  }
}

module.exports = User;
