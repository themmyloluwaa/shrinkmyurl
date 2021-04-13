const { createError } = require("apollo-errors");

const InValidURLError = createError("Invalid URL", {
  message: "The URL provided is invalid, please check and try again",
});

const ErrorOccured = createError("An error has occured", {
  message: "Unable to shorten the url. Please try again.",
});

module.exports = {
  InValidURLError,
  ErrorOccured,
};
