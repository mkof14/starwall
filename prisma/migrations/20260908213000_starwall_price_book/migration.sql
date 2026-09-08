-- AlterTable
ALTER TABLE "User" ADD COLUMN "commercialRole" TEXT NOT NULL DEFAULT 'none';

-- CreateTable
CREATE TABLE "PriceBook" (
    "id" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,

    CONSTRAINT "PriceBook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PriceItem" (
    "id" TEXT NOT NULL,
    "priceBookId" TEXT NOT NULL,
    "itemCode" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "subcategory" TEXT NOT NULL DEFAULT '',
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "unit" TEXT NOT NULL,
    "internalCost" DECIMAL(14,2),
    "listPrice" DECIMAL(14,2),
    "minimumPrice" DECIMAL(14,2),
    "billingType" TEXT NOT NULL,
    "applicablePlans" TEXT NOT NULL DEFAULT 'LIGHT,ADVANCED,INTELLIGENCE,CUSTOM',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "internalNotes" TEXT NOT NULL DEFAULT '',
    "manufacturer" TEXT NOT NULL DEFAULT '',
    "model" TEXT NOT NULL DEFAULT '',
    "sku" TEXT NOT NULL DEFAULT '',
    "vendorCost" DECIMAL(14,2),
    "shippingCost" DECIMAL(14,2),
    "otherAcquisition" DECIMAL(14,2),
    "landedCost" DECIMAL(14,2),
    "markupPercent" DECIMAL(8,2),
    "listPriceOverride" BOOLEAN NOT NULL DEFAULT false,
    "installationHours" DECIMAL(8,2),
    "configurationHours" DECIMAL(8,2),
    "warranty" TEXT NOT NULL DEFAULT '',
    "leadTime" TEXT NOT NULL DEFAULT '',
    "coverageHours" TEXT NOT NULL DEFAULT '',
    "responseTarget" TEXT NOT NULL DEFAULT '',
    "escalation" TEXT NOT NULL DEFAULT '',
    "namedContact" BOOLEAN NOT NULL DEFAULT false,
    "remoteSupport" BOOLEAN NOT NULL DEFAULT false,
    "onSiteSupport" BOOLEAN NOT NULL DEFAULT false,
    "includedEngHours" DECIMAL(8,2),
    "slaNotes" TEXT NOT NULL DEFAULT '',
    "slaApproved" BOOLEAN NOT NULL DEFAULT false,
    "hourlyCost" DECIMAL(14,2),
    "customerHourly" DECIMAL(14,2),
    "customerDaily" DECIMAL(14,2),
    "minIncrementHours" DECIMAL(8,2),
    "includedInPlans" TEXT NOT NULL DEFAULT '',
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT NOT NULL,

    CONSTRAINT "PriceItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommercialCustomer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "company" TEXT NOT NULL DEFAULT '',
    "contact" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL DEFAULT '',
    "phone" TEXT NOT NULL DEFAULT '',
    "country" TEXT NOT NULL DEFAULT '',
    "notes" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommercialCustomer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quote" (
    "id" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "priceBookId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "salesOwnerId" TEXT NOT NULL,
    "opportunityId" TEXT NOT NULL DEFAULT '',
    "objectType" TEXT NOT NULL,
    "objectName" TEXT NOT NULL DEFAULT '',
    "objectSize" TEXT NOT NULL DEFAULT '',
    "location" TEXT NOT NULL DEFAULT '',
    "siteCount" INTEGER NOT NULL DEFAULT 1,
    "vesselCount" INTEGER NOT NULL DEFAULT 1,
    "objectNotes" TEXT NOT NULL DEFAULT '',
    "plan" TEXT NOT NULL,
    "infrastructure" TEXT NOT NULL DEFAULT '[]',
    "travelExpense" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "hotelExpense" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "airfareExpense" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "groundExpense" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "shippingExpense" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "otherExpense" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "overallDiscount" DECIMAL(8,2) NOT NULL DEFAULT 0,
    "discountNote" TEXT NOT NULL DEFAULT '',
    "approvalState" TEXT NOT NULL DEFAULT 'NORMAL',
    "rfpNumber" TEXT NOT NULL DEFAULT '',
    "rfpReference" TEXT NOT NULL DEFAULT '',
    "rfpDeadline" TIMESTAMP(3),
    "rfpRequirements" TEXT NOT NULL DEFAULT '',
    "rfpClarifications" TEXT NOT NULL DEFAULT '',
    "rfpCompliance" TEXT NOT NULL DEFAULT '',
    "rfpCommercial" TEXT NOT NULL DEFAULT '',
    "year1Total" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "annualRecurring" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "modifiedAt" TIMESTAMP(3) NOT NULL,
    "modifiedBy" TEXT NOT NULL,
    "parentQuoteId" TEXT,

    CONSTRAINT "Quote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuoteItem" (
    "id" TEXT NOT NULL,
    "quoteId" TEXT NOT NULL,
    "priceItemId" TEXT,
    "category" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "billingType" TEXT NOT NULL,
    "quantity" DECIMAL(10,2) NOT NULL DEFAULT 1,
    "unit" TEXT NOT NULL,
    "listPrice" DECIMAL(14,2),
    "internalCost" DECIMAL(14,2),
    "minimumPrice" DECIMAL(14,2),
    "unitPrice" DECIMAL(14,2),
    "discountPct" DECIMAL(8,2) NOT NULL DEFAULT 0,
    "customerPrice" DECIMAL(14,2),
    "engineeringHours" DECIMAL(8,2),
    "notes" TEXT NOT NULL DEFAULT '',
    "inclusion" TEXT NOT NULL DEFAULT 'ADDITIONAL',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "QuoteItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuoteVersion" (
    "id" TEXT NOT NULL,
    "quoteId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "snapshot" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "note" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "QuoteVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuoteApproval" (
    "id" TEXT NOT NULL,
    "quoteId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "reason" TEXT NOT NULL DEFAULT '',
    "requestedBy" TEXT NOT NULL,
    "decidedBy" TEXT NOT NULL DEFAULT '',
    "decidedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuoteApproval_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PriceBook_version_key" ON "PriceBook"("version");

-- CreateIndex
CREATE UNIQUE INDEX "PriceItem_priceBookId_itemCode_key" ON "PriceItem"("priceBookId", "itemCode");

-- CreateIndex
CREATE INDEX "PriceItem_category_active_idx" ON "PriceItem"("category", "active");

-- CreateIndex
CREATE UNIQUE INDEX "Quote_number_version_key" ON "Quote"("number", "version");

-- CreateIndex
CREATE INDEX "Quote_status_modifiedAt_idx" ON "Quote"("status", "modifiedAt");

-- CreateIndex
CREATE INDEX "QuoteVersion_quoteId_version_idx" ON "QuoteVersion"("quoteId", "version");

-- AddForeignKey
ALTER TABLE "PriceItem" ADD CONSTRAINT "PriceItem_priceBookId_fkey" FOREIGN KEY ("priceBookId") REFERENCES "PriceBook"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_priceBookId_fkey" FOREIGN KEY ("priceBookId") REFERENCES "PriceBook"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "CommercialCustomer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuoteItem" ADD CONSTRAINT "QuoteItem_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "Quote"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuoteItem" ADD CONSTRAINT "QuoteItem_priceItemId_fkey" FOREIGN KEY ("priceItemId") REFERENCES "PriceItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuoteVersion" ADD CONSTRAINT "QuoteVersion_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "Quote"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuoteApproval" ADD CONSTRAINT "QuoteApproval_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "Quote"("id") ON DELETE CASCADE ON UPDATE CASCADE;
