import sanitizeHtml from 'sanitize-html';

// Middleware pour assainir les entrées utilisateur
const sanitize = (req, res, next) => {
  const sanitizeFields = (obj) => {
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        obj[key] = sanitizeHtml(obj[key], {
          allowedTags: [], // Interdire toutes les balises HTML
          allowedAttributes: {}
        });
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitizeFields(obj[key]); // Assainir récursivement les objets imbriqués
      }
    }
  };

  sanitizeFields(req.body);
  sanitizeFields(req.query);
  sanitizeFields(req.params);
  next();
};

export default sanitize;
