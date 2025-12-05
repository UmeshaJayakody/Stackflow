-- CreateTable
CREATE TABLE "stock_batches" (
    "batch_id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "purchase_id" INTEGER NOT NULL,
    "quantity_in" INTEGER NOT NULL,
    "quantity_remaining" INTEGER NOT NULL,
    "purchase_price" DECIMAL(10,2) NOT NULL,
    "batch_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stock_batches_pkey" PRIMARY KEY ("batch_id")
);

-- AddForeignKey
ALTER TABLE "stock_batches" ADD CONSTRAINT "stock_batches_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("product_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_batches" ADD CONSTRAINT "stock_batches_purchase_id_fkey" FOREIGN KEY ("purchase_id") REFERENCES "purchases"("purchase_id") ON DELETE CASCADE ON UPDATE CASCADE;
