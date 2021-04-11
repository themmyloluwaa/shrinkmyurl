const { GraphQLServer } = require("graphql-yoga");
const { makeSchema } = require("nexus");
const { PrismaClient } = require("@prisma/client");
const types = require("./types");

const prisma = new PrismaClient();

const options = {
  //   port: process.env.NODE_ENV === "test" ? 0 : process.env.PORT,
  port: process.env.PORT || 4000,
  endpoint: "/api",
  playground: "/graphiql",
};

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

app.express.get("/:shrinkedURL", async (req, res, next) => {
  try {
    if (req.params.shrinkedURL === options.playground.replace("/", "")) {
      next();
    }

    const shrinkedURL = await prisma.uRLSchema.findFirst({
      where: {
        shortURL: req.params.shrinkedURL,
      },
    });

    if (!shrinkedURL) {
      return res.sendStatus(404);
    }
    const newURLVisitsValue = shrinkedURL.visits + 1;

    await prisma.uRLSchema.update({
      where: {
        id: shrinkedURL.id,
      },
      data: {
        visits: newURLVisitsValue,
      },
    });

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

module.exports = server;
