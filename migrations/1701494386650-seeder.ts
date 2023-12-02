import { Reward, Player } from '../src/entities';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class Seeder1701494386650 implements MigrationInterface {
  name = ' seeder-1701494386650';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // seeding reward
    await queryRunner.manager.save(
      queryRunner.manager.create<Reward>(Reward, {
        name: 'Airline ticket',
        startDate: new Date('2022-11-01'),
        endDate: new Date('2022-11-07'),
        perDayLimit: 3,
        totalLimit: 21,
      }),
    );
    await queryRunner.manager.save(
      queryRunner.manager.create<Reward>(Reward, {
        name: 'Nick Shoes',
        startDate: new Date('2022-10-01'),
        endDate: new Date('2022-10-07'),
        perDayLimit: 3,
        totalLimit: 21,
      }),
    );
    await queryRunner.manager.save(
      queryRunner.manager.create<Reward>(Reward, {
        name: 'Apple watch',
        startDate: new Date('2022-11-01'),
        endDate: new Date('2022-11-07'),
        perDayLimit: 3,
        totalLimit: 21,
      }),
    );

    // seeding players

    await queryRunner.manager.save(
      queryRunner.manager.create<Player>(Player, {
        name: 'Sourav Ahmed',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE * FROM player`);
    await queryRunner.query(`DELETE * FROM reward`);
  }
}
