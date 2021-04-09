const { intArg, mutationType, stringArg } = require("nexus");

const Mutation = mutationType({
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
  Mutation,
};
