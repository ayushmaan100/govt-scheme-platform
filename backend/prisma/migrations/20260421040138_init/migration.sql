-- CreateTable
CREATE TABLE "schemes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "name_hi" TEXT,
    "slug" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "ministry" TEXT,
    "description" TEXT NOT NULL,
    "description_hi" TEXT,
    "benefit_summary" TEXT NOT NULL,
    "benefit_summary_hi" TEXT,
    "benefit_amount" TEXT,
    "application_url" TEXT NOT NULL,
    "is_central" BOOLEAN NOT NULL DEFAULT true,
    "state_code" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "last_verified" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "schemes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eligibility_rules" (
    "id" TEXT NOT NULL,
    "scheme_id" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "operator" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "description" TEXT NOT NULL,
    "description_hi" TEXT,
    "is_required" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "eligibility_rules_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "schemes_slug_key" ON "schemes"("slug");

-- AddForeignKey
ALTER TABLE "eligibility_rules" ADD CONSTRAINT "eligibility_rules_scheme_id_fkey" FOREIGN KEY ("scheme_id") REFERENCES "schemes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
