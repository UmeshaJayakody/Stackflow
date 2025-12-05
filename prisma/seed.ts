import { prisma } from '../lib/prisma';

async function main() {
  console.log('Starting database seeding...');

  // Create Warehouses
  const warehouse1 = await prisma.warehouse.create({
    data: {
      warehouseName: 'Main Warehouse',
      location: '123 Main Street, City, State 12345',
    },
  });

  const warehouse2 = await prisma.warehouse.create({
    data: {
      warehouseName: 'Secondary Warehouse',
      location: '456 Oak Avenue, City, State 12345',
    },
  });

  console.log('✓ Created warehouses');

  // Create Suppliers
  const supplier1 = await prisma.supplier.create({
    data: {
      supplierName: 'Tech Supplies Inc.',
      contactPerson: 'John Smith',
      phone: '555-0101',
      email: 'contact@techsupplies.com',
      address: '789 Tech Blvd, Tech City, TC 67890',
    },
  });

  const supplier2 = await prisma.supplier.create({
    data: {
      supplierName: 'Electronics Wholesale',
      contactPerson: 'Jane Doe',
      phone: '555-0202',
      email: 'sales@electronicswholesale.com',
      address: '321 Electronics Way, E-Town, ET 54321',
    },
  });

  console.log('✓ Created suppliers');

  // Create Customers
  const customer1 = await prisma.customer.create({
    data: {
      customerName: 'ABC Corporation',
      phone: '555-1001',
      email: 'purchasing@abccorp.com',
      address: '100 Business Park, Business City, BC 11111',
    },
  });

  const customer2 = await prisma.customer.create({
    data: {
      customerName: 'XYZ Retail Store',
      phone: '555-1002',
      email: 'orders@xyzretail.com',
      address: '200 Retail Plaza, Shopping City, SC 22222',
    },
  });

  console.log('✓ Created customers');

  // Create Users
  const user1 = await prisma.user.create({
    data: {
      fullName: 'Admin User',
      email: 'admin@inventory.com',
      passwordHash: '$2a$10$examplehash', // In production, use proper password hashing
      role: 'admin',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      fullName: 'Staff User',
      email: 'staff@inventory.com',
      passwordHash: '$2a$10$examplehash',
      role: 'staff',
    },
  });

  console.log('✓ Created users');

  // Create Products
  const products = await prisma.product.createMany({
    data: [
      {
        productName: 'Laptop HP ProBook 450',
        sku: 'LAP-HP-001',
        category: 'Computers',
        unitPrice: 899.99,
        quantity: 50,
        minimumQuantity: 10,
        maximumQuantity: 100,
        warehouseId: warehouse1.warehouseId,
        supplierId: supplier1.supplierId,
      },
      {
        productName: 'Dell Monitor 24 inch',
        sku: 'MON-DEL-001',
        category: 'Monitors',
        unitPrice: 199.99,
        quantity: 75,
        minimumQuantity: 15,
        maximumQuantity: 150,
        warehouseId: warehouse1.warehouseId,
        supplierId: supplier1.supplierId,
      },
      {
        productName: 'Logitech Wireless Mouse',
        sku: 'MOUSE-LOG-001',
        category: 'Accessories',
        unitPrice: 29.99,
        quantity: 200,
        minimumQuantity: 50,
        maximumQuantity: 500,
        warehouseId: warehouse2.warehouseId,
        supplierId: supplier1.supplierId,
      },
      {
        productName: 'Mechanical Keyboard RGB',
        sku: 'KB-MECH-001',
        category: 'Accessories',
        unitPrice: 79.99,
        quantity: 120,
        minimumQuantity: 30,
        maximumQuantity: 300,
        warehouseId: warehouse2.warehouseId,
        supplierId: supplier2.supplierId,
      },
      {
        productName: 'USB-C Hub 7-in-1',
        sku: 'HUB-USBC-001',
        category: 'Accessories',
        unitPrice: 49.99,
        quantity: 22, // Low stock: min=20, max=200, threshold=20+(180*0.1)=38
        minimumQuantity: 20,
        maximumQuantity: 200,
        warehouseId: warehouse1.warehouseId,
        supplierId: supplier1.supplierId,
      },
      {
        productName: 'Webcam HD 1080p',
        sku: 'CAM-HD-001',
        category: 'Peripherals',
        unitPrice: 69.99,
        quantity: 18, // Low stock: min=15, max=150, threshold=15+(135*0.1)=28.5
        minimumQuantity: 15,
        maximumQuantity: 150,
        warehouseId: warehouse1.warehouseId,
        supplierId: supplier2.supplierId,
      },
      {
        productName: 'Wireless Headset',
        sku: 'HEAD-WIRE-001',
        category: 'Audio',
        unitPrice: 119.99,
        quantity: 12, // Low stock: min=10, max=100, threshold=10+(90*0.1)=19
        minimumQuantity: 10,
        maximumQuantity: 100,
        warehouseId: warehouse2.warehouseId,
        supplierId: supplier1.supplierId,
      },
      {
        productName: 'External SSD 1TB',
        sku: 'SSD-EXT-001',
        category: 'Storage',
        unitPrice: 149.99,
        quantity: 35,
        minimumQuantity: 10,
        maximumQuantity: 80,
        warehouseId: warehouse1.warehouseId,
        supplierId: supplier2.supplierId,
      },
      {
        productName: 'Laptop Stand Aluminum',
        sku: 'STAND-ALU-001',
        category: 'Accessories',
        unitPrice: 39.99,
        quantity: 90,
        minimumQuantity: 20,
        maximumQuantity: 200,
        warehouseId: warehouse2.warehouseId,
        supplierId: supplier1.supplierId,
      },
      {
        productName: 'HDMI Cable 6ft',
        sku: 'CABLE-HDMI-001',
        category: 'Cables',
        unitPrice: 12.99,
        quantity: 300,
        minimumQuantity: 100,
        maximumQuantity: 1000,
        warehouseId: warehouse1.warehouseId,
        supplierId: supplier2.supplierId,
      },
    ],
  });

  console.log(`✓ Created ${products.count} products`);

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
