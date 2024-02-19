import { MigrationInterface, QueryRunner } from "typeorm";

export class Test1708351000045 implements MigrationInterface {
    name = 'Test1708351000045'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "entry" ADD "test" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "entry" DROP COLUMN "test"`);
    }

}
