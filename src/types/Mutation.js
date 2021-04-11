const { mutationType, stringArg, nonNull } = require("nexus");
const { generateURL, urlValidator } = require("../utils/helpers");
  
const Mutation = mutationType({
  definition(t) {
    t.field("health", {
      type: "Int",
      resolve: async (parent, args, ctx) => {
        return 200;
      },
    });

    t.field("shortenURL", {
      type: "String",
      args: {
        url: nonNull(stringArg({})),
      },
      resolve: async (parent, args, ctx) => {
        try {
          const isURLValid = urlValidator(args.url);

          if (!isURLValid) {
            throw new Error("You must submit a valid url.");
          }
          const hostname = ctx.request.headers.host;

          const URLExist = await ctx.db.uRLSchema.findFirst({
            where: { fullURL: args.url },
          });

          if (URLExist) {
            return `${hostname}/${URLExist.shortURL}`;
          }

          const generatedURL = await generateURL(ctx.db);
          const savedURL = await ctx.db.uRLSchema.create({
            data: {
              fullURL: args.url,
              shortURL: generatedURL,
              visits: 0,
            },
          });

          if (savedURL) {
            return `${hostname}/${generatedURL}`;
          }
        } catch (err) {
          console.log(err);
          return err;
        }
      },
    });
  },
});

module.exports = {
  Mutation,
};
