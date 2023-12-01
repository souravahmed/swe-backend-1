import { Module } from '@nestjs/common';
import { CouponService } from './services/coupon.service';
import { CouponController } from './controllers/coupon.controller';
import { RewardModule } from '../reward/reward.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coupon, PlayerCoupon } from '../entities';
import { PlayerModule } from '../player/player.module';

@Module({
  imports: [
    RewardModule,
    PlayerModule,
    TypeOrmModule.forFeature([Coupon, PlayerCoupon]),
  ],
  providers: [CouponService],
  controllers: [CouponController],
})
export class CouponModule {}
