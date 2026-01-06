import * as dotenv from 'dotenv';
dotenv.config();

type configType = {
  port: number | string;
  nodeEnv: string;
  apiPrefix: string;
  dbUrl: string;
  jwtSecret: string;
  jwtExpire: number;
};

export const config: configType = {
  port: process.env.PORT ?? 8080,
  nodeEnv: process.env.NODE_ENV ?? 'production',
  apiPrefix: process.env.API_PREFIX ?? '/api',
  dbUrl: process.env.MONGODB_URL ?? 'mongodb://localhost:27017/nestjs',
  jwtSecret: process.env.JWT_SECRET ?? 'secret',
  jwtExpire: process.env.JWT_EXPIRE
    ? parseInt(process.env.JWT_EXPIRE, 10)
    : 86400,
};
