import type { Prisma, PrismaClient } from "@generated/prisma/client";

/**
 * Bu tip, hem ana PrismaClient'ı hem de transaction sırasındaki
 * özel client'ı (tx) kapsar. Repository'lerimiz artık bu tipi kullanacak.
 */
export type PrismaTransactionalClient = PrismaClient | Prisma.TransactionClient;
