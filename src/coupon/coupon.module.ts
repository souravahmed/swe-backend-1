import { Module } from '@nestjs/common';
import { CouponService } from './services/coupon.service';
import { CouponController } from './controllers/coupon.controller';
import { RewardModule } from 'src/reward/reward.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coupon, PlayerCoupon } from 'src/entities';

@Module({
  imports: [RewardModule, TypeOrmModule.forFeature([Coupon, PlayerCoupon])],
  providers: [CouponService],
  controllers: [CouponController],
})
export class CouponModule {}
