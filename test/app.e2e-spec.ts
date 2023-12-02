import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { useContainer } from 'class-validator';

describe('CouponController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    await app.init();
  });

  describe('should return Unprocessable Entity 422 if player or reward does not exist', () => {
    it('Status should be 422', () => {
      return request(app.getHttpServer())
        .post('/coupons/coupon-redeem')
        .send({ rewardId: 0, playerId: 0 })
        .expect(422);
    });
  });

  describe('should create a coupon', () => {
    it('Should return {id:value}', () => {
      return request(app.getHttpServer())
        .post('/coupons/coupon-redeem')
        .send({ rewardId: 1, playerId: 1 })
        .expect(201)
        .expect(({ body }) => {
          expect(body.id).toBeDefined();
          expect(body.value).toBeDefined();
        });
    });
  });

  describe('should return 400 coupon already used once', () => {
    it('Should return 400', () => {
      return request(app.getHttpServer())
        .post('/coupons/coupon-redeem')
        .send({ rewardId: 1, playerId: 1 })
        .expect(400);
    });
  });

  describe('should return 400 if daily coupon limit exceeded', () => {
    it('Should return 400', () => {
      for (let i = 1; i <= 2; i++) {
        request(app.getHttpServer())
          .post('/coupons/coupon-redeem')
          .send({ rewardId: 1, playerId: 1 });
      }
      return request(app.getHttpServer())
        .post('/coupons/coupon-redeem')
        .send({ rewardId: 1, playerId: 1 })
        .expect(400);
    });
  });
});
