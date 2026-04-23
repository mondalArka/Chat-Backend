import { DataSourceOptions } from "typeorm";
import { ConfigService } from "@nestjs/config";
import dotenv from "dotenv";
import { DataSource } from "typeorm";
import { User } from "src/entities/User.entity";
import { Sessions } from "src/entities/Otp.entity";

dotenv.config();
export const dataSourceOptions: DataSourceOptions = {
    host: String(process.env.DB_HOST),
    port: Number(process.env.DB_PORT) || 3306,
    username: String(process.env.DB_USERNAME),
    password: String(process.env.DB_PASSWORD),
    database: String(process.env.DB_NAME),
    type: "mysql",
    entities: [__dirname + "/src/entities/**/*.entity.{ts,js}"],
    synchronize: false,
    logging: false,
    migrations: [__dirname + "/src/config/migrations/*.{ts,js}"],
    subscribers: [],
}

export const useDataSourceFactory = (config: ConfigService): DataSourceOptions => {
    return {
        type: "mysql",
        host: String(config.get('DB_HOST')),
        port: Number(config.get('DB_PORT')),
        username: String(config.get('DB_USERNAME')),
        password: String(config.get('DB_PASSWORD')),
        database: String(config.get('DB_NAME')),
        entities: [User, Sessions],
        synchronize: false,
        logging: false,
        migrations: [__dirname + "/src/config/migrations/*.{ts,js}"],
        subscribers: [],
    }
}

export default new DataSource(dataSourceOptions);
