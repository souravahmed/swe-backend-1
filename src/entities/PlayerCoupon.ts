import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Player } from './Player';
import { Coupon } from './Coupon';

@Entity()
export class PlayerCoupon {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Player)
  player: Player;

  @ManyToOne(() => Coupon)
  @JoinColumn()
  coupon: Coupon;

  @CreateDateColumn()
  redeemedAt: Date;
}
