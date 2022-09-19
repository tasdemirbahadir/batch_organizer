import {validate} from "./validator";

const validateGetRequest = (request, response, next) => {
  let badRequestErrors = [];
  if (request.query.size) {
    if (isNaN(request.query.size)) {
      badRequestErrors.push("Page size value must be a number");
    } else {
      if (request.query.size > 20) {
        badRequestErrors.push("Max page size is 20");
      }
      if (request.query.size < 1) {
        badRequestErrors.push("Min page size is 1");
      }
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

const validatePostRequest = (request, response, next) => {
  let badRequestErrors = [];
  if (!request.body.batchId) {
    badRequestErrors.push(
      "Data 'batchId' doesn't exist in body. Sample body: { batchId: <string_val>, value: <number_val> }"
    );
  }
  if (!request.body.value) {
    badRequestErrors.push(
      "Data 'value' doesn't exist in body. Sample body: { batchId: <string_val>, value: <number_val> }"
    );
  } else if (isNaN(request.body.value)) {
    badRequestErrors.push(
      "The value of data 'value' must be type of number. Sample body: { batchId: <string_val>, value: <number_val> }"
    );
  }
  validate(badRequestErrors, response, next);
};

module.exports = {
  validateGetRequest,
  validatePostRequest,
};
