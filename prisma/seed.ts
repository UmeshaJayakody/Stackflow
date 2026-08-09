import { prisma } from '../lib/prisma';
import { logActivity } from '../lib/activityLogger';
import bcrypt from 'bcrypt';

const DAY = 24 * 60 * 60 * 1000;
function daysAgo(n: number) {
  return new Date(Date.now() - n * DAY);
}

async function seedUsers() {
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'admin123';
  const staffPassword = process.env.SEED_STAFF_PASSWORD || 'staff123';

  const adminPasswordHash = await bcrypt.hash(adminPassword, 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: { passwordHash: adminPasswordHash },
    create: {
      fullName: 'Admin User',
      email: 'admin@example.com',
      passwordHash: adminPasswordHash,
      role: 'admin',
    },
  });
  console.log('✓ Synced admin user');

  const staffPasswordHash = await bcrypt.hash(staffPassword, 10);
  await prisma.user.upsert({
    where: { email: 'staff@example.com' },
    update: { passwordHash: staffPasswordHash },
    create: {
      fullName: 'Staff User',
      email: 'staff@example.com',
      passwordHash: staffPasswordHash,
      role: 'staff',
    },
  });
  console.log('✓ Synced staff user');

  return admin;
}

interface ProductDef {
  name: string;
  sku: string;
  category: string;
  price: number;
  min: number;
  max: number;
  warehouseIdx: 0 | 1;
  supplierIdx: 0 | 1 | 2 | 3;
  /** Intentionally left near/below the low-stock threshold to exercise the dashboard's low-stock alert. */
  lowStock?: boolean;
}

const PRODUCT_DEFS: ProductDef[] = [
  { name: 'Wireless Mouse', sku: 'WM-1001', category: 'Electronics', price: 15.99, min: 20, max: 150, warehouseIdx: 0, supplierIdx: 0 },
  { name: 'Mechanical Keyboard', sku: 'KB-1002', category: 'Electronics', price: 49.99, min: 15, max: 100, warehouseIdx: 0, supplierIdx: 0, lowStock: true },
  { name: 'USB-C Hub', sku: 'UC-1003', category: 'Electronics', price: 24.99, min: 15, max: 120, warehouseIdx: 0, supplierIdx: 2 },
  { name: 'Bluetooth Speaker', sku: 'BS-1004', category: 'Electronics', price: 34.99, min: 10, max: 80, warehouseIdx: 1, supplierIdx: 2 },
  { name: 'A4 Paper Ream', sku: 'PP-2001', category: 'Office Supplies', price: 5.49, min: 50, max: 400, warehouseIdx: 0, supplierIdx: 1 },
  { name: 'Ballpoint Pen Box (12pk)', sku: 'PN-2002', category: 'Office Supplies', price: 3.99, min: 40, max: 300, warehouseIdx: 0, supplierIdx: 1 },
  { name: 'Desk Organizer', sku: 'DO-2003', category: 'Office Supplies', price: 12.99, min: 15, max: 100, warehouseIdx: 1, supplierIdx: 1 },
  { name: 'Heavy Duty Stapler', sku: 'ST-2004', category: 'Office Supplies', price: 8.99, min: 20, max: 120, warehouseIdx: 0, supplierIdx: 1, lowStock: true },
  { name: 'Ceramic Coffee Mug', sku: 'CM-3001', category: 'Home & Kitchen', price: 6.99, min: 30, max: 200, warehouseIdx: 1, supplierIdx: 3 },
  { name: 'Stainless Steel Water Bottle', sku: 'WB-3002', category: 'Home & Kitchen', price: 14.99, min: 20, max: 150, warehouseIdx: 1, supplierIdx: 3 },
  { name: 'Laptop Sleeve 15"', sku: 'LS-4001', category: 'Accessories', price: 19.99, min: 15, max: 100, warehouseIdx: 0, supplierIdx: 0 },
  { name: 'Adjustable Phone Stand', sku: 'PS-4002', category: 'Accessories', price: 9.99, min: 25, max: 150, warehouseIdx: 1, supplierIdx: 2 },
];

