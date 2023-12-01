import { Injectable, UnprocessableEntityException } from '@nestjs/common';

import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { PlayerService } from '../services';

@ValidatorConstraint({ name: 'playerId', async: true })
@Injectable()
export class PlayerExistByIdValidation implements ValidatorConstraintInterface {
  constructor(private readonly playerService: PlayerService) {}

  async validate(value: number): Promise<boolean> {
    const existPlayer = await this.playerService.getPlayerById(value);
    if (existPlayer) return true;
    throw new UnprocessableEntityException(
      'Player does not exist by id: ' + value,
    );
  }
}
