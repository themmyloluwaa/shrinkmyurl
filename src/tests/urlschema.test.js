const { request } = require("graphql-request");
const server = require("../app");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

let getHost = () => "";

let app = null;
beforeAll(async (done) => {
  app = await server();
  await prisma.uRLSchema.deleteMany();
  const { port } = app.address();
  getHost = () => `http://127.0.0.1:${port}/api`;

  await done();
});

const query = `
query {
        health
      }
`;

test("Check API health", async (done) => {
  const response = await request(getHost(), query).finally((d) => d);
  expect(response).toEqual({ health: 200 });
  await done();
});

afterAll(async (done) => {
  await prisma.$disconnect();
  await app.close(done);

  await done;
});
