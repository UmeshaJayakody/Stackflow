import { prisma } from '../lib/prisma';
import bcrypt from 'bcrypt';

async function main() {
  console.log('Starting database seeding...');

  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      fullName: 'Admin User',
      email: 'admin@example.com',
      passwordHash: adminPasswordHash,
      role: 'admin',
    },
  });
  console.log('✓ Created admin user');

  const staffPasswordHash = await bcrypt.hash('staff123', 10);
  await prisma.user.upsert({
    where: { email: 'staff@example.com' },
    update: {},
    create: {
      fullName: 'Staff User',
      email: 'staff@example.com',
      passwordHash: staffPasswordHash,
      role: 'staff',
    },
  });
  console.log('✓ Created staff user');

  console.log('✅ Database seeding completed successfully!');
  console.log('');
  console.log('Login credentials:');
  console.log('  Admin — Email: admin@example.com  Password: admin123');
  console.log('  Staff — Email: staff@example.com  Password: staff123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
