import { IsNotEmpty, IsNumber } from 'class-validator';

export class CouponRedeemDto {
  @IsNotEmpty()
  @IsNumber()
  playerId: string;

  @IsNotEmpty()
  @IsNumber()
  rewardId: string;
}
