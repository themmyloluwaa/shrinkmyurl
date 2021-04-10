const { GraphQLServer } = require("graphql-yoga");
const { makeSchema } = require("nexus");
const { PrismaClient } = require("@prisma/client");
const types = require("./src/types");
const BodyParser = require("body-parser");

const prisma = new PrismaClient();

const options = {
  port: process.env.PORT || 4000,
  endpoint: "/api",
  subscriptions: "/subscriptions",
  playground: "/graphiql",
};

const server = new GraphQLServer({
  schema: makeSchema({
    types,
    plugins: [],
    outputs: {
      schema: __dirname + "/src/generated/schema.graphql",
      typegen: __dirname + "/src/generated/nexus.ts",
    },
  }),
  context: async (sConfig) => {
    sConfig.db = prisma;

    return sConfig;
  },
});

// server.express.use(BodyParser.urlencoded({ extended: false }));
// server.express.use(BodyParser.json());

server.express.get("/:shrinkedURL", async (req, res, next) => {
  try {
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
  } catch (err) {
    console.log(err);
    return res.sendStatus(404);
  }
});
server.start(options, ({ port, playground, ...rest }) => {
  console.log(`🚀 Server ready at: http://localhost:${port}${playground}\n⭐️`);
});
