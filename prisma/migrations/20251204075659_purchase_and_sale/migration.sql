-- AlterTable
ALTER TABLE "products" ADD COLUMN     "supplier_id" INTEGER;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "suppliers"("supplier_id") ON DELETE SET NULL ON UPDATE CASCADE;
