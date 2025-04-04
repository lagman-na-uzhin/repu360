import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

require('dotenv').config();

console.log(`Migrations started to work ${process.env.DATABASE_USER}`);

export const appDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: ['src/infrastructure/entities/**/*.entity{.ts,.js}'],
  synchronize: false,
  migrationsRun: false,
  migrations: ['src/infrastructure/migrations/**/*.ts'],
  namingStrategy: new SnakeNamingStrategy(),
});
