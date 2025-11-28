import { Module } from '@nestjs/common';
import { EnergystatementsService } from './energystatements.service';
import { EnergystatementsController } from './energystatements.controller';

@Module({
  controllers: [EnergystatementsController],
  providers: [EnergystatementsService],
})
export class EnergystatementsModule {}
