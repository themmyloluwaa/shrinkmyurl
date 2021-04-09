const { objectType } = require("@nexus/schema");

const URLSchema = objectType({
  name: "URLSchema",
  definition(t) {
    t.model.id();
    t.model.fullURL();
    t.model.shortURL();
    t.model.createdAt();
    t.model.updatedAt();
  },
});

module.exports = {
  URLSchema,
};
