'use strict';

const validators = {
  isEmail(value) {
    return /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(String(value).trim());
  },
  isURL(value) {
    try { new URL(value); return true; } catch { return false; }
  },
  isPhone(value, country = 'PT') {
    const patterns = { PT: /^(\+351)?[29][0-9]{8}$/, BR: /^(\+55)?[1-9][0-9]{10}$/, ANY: /^\+?[0-9\s\-()]{7,20}$/ };
    return (patterns[country] || patterns.ANY).test(String(value).replace(/\s/g,''));
  },
  isStrongPassword(value) {
    return { valid: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]).{8,}$/.test(value), checks: { length: value.length >= 8, uppercase: /[A-Z]/.test(value), lowercase: /[a-z]/.test(value), number: /\d/.test(value), special: /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(value) } };
  },
  isNIF(value) {
    const nif = String(value).replace(/\D/g,'');
    if (nif.length !== 9 || !['1','2','3','5','6','7','8','9'].includes(nif[0])) return false;
    let sum = 0;
    for (let i = 0; i < 8; i++) sum += parseInt(nif[i]) * (9 - i);
    const rem = sum % 11;
    const check = rem < 2 ? 0 : 11 - rem;
    return check === parseInt(nif[8]);
  },
  isInteger(value, { min, max } = {}) {
    const n = Number(value);
    if (!Number.isInteger(n)) return false;
    if (min !== undefined && n < min) return false;
    if (max !== undefined && n > max) return false;
    return true;
  },
  isDate(value, format = 'YYYY-MM-DD') {
    if (format === 'YYYY-MM-DD') return /^\d{4}-\d{2}-\d{2}$/.test(value) && !isNaN(Date.parse(value));
    return !isNaN(Date.parse(value));
  },
};

const sanitizers = {
  html(str) {
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#x27;').replace(/\//g,'&#x2F;');
  },
  sql(str) {
    return String(str).replace(/'/g,"''").replace(/;/g,'').replace(/--/g,'').replace(/\/\*/g,'').replace(/\*\//g,'').replace(/xp_/gi,'');
  },
  trim(str) {
    return String(str).trim().replace(/\s+/g, ' ');
  },
  alphanumeric(str) {
    return String(str).replace(/[^a-zA-Z0-9]/g,'');
  },
  digits(str) {
    return String(str).replace(/\D/g,'');
  },
  filename(str) {
    return String(str).replace(/[^a-zA-Z0-9._\-]/g,'').replace(/\.{2,}/g,'.').slice(0,255);
  },
};

function validate(data, schema) {
  const errors = [];
  const result = {};
  for (const [field, rules] of Object.entries(schema)) {
    const value = data[field];
    if (rules.required && (value === undefined || value === null || value === '')) {
      errors.push({ field, message: rules.message || `${field} é obrigatório.` });
      continue;
    }
    if (value === undefined || value === null || value === '') {
      result[field] = value;
      continue;
    }
    if (rules.minLength && String(value).length < rules.minLength) errors.push({ field, message: `${field} deve ter pelo menos ${rules.minLength} caracteres.` });
    if (rules.maxLength && String(value).length > rules.maxLength) errors.push({ field, message: `${field} deve ter no máximo ${rules.maxLength} caracteres.` });
    if (rules.type === 'email' && !validators.isEmail(value)) errors.push({ field, message: `${field} deve ser um email válido.` });
    if (rules.type === 'url' && !validators.isURL(value)) errors.push({ field, message: `${field} deve ser uma URL válida.` });
    if (rules.sanitize) {
      let v = value;
      const s = Array.isArray(rules.sanitize) ? rules.sanitize : [rules.sanitize];
      for (const fn of s) { if (sanitizers[fn]) v = sanitizers[fn](v); }
      result[field] = v;
    } else { result[field] = value; }
  }
  return { valid: errors.length === 0, errors, data: result };
}

module.exports = { validators, sanitizers, validate };
