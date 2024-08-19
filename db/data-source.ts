import { DataSource, DataSourceOptions } from "typeorm";

export const dataSourceOptions: DataSourceOptions = {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'chien401',
    database: 'blog-nestjs',
    entities: ['dist/**/*.entity.js'],
    migrations: ['dist/db/migrations/*.js'],
    migrationsTableName: 'migrations_typeorm',
    synchronize: false
}

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;