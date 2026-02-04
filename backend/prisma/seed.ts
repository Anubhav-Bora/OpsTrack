// prisma/seed.ts
import 'dotenv/config';
import { PrismaClient, UserRole } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    const hashedPassword = await bcrypt.hash('admin123', 10);

    await prisma.user.create({
        data: {
            name: 'Admin',
            email: 'admin123@gmail.com',
            password: hashedPassword,
            role: UserRole.ADMIN,
        },
    });
}

main()
    .catch(e => {
        throw e;
    })
    .finally(async () => prisma.$disconnect());
