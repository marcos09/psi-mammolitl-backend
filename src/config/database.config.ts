import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
import { environmentConfig } from './environment.config';

export const getDatabaseConfig = (): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: environmentConfig.database.host,
  port: environmentConfig.database.port,
  username: environmentConfig.database.username,
  password: environmentConfig.database.password,
  database: environmentConfig.database.database,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  synchronize: environmentConfig.database.synchronize,
  logging: environmentConfig.database.logging,
  ssl: environmentConfig.database.ssl ? { rejectUnauthorized: false } : false,
});

export const getDataSourceConfig = (): DataSourceOptions => ({
  type: 'postgres',
  host: environmentConfig.database.host,
  port: environmentConfig.database.port,
  username: environmentConfig.database.username,
  password: environmentConfig.database.password,
  database: environmentConfig.database.database,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  synchronize: false,
  logging: environmentConfig.database.logging,
  ssl: environmentConfig.database.ssl ? { rejectUnauthorized: false } : false,
});
