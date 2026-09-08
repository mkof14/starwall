import type { PrismaClient } from "@prisma/client";
import { PRICE_BOOK_NAME, PRICE_BOOK_VERSION, SEED_ITEMS } from "@/lib/price-book/catalog";

export async function ensurePriceBookSeed(prisma: PrismaClient, actorId = "system") {
  let book = await prisma.priceBook.findUnique({ where: { version: PRICE_BOOK_VERSION } });
  if (!book) {
    book = await prisma.priceBook.create({
      data: {
        version: PRICE_BOOK_VERSION,
        name: PRICE_BOOK_NAME,
        status: "active",
        createdBy: actorId,
      },
    });
  }

  await prisma.priceBook.updateMany({
    where: { id: { not: book.id }, status: "active" },
    data: { status: "archived" },
  });

  for (const item of SEED_ITEMS) {
    const existing = await prisma.priceItem.findUnique({
      where: { priceBookId_itemCode: { priceBookId: book.id, itemCode: item.itemCode } },
    });
    if (existing) continue;
    await prisma.priceItem.create({
      data: {
        priceBookId: book.id,
        itemCode: item.itemCode,
        category: item.category,
        subcategory: item.subcategory ?? "",
        name: item.name,
        description: item.description,
        unit: item.unit,
        billingType: item.billingType,
        listPrice: item.listPrice ?? null,
        minimumPrice: item.minimumPrice ?? null,
        applicablePlans: item.applicablePlans ?? "LIGHT,ADVANCED,INTELLIGENCE,CUSTOM",
        includedInPlans: item.includedInPlans ?? "",
        internalNotes: item.internalNotes ?? "",
        updatedBy: actorId,
      },
    });
  }

  return book;
}

export async function getActivePriceBook(prisma: PrismaClient) {
  return prisma.priceBook.findFirst({
    where: { status: "active" },
    orderBy: { createdAt: "desc" },
  });
}
