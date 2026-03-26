// server/utils/prisma.js
// Shared Prisma client instance — avoids creating multiple connections

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

module.exports = prisma;
