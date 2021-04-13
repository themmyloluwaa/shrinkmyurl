const { nanoid } = require("nanoid");

const generateURL = async (db) => {
  let isInValid = true;
  let urlGenerated = "";

  // logic to ensure that the short url generated isn't present in the db
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

// an utility function to validate a url
const urlValidator = (url) =>
  /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/.test(
    url
  );

module.exports = {
  generateURL,
  urlValidator,
};
