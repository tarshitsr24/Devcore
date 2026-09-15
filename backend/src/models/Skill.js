const { SupabaseModel } = require('../db/supabaseModel');

class Skill extends SupabaseModel {
  constructor(values = {}) {
    super();
    this.user = values.user || '';
    this.name = values.name || '';
    this.category = values.category || 'Technical';
    this.level = values.level || 'Intermediate';
    if (values._id) this._id = values._id;
    if (values.createdAt) this.createdAt = values.createdAt;
  }
}

module.exports = Skill;
