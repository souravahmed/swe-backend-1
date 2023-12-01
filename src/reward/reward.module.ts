import { Module } from '@nestjs/common';
import { RewardService } from './services/reward.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reward } from 'src/entities';
import { RewardExistByIdValidation } from './validators';

@Module({
  imports: [TypeOrmModule.forFeature([Reward])],
  providers: [RewardExistByIdValidation, RewardService],
})
export class RewardModule {}
