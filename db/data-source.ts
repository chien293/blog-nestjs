import { DATABASE_CONFIG } from "src/constant";
import { DataSource, DataSourceOptions } from "typeorm";

export const dataSourceOptions: DataSourceOptions = {
    type: 'mysql',
    host: DATABASE_CONFIG.HOST,
    port: parseInt(DATABASE_CONFIG.PORT, 10),
    username: DATABASE_CONFIG.USERNAME,
    password: DATABASE_CONFIG.PASSWORD,
    database: DATABASE_CONFIG.DATABASE,
    entities: ['dist/**/*.entity.js'],
    migrations: ['dist/db/migrations/*.js'],
    migrationsTableName: 'migrations_typeorm',
    synchronize: false
}

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;