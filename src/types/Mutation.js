const { mutationType, stringArg, nonNull } = require("nexus");
const { generateURL, urlValidator } = require("../utils/helpers");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

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
        try {
          const isURLValid = urlValidator(args.url);

          if (!isURLValid) {
            throw new Error("You must submit a valid url");
          }
          const hostname = ctx.request.headers.host;

          let isInValid = true;
          let urlGenerated = "";

          while (isInValid) {
            urlGenerated = await generateURL();
            isInValid = await prisma.uRLSchema.findUnique({
              where: {
                shortURL: urlGenerated,
              },
            });
          }
          const saveURL = await prisma.uRLSchema.create({
            data: {
              fullURL: args.url,
              shortURL: "KDWVph",
              visits: 0,
            },
          });

          if (saveURL) {
            return `${hostname}/${urlGenerated}`;
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
