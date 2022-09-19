import {validate} from "./validator";

const validateGetRequest = (request, response, next) => {
  let badRequestErrors = [];
  if (request.query.size) {
    if (isNaN(request.query.size)) {
      badRequestErrors.push("Page size value must be a number");
    } else if (request.query.size < 1) {
      badRequestErrors.push("Min page size is 1");
    }
  }
  if (request.query.page) {
    if (isNaN(request.query.page)) {
      badRequestErrors.push("Page value must be a number");
    } else if (request.query.page < 0) {
      badRequestErrors.push("Min page value is 0");
    }
  }
  validate(badRequestErrors, response, next);
};

module.exports = { validateGetRequest };
