import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEmailFieldToUserTable1724074396640 implements MigrationInterface {
    name = 'AddEmailFieldToUserTable1724074396640'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`email\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`email\``);
    }

}
