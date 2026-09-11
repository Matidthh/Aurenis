import { PrismaClient } from "@prisma/client";
import { createMockPrisma } from "./mock-db";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  useMock: boolean | undefined;
};

// Check if running in an environment without a dedicated PostgreSQL instance (e.g. preview)
const isLocalWithoutDb =
  !process.env.DATABASE_URL ||
  process.env.DATABASE_URL.includes("localhost:5432") ||
  process.env.DATABASE_URL.includes("127.0.0.1:5432");

let realPrisma: PrismaClient | null = null;
if (!isLocalWithoutDb) {
  try {
    realPrisma =
      globalForPrisma.prisma ??
      new PrismaClient({
        log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
      });
    if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = realPrisma;
  } catch {
    realPrisma = null;
  }
}

const mockPrisma = createMockPrisma();

export const prisma = (
  isLocalWithoutDb || !realPrisma
    ? mockPrisma
    : new Proxy(realPrisma, {
        get(target: any, prop: string) {
          if (globalForPrisma.useMock) {
            return (mockPrisma as any)[prop] ?? target[prop];
          }
          return target[prop] ?? (mockPrisma as any)[prop];
        },
      })
) as unknown as PrismaClient;

