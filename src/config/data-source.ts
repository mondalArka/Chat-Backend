import { DataSourceOptions } from "typeorm";
import { ConfigService } from "@nestjs/config";
import dotenv from "dotenv";
import { DataSource } from "typeorm";
import { User } from "src/entities/User.entity";
import { Sessions } from "src/entities/Otp.entity";

console.log(__dirname + "/src/entities/User.entity.ts")
dotenv.config();
const isCompiled = __filename.endsWith(".js");
export const dataSourceOptions: DataSourceOptions = {
    host: String(process.env.DB_HOST),
    port: Number(process.env.DB_PORT) || 3306,
    username: String(process.env.DB_USERNAME),
    password: String(process.env.DB_PASSWORD),
    database: String(process.env.DB_NAME),
    type: "mysql",
    entities: [isCompiled ? process.cwd() + "/dist/entities/**/*.entity.{ts,js}" : process.cwd() + "/src/entities/**/*.entity.{ts,js}"],
    synchronize: false,
    logging: false,
    migrations: [isCompiled ? process.cwd() + "/dist/config/migrations/*.{ts,js}" : process.cwd() + "/src/config/migrations/*.{ts,js}"],
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
        entities: [isCompiled ? process.cwd() + "/dist/entities/**/*.entity.{ts,js}" : process.cwd() + "/src/entities/**/*.entity.{ts,js}"],
        synchronize: false,
        logging: false,
        migrations: [isCompiled ? process.cwd() + "/dist/config/migrations/*.{ts,js}" : process.cwd() + "/src/config/migrations/*.{ts,js}"],
        subscribers: [],
    }
}

export default new DataSource(dataSourceOptions);
