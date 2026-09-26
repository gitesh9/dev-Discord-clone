import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

const modelMock = new Proxy(
  {
    findMany: async () => [],
    findFirst: async () => null,
    findUnique: async () => null,
    create: async (d: any) => ({ id: "mock-id", ...(d?.data ?? {}) }),
    update: async (d: any) => ({ id: "mock-id", ...(d?.data ?? {}) }),
    delete: async () => ({}),
    count: async () => 0,
  },
  {
    get: (target: Record<string, any>, prop: string) => {
      if (prop in target) return target[prop];
      return async () => null;
    },
  }
);

const prismaMock = new Proxy(
  {},
  {
    get: (_, prop: string) => {
      if (prop === "$connect" || prop === "$disconnect") return async () => {};
      if (prop === "$transaction") {
        return async (fn: any) =>
          typeof fn === "function" ? fn(prismaMock) : Promise.all(fn);
      }
      return modelMock;
    },
  }
) as unknown as PrismaClient;

let prismaClient: PrismaClient;

try {
  if (!process.env.DATABASE_URL) {
    console.warn("[AI Studio] DATABASE_URL not set — using mock Prisma client");
    prismaClient = prismaMock;
  } else {
    prismaClient = globalThis.prisma || new PrismaClient();
    if (process.env.NODE_ENV !== "production") globalThis.prisma = prismaClient;
  }
} catch {
  console.warn("[AI Studio] Database not connected — using mock");
  prismaClient = prismaMock;
}

export const db = prismaClient;
