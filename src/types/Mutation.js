const { intArg, mutationType, stringArg, nonNull } = require("nexus");
const { generateURL } = require("../utils/generateURL");

const Mutation = mutationType({
  definition(t) {
    t.field("health", {
      type: "Int",
      resolve: async (parent, args, ctx) => {
        console.log(ctx);
        return 200;
      },
    });

    t.field("shortenURL", {
      type: "String",
      args: {
        url: nonNull(stringArg({})),
      },
      resolve: async (parent, args, ctx) => {
        const hostname = ctx.request.headers.host;
        const urlGenerated = await generateURL();

        return `${hostname}/${urlGenerated}`;
      },
    });
  },
});

module.exports = {
  Mutation,
};
