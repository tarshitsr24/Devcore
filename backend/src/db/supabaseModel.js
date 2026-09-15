const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be configured in backend/.env');
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

function getValue(document, key) {
  return document[key] ?? document[key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())];
}

function matches(document, filter = {}) {
  if (filter.$or && !filter.$or.some((item) => matches(document, item))) return false;

  return Object.entries(filter).every(([key, expected]) => {
    if (key === '$or') return true;
    const actual = getValue(document, key);

    if (expected && typeof expected === 'object' && !(expected instanceof RegExp)) {
      if ('$regex' in expected) return matches(document, { [key]: expected.$regex });
      if ('$not' in expected) return !matches(document, { [key]: expected.$not });
    }

    if (expected instanceof RegExp) {
      if (Array.isArray(actual)) return actual.some((value) => expected.test(String(value)));
      return expected.test(String(actual ?? ''));
    }

    return String(actual) === String(expected);
  });
}

function project(document, projection) {
  if (!projection) return document;
  const fields = projection.split(/\s+/).filter(Boolean);
  const excluded = fields.filter((field) => field.startsWith('-')).map((field) => field.slice(1));
  if (excluded.length) {
    const result = { ...document };
    excluded.forEach((field) => delete result[field]);
    return result;
  }
  return Object.fromEntries(['_id', ...fields].filter((field) => field in document).map((field) => [field, document[field]]));
}

class SupabaseQuery {
  constructor(Model, filter = {}, single = false) {
    this.Model = Model;
    this.filter = filter;
    this.single = single;
    this.sortBy = null;
    this.projection = null;
    this.populations = [];
  }

  sort(sortBy) {
    this.sortBy = sortBy;
    return this;
  }

  select(projection) {
    this.projection = projection;
    return this;
  }

  populate(path, projection) {
    this.populations.push({ path, projection });
    return this;
  }

  async execute() {
    const { data, error } = await supabase
      .from('records')
      .select('id, data, created_at, updated_at')
      .eq('collection', this.Model.collection);

    if (error) throw error;

    let documents = data.map((row) => this.Model.hydrate(row));
    documents = documents.filter((document) => matches(document, this.filter));

    if (this.sortBy) {
      const [[field, direction]] = Object.entries(this.sortBy);
      documents.sort((left, right) => {
        const leftValue = new Date(getValue(left, field) || 0).getTime() || getValue(left, field);
        const rightValue = new Date(getValue(right, field) || 0).getTime() || getValue(right, field);
        return leftValue < rightValue ? direction : -direction;
      });
    }

    documents = documents.map((document) => project(document, this.projection));
    for (const population of this.populations) {
      await Promise.all(documents.map(async (document) => {
        const referenceId = document[population.path];
        if (!referenceId) return;
        const Model = population.path === 'internship'
          ? require('../models/Internship')
          : require('../models/User');
        const related = await Model.findById(referenceId).select(population.projection);
        document[population.path] = related || null;
      }));
    }

    return this.single ? (documents[0] || null) : documents;
  }

  then(resolve, reject) {
    return this.execute().then(resolve, reject);
  }
}

class SupabaseModel {
  static get collection() {
    return this.name;
  }

  static hydrate(row) {
    const document = new this(row.data || {});
    Object.assign(document, row.data || {});
    document._id = row.id;
    return document;
  }

  static find(filter = {}) {
    return new SupabaseQuery(this, filter);
  }

  static findOne(filter = {}) {
    return new SupabaseQuery(this, filter, true);
  }

  static findById(id) {
    return new SupabaseQuery(this, { _id: id }, true);
  }

  static async countDocuments(filter = {}) {
    return (await this.find(filter)).length;
  }

  static async insertMany(documents) {
    const saved = [];
    for (const values of documents) saved.push(await new this(values).save());
    return saved;
  }

  static async findOneAndDelete(filter = {}) {
    const document = await this.findOne(filter);
    if (!document) return null;
    return this.deleteById(document._id, document);
  }

  static async findByIdAndDelete(id) {
    return this.deleteById(id);
  }

  static async deleteById(id, document = null) {
    const { error } = await supabase.from('records').delete().eq('id', id).eq('collection', this.collection);
    if (error) throw error;
    return document;
  }

  async save() {
    if (!this._id) this._id = crypto.randomUUID();
    const now = new Date().toISOString();
    if (!this.createdAt) this.createdAt = now;
    this.updatedAt = now;
    const { _id, ...data } = this;
    const { error } = await supabase.from('records').upsert({
      id: this._id,
      collection: this.constructor.collection,
      data,
      created_at: this.createdAt,
      updated_at: this.updatedAt
    }, { onConflict: 'id' });
    if (error) throw error;
    return this;
  }
}

module.exports = { SupabaseModel };
