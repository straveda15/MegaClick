import type { Client, ClientService } from '@/hooks/useClients';
import { formatInvoiceDate, invoiceNumber, type InvoiceData } from '@/lib/invoicePdf';
import { buildParticularsForAll } from '@/lib/invoiceParticulars';

/**
 * The starting point for a client's invoice — what the Clients board shows in
 * the preview before anyone edits it. `services` picks what is billed: one
 * service from its row, or every service from the client's details.
 */
export function buildClientInvoice(client: Client, services: ClientService[]): InvoiceData {
  const now = new Date();
  const address = [client.address, client.city].filter(Boolean).join(', ');
  const state = client.state || 'Maharashtra';
  const name = client.company || client.name;

  return {
    // Financial-year form, e.g. "26-27/025" — see lib/invoicePdf.
    invoiceNumber: invoiceNumber(client.clientId, now),
    invoiceDate: formatInvoiceDate(now),
    consigneeName: name,
    consigneeAddress: address,
    consigneeState: state,
    consigneeCode: '27',
    buyerName: name,
    buyerAddress: address,
    buyerState: state,
    buyerCode: '27',
    // The Particulars are the fields agreed when the lead was confirmed.
    particulars: buildParticularsForAll(services),
    remarks: '',
  };
}
