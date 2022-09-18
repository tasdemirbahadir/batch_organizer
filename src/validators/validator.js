const validate = (badRequestErrors, response, next) => {
  if (badRequestErrors.length) {
    response.status(400);
    response.json({ errors: badRequestErrors });
  } else {
    next();
  }
};

module.exports = { validate };
