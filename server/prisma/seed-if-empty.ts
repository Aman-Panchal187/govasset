import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
const count = await p.user.count();
await p.$disconnect();
if (count === 0) { console.log('Empty database: seeding sample data'); await import('./seed.ts'); }
else console.log('Database already has data; skipping seed');
