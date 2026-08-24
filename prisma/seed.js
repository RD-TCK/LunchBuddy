const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@mealflow.com';
  const password = 'password123';
  const name = 'Admin Owner';

  console.log('Seeding database...');

  // Check if owner already exists
  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    console.log('Seed: User admin@mealflow.com already exists.');
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      name,
      passwordHash,
      role: 'OWNER',
      isActive: true,
    },
  });

  console.log('Seed successful: Created OWNER user:', user.email);
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
