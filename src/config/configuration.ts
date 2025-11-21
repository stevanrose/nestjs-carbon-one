import { appendFile } from 'fs';

export default () => ({
  app: {
    port: parseInt(process.env.APP_PORT || '3000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
  },
  database: {
    url:
      process.env.DATABASE_URL ??
      'postgres://postgres:postgres@localhost:5432/nestjs_carbon_one',
  },
});
