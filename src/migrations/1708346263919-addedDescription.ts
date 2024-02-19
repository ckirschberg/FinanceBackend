import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedDescription1708346263919 implements MigrationInterface {
    name = 'AddedDescription1708346263919'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "entry" ADD "description" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "entry" DROP COLUMN "description"`);
    }

}
