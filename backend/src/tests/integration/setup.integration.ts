import { beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Используем отдельную схему БД для интеграционных тестов
process.env.DATABASE_URL = `${process.env.DATABASE_URL}_integration`;

beforeAll(async () => {
  // Создаем тестовую схему или БД
  await prisma.$executeRaw`CREATE SCHEMA IF NOT EXISTS test_integration`;

  // Применяем миграции к тестовой БД
  const { execSync } = require('child_process');
  try {
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });
  } catch (e) {
    console.log('Migration already up to date');
  }
});

beforeEach(async () => {
  // Начинаем транзакцию для каждого теста
  await prisma.$executeRaw`BEGIN TRANSACTION`;
});

afterEach(async () => {
  // Откатываем транзакцию после каждого теста
  await prisma.$executeRaw`ROLLBACK`;
});

afterAll(async () => {
  await prisma.$disconnect();
});
