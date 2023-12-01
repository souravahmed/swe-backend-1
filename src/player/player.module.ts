import { Module } from '@nestjs/common';
import { PlayerService } from './services/player.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Player } from '../entities';
import { PlayerExistByIdValidation } from './validators';

@Module({
  imports: [TypeOrmModule.forFeature([Player])],
  providers: [PlayerExistByIdValidation, PlayerService],
  exports: [PlayerService],
})
export class PlayerModule {}
