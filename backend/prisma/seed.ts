// prisma/seed.ts
import 'dotenv/config';
import { PrismaClient, UserRole } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    // Admin
    await prisma.user.create({
        data: { name: 'Alice Admin', role: UserRole.ADMIN },
    });

    // Backend, Frontend, DevOps, Cybersecurity
    await prisma.user.createMany({
        data: [
            { name: 'Bob Backend', role: UserRole.BACKEND },
            { name: 'Charlie Frontend', role: UserRole.FRONTEND },
            { name: 'Dave DevOps', role: UserRole.DEVOPS },
            { name: 'Eve Cyber', role: UserRole.CYBERSECURITY },
        ],
    });
}

main()
    .catch(e => console.error(e))
    .finally(async () => prisma.$disconnect());