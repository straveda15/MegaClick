import type { InvoiceParticularItem } from '@/lib/invoicePdf';

/**
 * The shape both boards share — a lead's service and the Clients rollup carry
 * the same quotation fields, so one builder serves every invoice.
 */
export interface QuotableService {
  title: string;
  quotation?: number | null;
  quotationItems?: Array<{ name: string; amount: number }>;
}

/**
 * The Particulars of an invoice are the fields agreed with the client when the
 * lead was confirmed — nothing is invented here. A service confirmed before
 * line items existed (or confirmed as a single figure) still has to invoice for
 * something, so it falls back to one line carrying the service's own name.
 */
export function buildParticulars(service: QuotableService): InvoiceParticularItem[] {
  const items = service.quotationItems ?? [];
  if (items.length > 0) {
    return items.map((item) => ({ name: item.name, amount: Number(item.amount) || 0 }));
  }
  return [{ name: service.title, amount: Number(service.quotation) || 0 }];
}

/** Every service's particulars, for an invoice covering the whole engagement. */
export function buildParticularsForAll(services: QuotableService[]): InvoiceParticularItem[] {
  return services.flatMap(buildParticulars);
}
