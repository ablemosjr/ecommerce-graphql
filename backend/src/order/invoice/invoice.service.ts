import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { promises as fsPromises } from 'fs';
import * as fs from 'fs';
import * as PDFDocument from 'pdfkit';

import { Order } from '../entities/order.entity';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  async generateInvoice(orderId: number): Promise<string> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['user', 'items', 'items.product'],
    });

    if (!order) throw new NotFoundException('Order not found');

    const invoiceData = {
      orderId: orderId,
      customer: {
        name: order.user.name,
        email: order.user.email,
      },
      items: order.items.map((item) => ({
        name: item.product.name,
        description: item.product.description,
        quantity: item.quantity,
        price: item.price,
      })),
      total: order.total,
      date: order.createAt,
      paid: 0,
    };

    const invoicePath = `invoices/invoice_${order.id}.pdf`;

    this.createInvoice(invoiceData, invoicePath);

    return invoicePath;
  }

  private async createInvoice(invoiceData: any, invoicePath: string) {
    await fsPromises.mkdir('invoices', { recursive: true });
    const doc = new PDFDocument({ size: 'A4', margin: 50 });

    generateHeader(doc);
    generateCustomerInformation(doc, invoiceData);
    generateInvoiceTable(doc, invoiceData);
    generateFooter(doc);

    doc.end();
    doc.pipe(fs.createWriteStream(invoicePath));

    return invoicePath;
  }
}

function generateHeader(doc) {
  doc
    .fillColor('#444444')
    .fontSize(20)
    .text('Test e-commerce', 50, 57)
    .fontSize(10)
    .text('Rua XYZ, número 00', 200, 65, { align: 'right' })
    .text('Sorocaba, SP, 18000-000', 200, 80, { align: 'right' })
    .moveDown();
}

function generateCustomerInformation(doc, invoice) {
  doc.fillColor('#444444').fontSize(16).text('Invoice', 50, 160);

  generateHr(doc, 185);

  const customerInformationTop = 200;

  doc
    .fontSize(10)
    .text('Invoice Number:', 50, customerInformationTop)
    .font('Helvetica-Bold')
    .text(invoice.orderId, 150, customerInformationTop)
    .font('Helvetica')
    .text('Order Date:', 50, customerInformationTop + 15)
    .text(formatDate(invoice.date), 150, customerInformationTop + 15)
    .text('Balance Due:', 50, customerInformationTop + 30)
    .text(formatCurrency(invoice.total), 150, customerInformationTop + 30)

    .font('Helvetica-Bold')
    .text(invoice.customer.name, 300, customerInformationTop)
    .font('Helvetica')
    .text(invoice.customer.email, 300, customerInformationTop + 15)
    .moveDown();

  generateHr(doc, 252);
}

function generateInvoiceTable(doc, invoice) {
  let i;
  const invoiceTableTop = 330;

  doc.font('Helvetica-Bold');
  generateTableRow(
    doc,
    invoiceTableTop,
    'Item',
    'Description',
    'Unit Cost',
    'Quantity',
    'Line Total',
  );
  generateHr(doc, invoiceTableTop + 20);
  doc.font('Helvetica');

  for (i = 0; i < invoice.items.length; i++) {
    const item = invoice.items[i];
    const position = invoiceTableTop + (i + 1) * 30;

    generateTableRow(
      doc,
      position,
      item.name,
      formatDescription(item.description),
      formatCurrency(item.price / item.quantity),
      item.quantity,
      formatCurrency(item.price),
    );

    generateHr(doc, position + 20);
  }

  const subtotalPosition = invoiceTableTop + (i + 1) * 30;
  generateTableRow(
    doc,
    subtotalPosition,
    '',
    '',
    'Subtotal',
    '',
    formatCurrency(invoice.total),
  );

  const paidToDatePosition = subtotalPosition + 20;
  generateTableRow(
    doc,
    paidToDatePosition,
    '',
    '',
    'Paid To Date',
    '',
    formatCurrency(invoice.paid),
  );

  const duePosition = paidToDatePosition + 25;
  doc.font('Helvetica-Bold');
  generateTableRow(
    doc,
    duePosition,
    '',
    '',
    'Balance Due',
    '',
    formatCurrency(invoice.total - invoice.paid),
  );
  doc.font('Helvetica');
}

function generateFooter(doc) {
  doc
    .fontSize(10)
    .text(
      'Payment is due within 15 days. Thank you for your business.',
      50,
      780,
      { align: 'center', width: 500 },
    );
}

function generateTableRow(
  doc,
  y,
  item,
  description,
  unitCost,
  quantity,
  lineTotal,
) {
  doc
    .fontSize(10)
    .text(item, 50, y)
    .text(description, 150, y)
    .text(unitCost, 280, y, { width: 90, align: 'right' })
    .text(quantity, 370, y, { width: 90, align: 'right' })
    .text(lineTotal, 0, y, { align: 'right' });
}

function generateHr(doc, y) {
  doc.strokeColor('#aaaaaa').lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
}

function formatCurrency(amount) {
  return 'R$ ' + amount;
}

function formatDescription(text) {
  return text.length > 30 ? text.substring(0, 30) + '...' : text;
}

function formatDate(date) {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return year + '/' + month + '/' + day;
}
