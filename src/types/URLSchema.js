const { objectType } = require("nexus");

const URLSchema = objectType({
  name: "URLSchema",
  definition(t) {
    t.int("id");
    t.string("fullURL", {
      deprecation: "The full url that needs to be shrinked",
    });
    t.string("shortURL", {
      deprecation: "The full url that needs to be shrinked",
    });
    t.string("createdAt");
    t.string("updatedAt");
  },
});

module.exports = {
  URLSchema,
};
