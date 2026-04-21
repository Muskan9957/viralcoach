const { PrismaClient } = require('@prisma/client');

// Reuse the same Prisma instance across the app (prevents connection pool exhaustion)
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'warn', 'error'] : ['error'],
});

module.exports = prisma;
