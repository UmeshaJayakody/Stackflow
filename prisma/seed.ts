import { prisma } from '../lib/prisma';
import bcrypt from 'bcrypt';

async function main() {
  console.log('Starting database seeding...');

  // Check if admin user already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'admin@example.com' }
  });

  let adminUser: { userId: number; email: string; fullName: string; role: string };

  if (!existingAdmin) {
    // Create Admin User
    const hashedPassword = await bcrypt.hash('admin123', 10);

    adminUser = await prisma.user.create({
      data: {
        fullName: 'Admin User',
        email: 'admin@example.com',
        passwordHash: hashedPassword,
        role: 'admin',
      },
    });

    console.log('✓ Created admin user');
  } else {
    adminUser = existingAdmin;
    console.log('✓ Admin user already exists');
  }

  // Check if sample data already exists
  const existingProducts = await prisma.product.count();
  if (existingProducts > 0) {
    console.log('✓ Sample data already exists');
    console.log('');
    console.log('Login credentials:');
    console.log('  Email: admin@example.com');
    console.log('  Password: admin123');
    console.log('');
    console.log('To reset sample data, run: npx prisma migrate reset --force');
    return;
  }

  // Create Warehouses
  const warehouses = await Promise.all([
    prisma.warehouse.create({
      data: {
        warehouseName: 'Main Warehouse',
        location: '123 Main Street, Colombo, Sri Lanka',
      },
    }),
    prisma.warehouse.create({
      data: {
        warehouseName: 'Branch Warehouse',
        location: '456 Branch Road, Kandy, Sri Lanka',
      },
    }),
  ]);

  console.log('✓ Created warehouses');

  // Create Suppliers
  const suppliers = await Promise.all([
    prisma.supplier.create({
      data: {
        supplierName: 'TechCorp Electronics',
        contactPerson: 'John Smith',
        phone: '+94 11 2345678',
        email: 'john@techcorp.lk',
        address: '789 Tech Street, Colombo 03, Sri Lanka',
      },
    }),
    prisma.supplier.create({
      data: {
        supplierName: 'Global Office Supplies',
        contactPerson: 'Sarah Johnson',
        phone: '+94 11 3456789',
        email: 'sarah@globaloffice.lk',
        address: '321 Office Lane, Colombo 05, Sri Lanka',
      },
    }),
    prisma.supplier.create({
      data: {
        supplierName: 'Fashion Hub',
        contactPerson: 'Mike Davis',
        phone: '+94 11 4567890',
        email: 'mike@fashionhub.lk',
        address: '654 Fashion Avenue, Colombo 07, Sri Lanka',
      },
    }),
  ]);

  console.log('✓ Created suppliers');

  // Create Customers
  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        customerName: 'ABC Company Ltd',
        phone: '+94 11 5678901',
        email: 'orders@abccompany.lk',
        address: '987 Business Park, Colombo 02, Sri Lanka',
      },
    }),
    prisma.customer.create({
      data: {
        customerName: 'XYZ Retail Store',
        phone: '+94 11 6789012',
        email: 'purchase@xyzretail.lk',
        address: '147 Retail Plaza, Colombo 04, Sri Lanka',
      },
    }),
  ]);

  console.log('✓ Created customers');

  // Create Products - All with quantity: 0
  const products = await Promise.all([
    // Electronics
    prisma.product.create({
      data: {
        productName: 'Wireless Bluetooth Headphones',
        sku: 'ELEC-001',
        category: 'Electronics',
        unitPrice: 89.99,
        quantity: 0,
        minimumQuantity: 10,
        maximumQuantity: 100,
        warehouseId: warehouses[0].warehouseId,
        supplierId: suppliers[0].supplierId,
        createdBy: adminUser.userId,
      },
    }),
    prisma.product.create({
      data: {
        productName: 'USB-C Charging Cable (2m)',
        sku: 'ELEC-002',
        category: 'Electronics',
        unitPrice: 12.99,
        quantity: 0,
        minimumQuantity: 50,
        maximumQuantity: 500,
        warehouseId: warehouses[0].warehouseId,
        supplierId: suppliers[0].supplierId,
        createdBy: adminUser.userId,
      },
    }),
    prisma.product.create({
      data: {
        productName: 'Wireless Mouse',
        sku: 'ELEC-003',
        category: 'Electronics',
        unitPrice: 24.99,
        quantity: 0,
        minimumQuantity: 20,
        maximumQuantity: 150,
        warehouseId: warehouses[1].warehouseId,
        supplierId: suppliers[0].supplierId,
        createdBy: adminUser.userId,
      },
    }),
    prisma.product.create({
      data: {
        productName: '4K LED Monitor (24")',
        sku: 'ELEC-004',
        category: 'Electronics',
        unitPrice: 199.99,
        quantity: 0,
        minimumQuantity: 5,
        maximumQuantity: 50,
        warehouseId: warehouses[0].warehouseId,
        supplierId: suppliers[0].supplierId,
        createdBy: adminUser.userId,
      },
    }),
    prisma.product.create({
      data: {
        productName: 'Mechanical Keyboard',
        sku: 'ELEC-005',
        category: 'Electronics',
        unitPrice: 89.99,
        quantity: 0,
        minimumQuantity: 8,
        maximumQuantity: 70,
        warehouseId: warehouses[1].warehouseId,
        supplierId: suppliers[0].supplierId,
        createdBy: adminUser.userId,
      },
    }),

    // Office Supplies
    prisma.product.create({
      data: {
        productName: 'A4 Paper (500 sheets)',
        sku: 'OFF-001',
        category: 'Office Supplies',
        unitPrice: 8.50,
        quantity: 0,
        minimumQuantity: 100,
        maximumQuantity: 1000,
        warehouseId: warehouses[0].warehouseId,
        supplierId: suppliers[1].supplierId,
        createdBy: adminUser.userId,
      },
    }),
    prisma.product.create({
      data: {
        productName: 'Black Ballpoint Pens (Pack of 12)',
        sku: 'OFF-002',
        category: 'Office Supplies',
        unitPrice: 4.99,
        quantity: 0,
        minimumQuantity: 50,
        maximumQuantity: 300,
        warehouseId: warehouses[0].warehouseId,
        supplierId: suppliers[1].supplierId,
        createdBy: adminUser.userId,
      },
    }),
    prisma.product.create({
      data: {
        productName: 'Stapler with Staples',
        sku: 'OFF-003',
        category: 'Office Supplies',
        unitPrice: 7.99,
        quantity: 0,
        minimumQuantity: 25,
        maximumQuantity: 200,
        warehouseId: warehouses[1].warehouseId,
        supplierId: suppliers[1].supplierId,
        createdBy: adminUser.userId,
      },
    }),
    prisma.product.create({
      data: {
        productName: 'Ring Binder (A4, 2")',
        sku: 'OFF-004',
        category: 'Office Supplies',
        unitPrice: 3.99,
        quantity: 0,
        minimumQuantity: 30,
        maximumQuantity: 180,
        warehouseId: warehouses[0].warehouseId,
        supplierId: suppliers[1].supplierId,
        createdBy: adminUser.userId,
      },
    }),

    // Fashion Items
    prisma.product.create({
      data: {
        productName: 'Cotton T-Shirt (White, M)',
        sku: 'FASH-001',
        category: 'Fashion',
        unitPrice: 15.99,
        quantity: 0,
        minimumQuantity: 30,
        maximumQuantity: 250,
        warehouseId: warehouses[1].warehouseId,
        supplierId: suppliers[2].supplierId,
        createdBy: adminUser.userId,
      },
    }),
    prisma.product.create({
      data: {
        productName: 'Denim Jeans (Blue, 32)',
        sku: 'FASH-002',
        category: 'Fashion',
        unitPrice: 49.99,
        quantity: 0,
        minimumQuantity: 15,
        maximumQuantity: 120,
        warehouseId: warehouses[1].warehouseId,
        supplierId: suppliers[2].supplierId,
        createdBy: adminUser.userId,
      },
    }),
    prisma.product.create({
      data: {
        productName: 'Running Shoes (Size 9)',
        sku: 'FASH-003',
        category: 'Fashion',
        unitPrice: 79.99,
        quantity: 0,
        minimumQuantity: 10,
        maximumQuantity: 80,
        warehouseId: warehouses[0].warehouseId,
        supplierId: suppliers[2].supplierId,
        createdBy: adminUser.userId,
      },
    }),
  ]);

  console.log('✓ Created products');

  console.log('✅ Database seeding completed successfully!');
  console.log('');
  console.log('Login credentials:');
  console.log('  Email: admin@example.com');
  console.log('  Password: admin123');
  console.log('');
  console.log('Sample Data Summary:');
  console.log(`  - ${warehouses.length} Warehouses`);
  console.log(`  - ${suppliers.length} Suppliers`);
  console.log(`  - ${customers.length} Customers`);
  console.log(`  - ${products.length} Products (all with quantity: 0)`);
  console.log('');
  console.log('Product Categories:');
  console.log('  - Electronics: Wireless headphones, USB cables, monitors, keyboards');
  console.log('  - Office Supplies: Paper, pens, staplers, binders');
  console.log('  - Fashion: T-shirts, jeans, shoes');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
