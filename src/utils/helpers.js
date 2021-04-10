const { nanoid } = require("nanoid");

const generateURL = async () => {
  return nanoid(6);
};
const urlValidator = (url) =>
  /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/.test(
    url
  );

module.exports = {
  generateURL,
  urlValidator,
};
