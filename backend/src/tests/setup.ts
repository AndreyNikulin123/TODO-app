import { beforeAll, afterAll, afterEach } from 'vitest';
import { PrismaClient } from '@prisma/client';
import prisma from '../config/database';

beforeAll(async () => {
  // Запускаем миграции перед тестами
  const { execSync } = require('child_process');
  try {
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });
  } catch (e) {
    console.log('Migration already up to date');
  }
});

afterEach(async () => {
  // Очищаем данные после каждого теста
  await prisma.task.deleteMany();
  await prisma.folder.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});
