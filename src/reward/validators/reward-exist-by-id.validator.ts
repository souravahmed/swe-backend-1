import { Injectable, UnprocessableEntityException } from '@nestjs/common';

import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { RewardService } from '../services';

@ValidatorConstraint({ name: 'rewardId', async: true })
@Injectable()
export class RewardExistByIdValidation implements ValidatorConstraintInterface {
  constructor(private readonly rewardService: RewardService) {}

  async validate(value: number): Promise<boolean> {
    const existReward = await this.rewardService.getRewardById(value);
    if (existReward) return true;
    throw new UnprocessableEntityException(
      'Reward does not exist by id: ' + value,
    );
  }
}
