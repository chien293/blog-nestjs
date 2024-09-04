import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAvatarToUserTable1724502699046 implements MigrationInterface {
    name = 'AddAvatarToUserTable1724502699046'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`avatar\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`avatar\``);
    }

}
