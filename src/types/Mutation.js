const { mutationType, stringArg, nonNull } = require("nexus");
const { generateURL, urlValidator } = require("../utils/helpers");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

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

          const generatedURL = await generateURL(prisma);
          const savedURL = await prisma.uRLSchema.create({
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
          throw new Error("An error occured, please try again.");
        }
      },
    });
  },
});

module.exports = {
  Mutation,
};
