import { Args, Query, Resolver } from '@nestjs/graphql';

import { InvoiceService } from './invoice.service';

@Resolver('Invoice')
export class InvoiceResolver {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Query(() => String)
  async getInvoice(@Args('orderId') orderId: number) {
    return this.invoiceService.generateInvoice(orderId);
  }
}
