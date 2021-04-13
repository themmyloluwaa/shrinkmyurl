const { GraphQLServer } = require("graphql-yoga");
const { makeSchema } = require("nexus");
const { PrismaClient } = require("@prisma/client");
const { formatError } = require("apollo-errors");
const types = require("./types");

const prisma = require("./utils/dbClient");

// define options for the graphql error
const options = {
  port: process.env.PORT || 4000,
  endpoint: "/api",
  playground: "/graphiql",
  formatError,
};

// create a new server and define necessary arguments
const app = new GraphQLServer({
  schema: makeSchema({
    types,
    plugins: [],
    outputs: {
      schema: __dirname + "/generated/schema.graphql",
      typegen: __dirname + "/generated/nexus.ts",
    },
  }),
  context: async (sConfig) => {
    sConfig.db = prisma;

    return sConfig;
  },
});

// redirection endpoint
app.express.get("/:shrinkedURL", async (req, res, next) => {
  try {
    // prevent playground endpoint redirects
    if (req.params.shrinkedURL === options.playground.replace("/", "")) {
      return next();
    }

    // retrieve the full url
    const shrinkedURL = await prisma.uRLSchema.findFirst({
      where: {
        shortURL: req.params.shrinkedURL,
      },
    });

    if (!shrinkedURL) {
      return res.sendStatus(404);
    }
    // increase visits count for analytics
    const newURLVisitsValue = shrinkedURL.visits + 1;

    await prisma.uRLSchema.update({
      where: {
        id: shrinkedURL.id,
      },
      data: {
        visits: newURLVisitsValue,
      },
    });

    // redirect the user to the desired location
    return res.redirect(shrinkedURL.fullURL);
    // }
  } catch (err) {
    console.log(err);
    return res.sendStatus(404);
  }
});
const server = () => {
  return app.start(options, ({ port, playground, ...rest }) => {
    console.log(
      `🚀 Server ready at: http://localhost:${port}${playground}\n⭐️`
    );
  });
};

module.exports = {
  prisma,
  server,
};
