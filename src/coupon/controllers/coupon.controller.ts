import { Body, Controller, Post } from '@nestjs/common';
import { CouponService } from '../services';
import { CouponRedeemDto } from '../dtos';

@Controller('coupons')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Post('coupon-redeem')
  couponRedeem(@Body() couponRedeemDto: CouponRedeemDto) {
    return couponRedeemDto;
  }
}
