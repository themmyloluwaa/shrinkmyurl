const { intArg, queryType, stringArg, nonNull } = require("nexus");
const { generateURL, urlValidator } = require("../utils/helpers");
const { ErrorOccured, InValidURLError } = require("../utils/errors");

const Query = queryType({
  definition(t) {
    t.field("health", {
      type: "Int",
      resolve: async (parent, args, ctx) => {
        // a quick check for the API's health
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
          // Validate that the url passed is a valid one.
          const isURLValid = urlValidator(args.url);

          if (!isURLValid) {
            throw new InValidURLError();
          }

          // If a user has shortened a url before, find it and return.
          // The advantage of this is it saves the db from being populated
          // with redundant data.
          const URLExist = await ctx.db.uRLSchema.findFirst({
            where: { fullURL: args.url },
          });

          if (URLExist) {
            return `${process.env.ORIGIN_URL}/${URLExist.shortURL}`;
          }

          // generate a new 6 length random string
          const generatedURL = await generateURL(ctx.db);

          // save this new url
          const savedURL = await ctx.db.uRLSchema.create({
            data: {
              fullURL: args.url,
              shortURL: generatedURL,
              visits: 0,
            },
          });
          // if the url was saved. Return the required format for the url
          if (savedURL) {
            return `${process.env.ORIGIN_URL}/${URLExist.shortURL}`;
          } else {
            // Else, give the user a feedback
            throw new ErrorOccured();
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
  Query,
};
