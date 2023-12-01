import { Module } from '@nestjs/common';
import { RewardService } from './services/reward.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reward } from 'src/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Reward])],
  providers: [RewardService],
})
export class RewardModule {}
