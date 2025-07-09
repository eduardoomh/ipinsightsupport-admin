import prismaModule from "@prisma/client";
const PrismaClient = prismaModule.PrismaClient;

let prisma: InstanceType<typeof PrismaClient>;

declare global {
  // Para evitar múltiples instancias en desarrollo
  var __prisma: InstanceType<typeof PrismaClient> | undefined;
}

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.__prisma) {
    global.__prisma = new PrismaClient();
  }
  prisma = global.__prisma;
}

export { prisma };