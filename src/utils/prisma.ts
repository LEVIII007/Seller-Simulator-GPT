import { PrismaClient } from "@prisma/client";

// Extend the global object to include the prismaGlobal property
declare global {
  namespace NodeJS {
    interface Global {
      prismaGlobal?: PrismaClient;
    }
  }
}

// Explicitly define the type of the global object
declare const global: NodeJS.Global & typeof globalThis;

const prismaClientSingleton = (): PrismaClient => {
  return new PrismaClient();
};

// Check if prismaGlobal is already defined on the global object
if (!global.prismaGlobal) {
  global.prismaGlobal = prismaClientSingleton();
}

const prisma: PrismaClient = global.prismaGlobal;

export default prisma;

// Ensure prismaGlobal is not redefined in production
if (process.env.NODE_ENV !== "production") {
  global.prismaGlobal = prisma;
}
