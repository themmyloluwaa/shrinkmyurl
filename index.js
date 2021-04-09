const { GraphQLServer } = require("graphql-yoga");
const { makeSchema } = require("nexus");
const { nexusPrisma } = require("nexus-plugin-prisma");
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
    plugins: [nexusPrisma()],
    outputs: {
      schema: __dirname + "/src/generated/schema.graphql",
      typegen: __dirname + "/src/generated/nexus.ts",
    },
  }),
  context: async (sConfig) => {
    console.log(sConfig);
    const data = {
      sConfig,
      prisma,
    };

    return data;
  },
});

server.express.use(BodyParser.urlencoded({ extended: false }));
server.express.use(BodyParser.json());

server.start(options, ({ port, playground, ...rest }) => {
  console.log(`🚀 Server ready at: http://localhost:${port}${playground}\n⭐️`);
});
