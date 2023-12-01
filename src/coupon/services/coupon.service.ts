import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Coupon, PlayerCoupon } from '../../entities';
import { Between, DataSource, In, Repository } from 'typeorm';
import { CouponRedeemDto } from '../dtos';
import { RewardService } from '../../reward/services';
import { StringUtil } from '../../common/utils';
import { PlayerService } from '../../player/services';

@Injectable()
export class CouponService {
  constructor(
    @InjectRepository(Coupon)
    private couponRepository: Repository<Coupon>,
    @InjectRepository(PlayerCoupon)
    private playerCouponRepository: Repository<PlayerCoupon>,
    private rewardService: RewardService,
    private playerService: PlayerService,
    private dataSource: DataSource,
  ) {}

  async couponRedeem(couponRedeemDto: CouponRedeemDto) {
    const isCouponAlreadyRedeemed = await this.isCouponAlreadyRedeemed(
      couponRedeemDto.playerId,
      couponRedeemDto.rewardId,
    );
    if (isCouponAlreadyRedeemed)
      throw new BadRequestException('Coupon already redeemed');

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
    const player = await this.playerService.getPlayerById(
      couponRedeemDto.playerId,
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

    const generatedCoupon = 'EID-' + StringUtil.getRandomNumber(6);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const newCoupon = await queryRunner.manager.save(Coupon, {
        value: generatedCoupon,
        Reward: reward,
      });
      await queryRunner.manager.save(PlayerCoupon, {
        player: player,
        coupon: newCoupon,
        redeemedAt: new Date(),
      });
      await queryRunner.commitTransaction();
      const { id, value } = newCoupon;
      return { id, value };
    } catch (e) {
      console.log(e);
      await queryRunner.rollbackTransaction();
      throw new Error('Something went wrong');
    } finally {
      await queryRunner.release();
    }
  }

  async getNumberOfCouponRedeemedToday(playerId: number) {
    let startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    let endDate = new Date();
    endDate.setHours(23, 59, 59, 999);
    return await this.playerCouponRepository.count({
      where: {
        player: { id: playerId },
        redeemedAt: Between(startDate, endDate),
      },
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
        player: { id: playerId },
        coupon: { id: In(couponIds) },
        redeemedAt: Between(reward.startDate, reward.endDate),
      },
    });
  }

  async isCouponAlreadyRedeemed(playerId: number, rewardId: number) {
    const existRedeemedCoupon = await this.playerCouponRepository.count({
      where: {
        player: { id: playerId },
        coupon: {
          Reward: { id: rewardId },
        },
      },
    });
    return existRedeemedCoupon ? true : false;
  }
}
