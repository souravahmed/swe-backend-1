import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Coupon, PlayerCoupon } from 'src/entities';
import { Between, In, Repository } from 'typeorm';
import { CouponRedeemDto } from '../dtos';
import { RewardService } from 'src/reward/services';

@Injectable()
export class CouponService {
  constructor(
    @InjectRepository(Coupon)
    private couponRepository: Repository<Coupon>,
    @InjectRepository(PlayerCoupon)
    private playerCouponRepository: Repository<PlayerCoupon>,
    private rewardService: RewardService,
  ) {}

  async couponRedeem(couponRedeemDto: CouponRedeemDto) {
    const isValidReward =
      await this.rewardService.isRewardValidWithInStartDateAndEndDate(
        couponRedeemDto.rewardId,
      );
    if (!isValidReward)
      throw new BadRequestException(
        'Sorry reward expired. Better Luck next time',
      );

    const numberOfRedeemedCouponsToday =
      await this.getNumberOfCouponRedeemedToday(couponRedeemDto.playerId);
    const reward = await this.rewardService.getRewardById(
      couponRedeemDto.rewardId,
    );
    if (numberOfRedeemedCouponsToday === reward.perDayLimit)
      throw new BadRequestException(
        'Sorry per day coupon redeem limit exceeded',
      );

    const numberOfRedeemedCouponsDuringCampaign =
      await this.getNumberOfCouponRedeemedDuringCampaign(
        couponRedeemDto.playerId,
        couponRedeemDto.rewardId,
      );

    if (numberOfRedeemedCouponsDuringCampaign === reward.totalLimit)
      throw new BadRequestException('Sorry total coupon redeem limit exceeded');
  }

  async getNumberOfCouponRedeemedToday(playerId: number) {
    let startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    let endDate = new Date();
    endDate.setHours(23, 59, 59, 999);
    return await this.playerCouponRepository.count({
      where: { id: playerId, redeemedAt: Between(startDate, endDate) },
    });
  }

  async getNumberOfCouponRedeemedDuringCampaign(
    playerId: number,
    rewardId: number,
  ) {
    const coupons = await this.couponRepository.find({
      where: { Reward: { id: rewardId } },
    });
    const couponIds = coupons.map((coupon) => coupon.id);
    const reward = await this.rewardService.getRewardById(rewardId);
    return await this.playerCouponRepository.count({
      where: {
        id: playerId,
        coupon: { id: In(couponIds) },
        redeemedAt: Between(reward.startDate, reward.endDate),
      },
    });
  }
}
