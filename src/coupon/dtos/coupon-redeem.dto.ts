import { IsNotEmpty, IsNumber, Validate } from 'class-validator';
import { PlayerExistByIdValidation } from '../../player/validators';
import { RewardExistByIdValidation } from '../../reward/validators';

export class CouponRedeemDto {
  @IsNotEmpty()
  @IsNumber()
  @Validate(PlayerExistByIdValidation)
  playerId: number;

  @IsNotEmpty()
  @IsNumber()
  @Validate(RewardExistByIdValidation)
  rewardId: number;
}
