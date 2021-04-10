const { nanoid } = require("nanoid");

const generateURL = async () => {
  return nanoid(6);
};

module.exports = {
  generateURL,
};
