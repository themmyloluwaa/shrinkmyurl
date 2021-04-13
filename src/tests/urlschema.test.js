const { request } = require("graphql-request");
const { prisma, server } = require("../app");
const { InValidURLError } = require("../utils/errors");

let getHost = () => "";

let app = null;

const query = `
query {
        health
      }
`;

const goodUrlQuery = `
mutation {
  shortenURL(url:"https://mentorcruise.com/mentor/temiloluwaojo/") 
}
`;

const badUrlQuery = `
mutation {
  shortenURL(url:"https://mentorcruis") 
}
`;

describe("Tests for the shrinkmyurl API", () => {
  beforeAll(async (done) => {
    app = await server();
    const { port } = app.address();
    getHost = () => `http://127.0.0.1:${port}/api`;
    await prisma.uRLSchema
      .deleteMany()
      .then((res) => res)
      .catch((err) => console.log(err));

    await done();
  });

  it("Check API health", async (done) => {
    const response = await request(getHost(), query).finally((d) => d);
    expect(response).toEqual({ health: 200 });
    await done();
  });

  it("Successfully shrinks url", async (done) => {
    const response = await request(getHost(), goodUrlQuery)
      .then((res) => res)
      .finally((d) => d);
    expect(response).toHaveProperty("shortenURL");
    expect(response.shortenURL.split("/")[1]).toHaveLength(6);
    await done();
  });

  // working on this
  // it("Does not shrink the url", async (done) => {
  //   await expect(
  //     request(getHost(), badUrlQuery).catch((e) => e)
  //   ).resolves.toThrow(new InValidURLError());
  //   await done();
  // });

  afterAll(async (done) => {
    await app.close(done());
    await prisma.$disconnect();
    await done();
  });
});
