import { Module } from '@nestjs/common';
import { RewardService } from './services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reward } from '../entities';
import { RewardExistByIdValidation } from './validators';

@Module({
  imports: [TypeOrmModule.forFeature([Reward])],
  providers: [RewardExistByIdValidation, RewardService],
  exports: [RewardService],
})
export class RewardModule {}
