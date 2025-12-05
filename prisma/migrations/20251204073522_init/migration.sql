-- CreateTable
CREATE TABLE "users" (
    "user_id" SERIAL NOT NULL,
    "full_name" VARCHAR(150) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" VARCHAR(50) NOT NULL DEFAULT 'staff',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "warehouses" (
    "warehouse_id" SERIAL NOT NULL,
    "warehouse_name" VARCHAR(150) NOT NULL,
    "location" TEXT,

    CONSTRAINT "warehouses_pkey" PRIMARY KEY ("warehouse_id")
);

-- CreateTable
CREATE TABLE "suppliers" (
    "supplier_id" SERIAL NOT NULL,
    "supplier_name" VARCHAR(150) NOT NULL,
    "contact_person" VARCHAR(150),
    "phone" VARCHAR(50),
    "email" VARCHAR(150),
    "address" TEXT,

    CONSTRAINT "suppliers_pkey" PRIMARY KEY ("supplier_id")
);

-- CreateTable
CREATE TABLE "customers" (
    "customer_id" SERIAL NOT NULL,
    "customer_name" VARCHAR(150) NOT NULL,
    "phone" VARCHAR(50),
    "email" VARCHAR(150),
    "address" TEXT,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("customer_id")
);

-- CreateTable
CREATE TABLE "products" (
    "product_id" SERIAL NOT NULL,
    "product_name" VARCHAR(150) NOT NULL,
    "sku" VARCHAR(100) NOT NULL,
    "unit_price" DECIMAL(10,2) NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "minimum_quantity" INTEGER NOT NULL DEFAULT 0,
    "maximum_quantity" INTEGER NOT NULL DEFAULT 0,
    "warehouse_id" INTEGER,

    CONSTRAINT "products_pkey" PRIMARY KEY ("product_id")
);

-- CreateTable
CREATE TABLE "purchases" (
    "purchase_id" SERIAL NOT NULL,
    "supplier_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "purchased_quantity" INTEGER NOT NULL,
    "purchase_price" DECIMAL(10,2) NOT NULL,
    "purchase_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,

    CONSTRAINT "purchases_pkey" PRIMARY KEY ("purchase_id")
);

-- CreateTable
CREATE TABLE "sales" (
    "sale_id" SERIAL NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "sold_quantity" INTEGER NOT NULL,
    "sale_price" DECIMAL(10,2) NOT NULL,
    "sale_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,

    CONSTRAINT "sales_pkey" PRIMARY KEY ("sale_id")
);

-- CreateTable
CREATE TABLE "stock_movements" (
    "movement_id" SERIAL NOT NULL,
    "product_id" INTEGER,
    "quantity" INTEGER NOT NULL,
    "type" VARCHAR(10) NOT NULL,
    "reference" VARCHAR(100),
    "user_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stock_movements_pkey" PRIMARY KEY ("movement_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "products_sku_key" ON "products"("sku");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "warehouses"("warehouse_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "suppliers"("supplier_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("product_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales" ADD CONSTRAINT "sales_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("customer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales" ADD CONSTRAINT "sales_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("product_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales" ADD CONSTRAINT "sales_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("product_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
