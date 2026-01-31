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
    // Hash passwords
    const adminPassword = await bcrypt.hash('admin123', 10);
    const userPassword = await bcrypt.hash('user123', 10);

    // Create admin user
    const admin = await prisma.user.create({
        data: {
            name: 'Alice Admin',
            email: 'admin@example.com',
            password: adminPassword,
            role: UserRole.ADMIN,
        },
    });

    // Create other users
    const users = await prisma.user.createMany({
        data: [
            { name: 'Bob Backend', email: 'bob@example.com', password: userPassword, role: UserRole.BACKEND },
            { name: 'Charlie Frontend', email: 'charlie@example.com', password: userPassword, role: UserRole.FRONTEND },
            { name: 'Dave DevOps', email: 'dave@example.com', password: userPassword, role: UserRole.DEVOPS },
            { name: 'Eve Cyber', email: 'eve@example.com', password: userPassword, role: UserRole.CYBERSECURITY },
        ],
    });

    // Create a sample room
    const room = await prisma.room.create({
        data: {
            name: 'Project Alpha',
            createdBy: admin.id,
        },
    });

    // Add admin as room admin
    await prisma.roomMember.create({
        data: {
            userId: admin.id,
            roomId: room.id,
            role: 'ADMIN',
        },
    });

    console.log('Seed data created successfully!');
    console.log('Admin credentials: admin@example.com / admin123');
}

main()
    .catch(e => console.error(e))
    .finally(async () => prisma.$disconnect());