async function seedBusinessData(admin: { userId: number }) {
  const existingProducts = await prisma.product.count();
  if (existingProducts > 0) {
    console.log('✓ Business data already present, skipping demo data seed');
    return;
  }

  console.log('Seeding demo business data...');

  const warehouses = await Promise.all([
    prisma.warehouse.create({ data: { warehouseName: 'Main Warehouse', location: 'New York, NY' } }),
    prisma.warehouse.create({ data: { warehouseName: 'West Coast Warehouse', location: 'Los Angeles, CA' } }),
  ]);
  for (const w of warehouses) {
    await logActivity({ userId: admin.userId, action: 'CREATE', entityType: 'WAREHOUSE', entityId: w.warehouseId, entityName: w.warehouseName, details: `Created warehouse: ${w.warehouseName}` });
  }

  const suppliers = await Promise.all([
    prisma.supplier.create({ data: { supplierName: 'TechSource Distributors', contactPerson: 'Daniel Reyes', phone: '212-555-0134', email: 'sales@techsource.example.com', address: '88 Circuit Ave, New York, NY' } }),
    prisma.supplier.create({ data: { supplierName: 'Global Office Supplies Co.', contactPerson: 'Priya Nair', phone: '312-555-0198', email: 'orders@globaloffice.example.com', address: '450 Paper Mill Rd, Chicago, IL' } }),
    prisma.supplier.create({ data: { supplierName: 'Prime Electronics Wholesale', contactPerson: 'Marcus Lee', phone: '415-555-0176', email: 'wholesale@primeelectronics.example.com', address: '12 Harbor Blvd, San Francisco, CA' } }),
    prisma.supplier.create({ data: { supplierName: 'EcoPack Manufacturing', contactPerson: 'Sofia Martins', phone: '512-555-0142', email: 'contact@ecopack.example.com', address: '77 Greenway Dr, Austin, TX' } }),
  ]);
  for (const s of suppliers) {
    await logActivity({ userId: admin.userId, action: 'CREATE', entityType: 'SUPPLIER', entityId: s.supplierId, entityName: s.supplierName, details: `Added supplier: ${s.supplierName}` });
  }

  const customers = await Promise.all([
    prisma.customer.create({ data: { customerName: 'Acme Retail Group', phone: '646-555-0111', email: 'purchasing@acmeretail.example.com', address: '200 Market St, New York, NY' } }),
    prisma.customer.create({ data: { customerName: 'Blue Horizon Traders', phone: '702-555-0123', email: 'orders@bluehorizon.example.com', address: '9 Lakeside Ave, Las Vegas, NV' } }),
    prisma.customer.create({ data: { customerName: 'Sunrise Mart', phone: '305-555-0165', email: 'buying@sunrisemart.example.com', address: '31 Palm St, Miami, FL' } }),
    prisma.customer.create({ data: { customerName: 'Metro Convenience Stores', phone: '773-555-0187', email: 'supply@metrocvs.example.com', address: '500 Union Ave, Chicago, IL' } }),
    prisma.customer.create({ data: { customerName: 'Green Valley Distributors', phone: '503-555-0149', email: 'orders@greenvalley.example.com', address: '18 Orchard Rd, Portland, OR' } }),
    prisma.customer.create({ data: { customerName: 'Silver Line Enterprises', phone: '617-555-0132', email: 'purchasing@silverline.example.com', address: '64 Beacon St, Boston, MA' } }),
  ]);
  for (const c of customers) {
    await logActivity({ userId: admin.userId, action: 'CREATE', entityType: 'CUSTOMER', entityId: c.customerId, entityName: c.customerName, details: `Added customer: ${c.customerName}` });
  }

  let saleCounter = 0;

  for (let idx = 0; idx < PRODUCT_DEFS.length; idx++) {
    const def = PRODUCT_DEFS[idx];
    const warehouse = warehouses[def.warehouseIdx];
    const supplier = suppliers[def.supplierIdx];
    const costPrice = Math.round(def.price * 0.6 * 100) / 100;

    const product = await prisma.product.create({
      data: {
        productName: def.name,
        sku: def.sku,
        category: def.category,
        unitPrice: def.price,
        quantity: 0,
        minimumQuantity: def.min,
        maximumQuantity: def.max,
        warehouseId: warehouse.warehouseId,
        supplierId: supplier.supplierId,
        createdBy: admin.userId,
      },
    });
    await logActivity({ userId: admin.userId, action: 'CREATE', entityType: 'PRODUCT', entityId: product.productId, entityName: product.productName, details: `Created product: ${product.productName} (SKU: ${product.sku})` });

    // Initial restock purchase, dated in the past so it's the oldest FIFO batch.
    const initialQty = Math.round(def.max * 0.7);
    const initialDate = daysAgo(45 - (idx % 6));
    const initialPurchase = await prisma.purchase.create({
      data: {
        supplierId: supplier.supplierId,
        productId: product.productId,
        purchasedQuantity: initialQty,
        purchasePrice: costPrice,
        purchaseDate: initialDate,
        createdBy: admin.userId,
      },
    });
    await prisma.stockBatch.create({
      data: {
        productId: product.productId,
        purchaseId: initialPurchase.purchaseId,
        quantityIn: initialQty,
        quantityRemaining: initialQty,
        purchasePrice: costPrice,
        batchDate: initialDate,
      },
    });
    await prisma.stockMovement.create({
      data: { productId: product.productId, quantity: initialQty, type: 'IN', reference: `Purchase #${initialPurchase.purchaseId}`, userId: admin.userId, createdAt: initialDate },
    });
    await logActivity({
      userId: admin.userId,
      action: 'CREATE',
      entityType: 'PURCHASE',
      entityId: initialPurchase.purchaseId,
      entityName: `${product.productName} from ${supplier.supplierName}`,
      details: `Recorded purchase: ${initialQty} units of ${product.productName} from ${supplier.supplierName} at $${costPrice}/unit`,
    });

    let stockQty = initialQty;
    let batchRemaining = initialQty;

    const sellUnits = async (qtyToSell: number, daysBack: number) => {
      if (qtyToSell <= 0) return;
      const saleDate = daysAgo(Math.max(1, daysBack));
      const customer = customers[(saleCounter + idx) % customers.length];
      const cost = qtyToSell * costPrice;

      const sale = await prisma.sale.create({
        data: {
          customerId: customer.customerId,
          productId: product.productId,
          soldQuantity: qtyToSell,
          salePrice: def.price,
          costOfGoodsSold: cost,
          saleDate,
          createdBy: admin.userId,
        },
      });

      await prisma.stockBatch.updateMany({
        where: { purchaseId: initialPurchase.purchaseId },
        data: { quantityRemaining: { decrement: qtyToSell } },
      });

      await prisma.stockMovement.create({
        data: { productId: product.productId, quantity: -qtyToSell, type: 'OUT', reference: `Sale #${sale.saleId}`, userId: admin.userId, createdAt: saleDate },
      });

      const profit = qtyToSell * def.price - cost;
      await logActivity({
        userId: admin.userId,
        action: 'CREATE',
        entityType: 'SALE',
        entityId: sale.saleId,
        entityName: `${product.productName} to ${customer.customerName}`,
        details: `Recorded sale: ${qtyToSell} units of ${product.productName} to ${customer.customerName} at $${def.price}/unit (Profit: $${profit.toFixed(2)})`,
      });

      batchRemaining -= qtyToSell;
      stockQty -= qtyToSell;
      saleCounter++;
    };

    // Sell down over the last ~25 days via FIFO, leaving a floor above (or,
    // for a couple of products, right around) the low-stock threshold.
    const lowStockThreshold = def.min + Math.round((def.max - def.min) * 0.1);
    const sellFloor = def.lowStock ? Math.max(0, def.min - Math.round((def.max - def.min) * 0.05)) : lowStockThreshold + Math.round((def.max - def.min) * 0.15);

    const numSales = 3 + (idx % 3);
    for (let s = 0; s < numSales; s++) {
      if (batchRemaining <= sellFloor) break;
      const desiredQty = Math.max(1, Math.round(batchRemaining * (0.1 + s * 0.03)));
      const qtyToSell = Math.min(desiredQty, batchRemaining - sellFloor);
      await sellUnits(qtyToSell, 25 - s * 5 - (saleCounter % 3));
    }

    // Guarantee low-stock products actually land at/below their threshold -
    // the gradual sell-down above asymptotically approaches sellFloor but
    // rarely reaches it within a handful of sales.
    if (def.lowStock && batchRemaining > sellFloor) {
      await sellUnits(batchRemaining - sellFloor, 2);
    }

    // Recent top-up purchase to keep most products comfortably stocked
    // (skipped for the intentionally low-stock products).
    if (!def.lowStock) {
      const topUpQty = Math.round(def.max * 0.25);
      const topUpDate = daysAgo(3 + (idx % 4));
      const topUpPurchase = await prisma.purchase.create({
        data: {
          supplierId: supplier.supplierId,
          productId: product.productId,
          purchasedQuantity: topUpQty,
          purchasePrice: costPrice,
          purchaseDate: topUpDate,
          createdBy: admin.userId,
        },
      });
      await prisma.stockBatch.create({
        data: {
          productId: product.productId,
          purchaseId: topUpPurchase.purchaseId,
          quantityIn: topUpQty,
          quantityRemaining: topUpQty,
          purchasePrice: costPrice,
          batchDate: topUpDate,
        },
      });
      await prisma.stockMovement.create({
        data: { productId: product.productId, quantity: topUpQty, type: 'IN', reference: `Purchase #${topUpPurchase.purchaseId}`, userId: admin.userId, createdAt: topUpDate },
      });
      await logActivity({
        userId: admin.userId,
        action: 'CREATE',
        entityType: 'PURCHASE',
        entityId: topUpPurchase.purchaseId,
        entityName: `${product.productName} from ${supplier.supplierName}`,
        details: `Recorded purchase: ${topUpQty} units of ${product.productName} from ${supplier.supplierName} at $${costPrice}/unit`,
      });
      stockQty += topUpQty;
    }

    await prisma.product.update({
      where: { productId: product.productId },
      data: { quantity: stockQty },
    });
  }

  console.log(`✓ Seeded ${PRODUCT_DEFS.length} products, ${warehouses.length} warehouses, ${suppliers.length} suppliers, ${customers.length} customers, and ${saleCounter} sales`);
}

async function main() {
  console.log('Starting database seeding...');
  const admin = await seedUsers();
  await seedBusinessData(admin);
  console.log('✅ Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
