const { PrismaClient } = require("@prisma/client");

let prisma;

// if on production, generate new prisma client
if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  // else add prisma to the node global object space
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }

  prisma = global.prisma;
}

// this prevents a new client being created to connect to the database
// due to hot reloading

module.exports = prisma;
