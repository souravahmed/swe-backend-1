import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Reward } from './Reward';
@Entity()
export class Coupon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  value: string;

  @ManyToOne(() => Reward)
  @JoinColumn()
  Reward: Reward;
}
