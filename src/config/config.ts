import * as dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT ?? 8080,
  apiPrefix: process.env.API_PREFIX ?? '/api',
  dbUrl: process.env.MONGODB_URL ?? 'mongodb://localhost:27017/nestjs',
};
