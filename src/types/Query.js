const { intArg, queryType, stringArg } = require("nexus");

const Query = queryType({
  definition(t) {
    t.field("health", {
      type: "Int",
      resolve: async (parent, args, ctx) => {
        return 200;
      },
    });
  },
});

module.exports = {
  Query,
};
