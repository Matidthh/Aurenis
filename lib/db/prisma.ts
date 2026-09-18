import { PrismaClient } from "@prisma/client";
import { createMockPrisma } from "./mock-db";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  useMock: boolean | undefined;
};

function isPlaceholderDatabaseUrl(url?: string): boolean {
  if (!url || typeof url !== "string") return true;
  const trimmed = url.trim().toLowerCase();
  return (
    trimmed === "" ||
    trimmed.includes("localhost:5432") ||
    trimmed.includes("127.0.0.1:5432") ||
    trimmed.includes("ep-xxx") ||
    trimmed.includes("user:password") ||
    trimmed.includes("example.com") ||
    trimmed.includes("placeholder") ||
    trimmed.includes("dummy") ||
    trimmed.includes("your-") ||
    trimmed.includes("<") ||
    process.env.USE_MOCK_DB === "true"
  );
}

// Check if running in an environment without a dedicated PostgreSQL instance (e.g. preview or unconfigured DB)
const isLocalWithoutDb = isPlaceholderDatabaseUrl(process.env.DATABASE_URL);

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

export const isDatabaseConfigured = () => !isLocalWithoutDb && realPrisma !== null && !globalForPrisma.useMock;

function isConnectionError(err: any): boolean {
  if (!err) return false;
  const msg = (err.message || String(err)).toLowerCase();
  const code = err.code;
  return (
    msg.includes("can't reach database server") ||
    msg.includes("cannot reach database") ||
    msg.includes("timed out") ||
    msg.includes("connection refused") ||
    msg.includes("enotfound") ||
    msg.includes("econnrefused") ||
    code === "P1000" ||
    code === "P1001" ||
    code === "P1002" ||
    code === "P1003" ||
    err.name === "PrismaClientInitializationError"
  );
}

function wrapModelDelegate(modelName: string, realDelegate: any, mockDelegate: any) {
  if (!realDelegate) return mockDelegate;
  return new Proxy(realDelegate, {
    get(target: any, prop: string) {
      if (globalForPrisma.useMock) {
        return mockDelegate?.[prop] ?? target[prop];
      }
      const originalValue = target[prop];
      if (typeof originalValue === "function") {
        return async (...args: any[]) => {
          if (globalForPrisma.useMock) {
            const mockFn = mockDelegate?.[prop];
            return typeof mockFn === "function" ? mockFn(...args) : originalValue.apply(target, args);
          }
          try {
            return await originalValue.apply(target, args);
          } catch (err: any) {
            if (isConnectionError(err)) {
              console.warn(
                `[Prisma Fallback] Base de datos no accesible (${err.message}). Cambiando a Mock DB para modelo '${modelName}'.`
              );
              globalForPrisma.useMock = true;
              const mockFn = mockDelegate?.[prop];
              if (typeof mockFn === "function") {
                return await mockFn(...args);
              }
            }
            throw err;
          }
        };
      }
      return originalValue ?? mockDelegate?.[prop];
    },
  });
}

export const prisma = (
  isLocalWithoutDb || !realPrisma
    ? mockPrisma
    : new Proxy(realPrisma, {
        get(target: any, prop: string) {
          if (globalForPrisma.useMock) {
            return (mockPrisma as any)[prop] ?? target[prop];
          }
          const realValue = target[prop];
          const mockValue = (mockPrisma as any)[prop];
          if (realValue && typeof realValue === "object") {
            return wrapModelDelegate(prop, realValue, mockValue);
          }
          if (typeof realValue === "function") {
            return async (...args: any[]) => {
              if (globalForPrisma.useMock) {
                return typeof mockValue === "function" ? mockValue(...args) : realValue.apply(target, args);
              }
              try {
                return await realValue.apply(target, args);
              } catch (err: any) {
                if (isConnectionError(err)) {
                  console.warn(
                    `[Prisma Fallback] Error de conexión Prisma en '${prop}'. Activando Mock DB.`
                  );
                  globalForPrisma.useMock = true;
                  if (typeof mockValue === "function") {
                    return await mockValue(...args);
                  }
                }
                throw err;
              }
            };
          }
          return realValue ?? mockValue;
        },
      })
) as unknown as PrismaClient;


