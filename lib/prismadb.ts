import { PrismaClient } from '../generated/client/client';



import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';


declare global {
    // eslint-disable-next-line no-var
    var prisma: PrismaClient | undefined;
}


const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);


const prismadb = globalThis.prisma || new PrismaClient({ adapter });
if (process.env.NODE_ENV === 'production') {
    globalThis.prisma = prismadb;
}
export default prismadb;