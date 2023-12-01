import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reward } from 'src/entities';
import { Repository } from 'typeorm';

@Injectable()
export class RewardService {
  constructor(
    @InjectRepository(Reward)
    private readonly rewardRepository: Repository<Reward>,
  ) {}

  async getRewardById(rewardId: number) {
    return await this.rewardRepository.findOne({ where: { id: rewardId } });
  }

  async isRewardValidWithInStartDateAndEndDate(rewardId: number) {
    const existReward = await this.getRewardById(rewardId);
    let todayDate = new Date();
    return (
      todayDate >= existReward.startDate && todayDate <= existReward.endDate
    );
  }
}
