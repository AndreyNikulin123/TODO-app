// import { PrismaClient } from '@prisma/client';

// const globalForPrisma = global as unknown as { prisma: PrismaClient };

// const prisma = globalForPrisma.prisma || new PrismaClient();

// if (process.env.NODE_ENV !== 'production') {
//   globalForPrisma.prisma = prisma;
// }

// export default prisma;
import { PrismaClient } from '@prisma/client';

// Создаем единственный экземпляр Prisma Client
const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === 'development'
      ? ['query', 'error', 'warn']
      : ['error'],
});

// Обработка завершения процесса
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export default prisma;
