// Converts checkbox values ("true"/"on") to actual booleans
// and parses numbers for known numeric fields
const parseFormBooleans = (req, res, next) => {
  const boolFields = ['isActive', 'isFeatured', 'isPinned'];
  const numFields = ['investmentMin', 'investmentMax', 'profitMargin', 'monthlyRevenue', 'companySize', 'order', 'rating'];

  boolFields.forEach(field => {
    if (field in req.body) {
      req.body[field] = req.body[field] === 'true' || req.body[field] === 'on';
    } else if (req.method === 'POST' || req.method === 'PUT') {
      // Unchecked checkbox won't appear in body — set to false
      req.body[field] = false;
    }
  });

  numFields.forEach(field => {
    if (field in req.body && req.body[field] !== '') {
      req.body[field] = Number(req.body[field]);
    }
  });

  // Parse tags from comma-separated string to array
  if (req.body.tags && typeof req.body.tags === 'string') {
    req.body.tags = req.body.tags.split(',').map(t => t.trim()).filter(Boolean);
  }

  next();
};

module.exports = parseFormBooleans;
