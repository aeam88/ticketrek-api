import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';

@ApiTags('Payments')

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('webhook')
  @ApiOperation({ summary: 'Webhook endpoint for payment events' })
  @ApiResponse({ status: 200, description: 'Webhook successfully processed.' })
  async webhook(@Body() payload: any) {
    return this.paymentsService.handleWebhook(payload);
  }
}
