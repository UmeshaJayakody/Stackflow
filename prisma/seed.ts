import { prisma } from '../lib/prisma';
import bcrypt from 'bcrypt';

async function main() {
  console.log('Starting database seeding...');

  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'admin123';
  const staffPassword = process.env.SEED_STAFF_PASSWORD || 'staff123';

  const adminPasswordHash = await bcrypt.hash(adminPassword, 10);
  await prisma.user.upsert({
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
