const { nanoid } = require("nanoid");

const generateURL = async (db) => {
  let isInValid = true;
  let urlGenerated = "";

  while (isInValid) {
    urlGenerated = nanoid(6);
    isInValid = await db.uRLSchema.findUnique({
      where: {
        shortURL: urlGenerated,
      },
    });
  }

  return urlGenerated;
};
const urlValidator = (url) =>
  /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/.test(
    url
  );

module.exports = {
  generateURL,
  urlValidator,
};
