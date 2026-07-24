import { DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { TimezoneSubscriber } from './subcribers/time.subcriber';

console.log(__dirname + '/src/entities/User.entity.ts');
dotenv.config();
const isCompiled = __filename.endsWith('.js');
export const dataSourceOptions: DataSourceOptions = {
  host: String(process.env.DB_HOST),
  port: Number(process.env.DB_PORT) || 3306,
  username: String(process.env.DB_USERNAME),
  password: String(process.env.MYSQL_ROOT_PASSWORD),
  database: String(process.env.MYSQL_DATABASE),
  type: 'mysql',
  entities: [
    isCompiled
      ? process.cwd() + '/dist/entities/**/*.entity.{ts,js}'
      : process.cwd() + '/src/entities/**/*.entity.{ts,js}',
  ],
  synchronize: false,
  logging: false,
  migrations: [
    isCompiled
      ? process.cwd() + '/dist/config/migrations/*.{ts,js}'
      : process.cwd() + '/src/config/migrations/*.{ts,js}',
  ],
  subscribers: [],
  timezone: '+05:30',
  extra: {
    timezone: '+05:30', // ✅ sets MySQL session timezone on each connection
  },
};

export const useDataSourceFactory = (
  config: ConfigService,
): DataSourceOptions => {
  return {
    type: 'mysql',
    host: String(config.get('DB_HOST')),
    port: Number(config.get('DB_PORT')),
    username: String(config.get('DB_USERNAME')),
    password: String(config.get('MYSQL_ROOT_PASSWORD')),
    database: String(config.get('MYSQL_DATABASE')),
    entities: [
      isCompiled
        ? process.cwd() + '/dist/entities/**/*.entity.{ts,js}'
        : process.cwd() + '/src/entities/**/*.entity.{ts,js}',
    ],
    synchronize: false,
    logging: false,
    migrations: [
      isCompiled
        ? process.cwd() + '/dist/config/migrations/*.{ts,js}'
        : process.cwd() + '/src/config/migrations/*.{ts,js}',
    ],
    subscribers: [],
    timezone: '+05:30',
    extra: {
      timezone: '+05:30', // ✅ sets MySQL session timezone on each connection
    },
  };
};

export default new DataSource(dataSourceOptions);
