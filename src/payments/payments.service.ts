import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentStatus, TicketStatus } from '@prisma/client';

@Injectable()
export class PaymentsService implements OnModuleInit {
  private mpClient: MercadoPagoConfig;

  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
  ) {}

  onModuleInit() {
    const accessToken = this.config.get<string>('MP_ACCESS_TOKEN');
    if (!accessToken) {
      console.warn('MP_ACCESS_TOKEN not found in environment variables');
      return;
    }
    this.mpClient = new MercadoPagoConfig({
      accessToken: accessToken,
    });
  }

  async createPreference(ticketId: string, eventTitle: string, price: number, userEmail: string) {
    const preference = new Preference(this.mpClient);

    const response = await preference.create({
      body: {
        items: [
          {
            id: ticketId,
            title: `Ticket for ${eventTitle}`,
            quantity: 1,
            unit_price: price,
            currency_id: 'ARS',
          },
        ],
        payer: {
          email: userEmail,
        },
        back_urls: {
          success: `${this.config.get('FRONTEND_URL')}/payment/success`,
          failure: `${this.config.get('FRONTEND_URL')}/payment/failure`,
          pending: `${this.config.get('FRONTEND_URL')}/payment/pending`,
        },
        auto_return: 'approved',
        notification_url: `${this.config.get('BACKEND_URL')}/payments/webhook`,
        external_reference: ticketId,
      },
    });

    await this.prisma.payment.create({
      data: {
        ticketId: ticketId,
        amount: price,
        status: PaymentStatus.PENDING,
      },
    });

    return {
      id: response.id,
      init_point: response.init_point,
      sandbox_init_point: response.sandbox_init_point,
    };
  }

  async handleWebhook(payload: any) {
    if (payload.type === 'payment') {
      const paymentId = payload.data.id;
    }
    return { received: true };
  }
}
