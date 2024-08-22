import { MigrationInterface, QueryRunner } from "typeorm";

export class SetDefaultValueRefreshTokenInUserTable1724161214082 implements MigrationInterface {
    name = 'SetDefaultValueRefreshTokenInUserTable1724161214082'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`refresh_token\` \`refresh_token\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`refresh_token\` \`refresh_token\` varchar(255) NOT NULL`);
    }

}
