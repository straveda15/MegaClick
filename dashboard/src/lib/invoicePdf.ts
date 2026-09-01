/**
 * generateInvoicePdf
 *
 * Generates a PDF invoice pixel-matched to the MegaClick Enterprises format.
 * Dynamic fields: invoiceNumber, invoiceDate, consignee, buyer, particulars.
 * Everything else is fixed (company, bank details, footer).
 */

export interface InvoiceParticularItem {
  name: string;
  amount: number;
}

export interface InvoiceData {
  /** Financial-year form, e.g. "26-27/025". Build it with `invoiceNumber()`. */
  invoiceNumber: string;
  invoiceDate: string;       // e.g. "22-Jul-26"
  consigneeName: string;
  consigneeAddress: string;  // multi-line, separate lines with \n
  consigneeState: string;
  consigneeCode: string;
  buyerName: string;
  buyerAddress: string;
  buyerState: string;
  buyerCode: string;
  particulars: InvoiceParticularItem[];
}

// ─── Number helpers ──────────────────────────────────────────────────────────

function fmt(n: number): string {
  return n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function numberToWords(n: number): string {
  const ones = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen',
  ];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function chunk(num: number): string {
    if (num === 0) return '';
    if (num < 20) return ones[num] + ' ';
    if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? ' ' + ones[num % 10] : '') + ' ';
    return ones[Math.floor(num / 100)] + ' Hundred ' + chunk(num % 100);
  }

  function inWords(num: number): string {
    if (num === 0) return 'Zero';
    if (num < 1000) return chunk(num).trim();
    if (num < 100000) return inWords(Math.floor(num / 1000)) + ' Thousand ' + chunk(num % 1000).trim();
    if (num < 10000000) return inWords(Math.floor(num / 100000)) + ' Lakh ' + inWords(num % 100000);
    return inWords(Math.floor(num / 10000000)) + ' Crore ' + inWords(num % 10000000);
  }

  const [rupStr, paStr] = n.toFixed(2).split('.');
  const rup = parseInt(rupStr, 10);
  const pai = parseInt(paStr, 10);
  let res = 'INR ' + inWords(rup);
  if (pai > 0) res += ' and ' + inWords(pai) + ' Paise';
  return res + ' Only';
}

// ─── HTML builder ────────────────────────────────────────────────────────────

function addrLines(addr: string): string {
  return addr.split('\n').join('<br>');
}

function esc(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildHtml(d: InvoiceData): string {
  const total = d.particulars.reduce((s, p) => s + p.amount, 0);
  const words = numberToWords(total);

  const itemRows = d.particulars.map(p => `
    <tr class="item-row">
      <td class="part-cell">${esc(p.name)}</td>
      <td class="amt-cell">${fmt(p.amount)}</td>
    </tr>
  `).join('');

  /*
   * The reference invoice has a deliberately large empty body area before
   * the Total row. Keep that visual weight while still allowing the number
   * of line items to vary. Use 66mm to comfortably fit within A4 limits.
   */
  const spacerHeight = Math.max(4, 52 - d.particulars.length * 5.2);

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<style>
  @page {
    size: A4 portrait;
    margin: 0;
  }

  * {
    box-sizing: border-box;
  }

  html, body {
    margin: 0;
    padding: 0;
    background: #fff;
  }

  body {
    font-family: Arial, Helvetica, sans-serif;
    color: #000;
    font-size: 8.5pt;
  }

  .page {
    width: 210mm;
    /*
     * A hair under A4. html2canvas rounds mm to device pixels, and an element
     * measuring even a fraction over the page height renders a second, blank
     * sheet — the slack costs nothing visually and removes that whole class of
     * bug. The generator also drops any surplus page as a backstop.
     */
    height: 295mm;
    max-height: 295mm;
    overflow: hidden;
    padding: 3mm 10mm;
    background: #fff;
  }

  /*
   * The invoice itself is intentionally rigid and document-like.
   * No cards, shadows, rounded corners, or modern dashboard styling.
   */
  .invoice {
    width: 190mm;
    border: 0.55mm solid #000;
    background: #fff;
  }

  .invoice-title {
    height: 9mm;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 0.35mm solid #000;
    font-size: 12pt;
    font-weight: 700;
    letter-spacing: 1.2px;
  }

  table {
    border-collapse: collapse;
  }

  /* ───────────────── Top / metadata ───────────────── */

  .top-grid {
    display: grid;
    grid-template-columns: 60% 40%;
    height: 47mm;
    border-bottom: 0.35mm solid #000;
  }

  .company {
    padding: 3.2mm 2.6mm;
    border-right: 0.35mm solid #000;
  }

  .company-name {
    font-size: 8.8pt;
    font-weight: 700;
    margin-bottom: 1mm;
  }

  .company-address,
  .company-state,
  .company-email {
    font-size: 8pt;
    line-height: 1.42;
  }

  .meta-table {
    width: 100%;
    height: 100%;
    table-layout: fixed;
  }

  .meta-table td {
    width: 50%;
    padding: 1.45mm 1.6mm;
    font-size: 7.7pt;
    line-height: 1.1;
    vertical-align: top;
  }

  /*
   * A "row pair" is a label row followed by its value/blank row.
   * The reference invoice only draws a divider after the pair
   * (i.e. after the value row), not between the label and its
   * own value — so only even rows get a bottom border.
   */
  .meta-table tr:nth-child(even) td {
    border-bottom: 0.35mm solid #000;
  }

  .meta-table tr:last-child td {
    border-bottom: 0;
  }

  .meta-table td + td {
    border-left: 0.35mm solid #000;
  }

  .meta-value {
    font-size: 8.3pt !important;
    font-weight: 700;
  }

  /* ───────────────── Consignee / Buyer ───────────────── */

  .party-grid {
    display: grid;
    grid-template-columns: 60% 40%;
    border-bottom: 0.35mm solid #000;
  }

  .consignee-grid {
    height: 45mm;
  }

  .buyer-grid {
    height: 35mm;
  }

  .party-left {
    border-right: 0.35mm solid #000;
    padding: 3.1mm 2.6mm;
  }

  .party-right {
    min-width: 0;
  }

  .party-label {
    font-size: 7.7pt;
    font-weight: 400;
    margin-bottom: 4.5mm;
  }

  .party-name {
    font-size: 8.8pt;
    font-weight: 700;
    margin-bottom: 1.2mm;
  }

  .party-address,
  .party-state {
    font-size: 8pt;
    line-height: 1.42;
  }

  .buyer-grid .party-label {
    margin-bottom: 4.2mm;
  }

  /* ───────────────── Particulars ───────────────── */

  .particulars {
    width: 100%;
    table-layout: fixed;
    border-bottom: 0.35mm solid #000;
  }

  .particulars th {
    height: 7mm;
    padding: 1.2mm 1.7mm;
    border-bottom: 0.35mm solid #000;
    font-size: 8.1pt;
    font-weight: 700;
  }

  .particulars th:first-child {
    width: 75%;
    text-align: center;
    border-right: 0.35mm solid #000;
  }

  .particulars th:last-child {
    width: 25%;
    text-align: right;
  }

  .item-row td {
    height: 5.2mm;
  }

  .part-cell {
    padding: 0.7mm 1.7mm 0.7mm 9mm;
    border-right: 0.35mm solid #000;
    font-size: 8.4pt;
    font-weight: 700;
    vertical-align: top;
  }

  .amt-cell {
    padding: 0.7mm 1.7mm;
    font-size: 8.4pt;
    text-align: right;
    vertical-align: top;
    white-space: nowrap;
  }

  .spacer-row td {
    height: ${spacerHeight}mm;
    padding: 0;
  }

  .spacer-row td:first-child {
    border-right: 0.35mm solid #000;
  }

  .total-row td {
    height: 7.2mm;
    padding: 1.2mm 1.7mm;
    border-top: 0.35mm solid #000;
    font-size: 8.4pt;
  }

  .total-label {
    border-right: 0.35mm solid #000;
  }

  .total-amount {
    text-align: right;
    font-size: 10pt !important;
    font-weight: 700;
    white-space: nowrap;
  }

  /* ───────────────── Amount in words ───────────────── */

  .words-row {
    min-height: 13mm;
    display: grid;
    grid-template-columns: 1fr 20mm;
    padding: 1.8mm 1.7mm;
    border-bottom: 0.35mm solid #000;
  }

  .words-label {
    font-size: 7.3pt;
    margin-bottom: 1mm;
  }

  .words-value {
    font-size: 8.5pt;
    font-weight: 700;
  }

  .eoe {
    text-align: right;
    font-size: 7.3pt;
    align-self: end;
  }

  /* ───────────────── Remarks / Bank ───────────────── */

  .bottom-grid {
    display: grid;
    grid-template-columns: 50% 50%;
    height: 41mm;
    border-bottom: 0.35mm solid #000;
  }

  .remarks {
    padding: 2.8mm 2.6mm;
    border-right: 0.35mm solid #000;
  }

  .remarks-label {
    font-size: 8pt;
    font-style: italic;
  }

  .bank {
    position: relative;
    padding: 2.8mm 2.6mm;
    font-size: 7.9pt;
  }

  .bank-title {
    font-size: 8.5pt;
    font-weight: 700;
    margin-bottom: 2.2mm;
  }

  .bank-row {
    line-height: 1.55;
  }

  .bank-key {
    font-weight: 700;
  }

  .for-company {
    position: absolute;
    right: 2.6mm;
    bottom: 10mm;
    font-size: 8pt;
    font-weight: 700;
  }

  .authorised {
    position: absolute;
    right: 2.6mm;
    bottom: 2.2mm;
    font-size: 7.8pt;
  }

  /* ───────────────── Footer ───────────────── */

  .footer {
    height: 11mm;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.8mm;
    font-size: 7.8pt;
    line-height: 1.15;
  }
</style>
</head>

<body>
  <div class="page">
    <div class="invoice">

      <div class="invoice-title">INVOICE</div>

      <!-- Company + invoice metadata -->
      <div class="top-grid">
        <div class="company">
          <div class="company-name">MegaClick Enterprises (2026-27)</div>
          <div class="company-address">
            4th Floor, Tristar Complex, Above Canara Bank,<br>
            Beside Reliance Digital, Jehan Circle,<br>
            Gangapur Road, Nashik
          </div>
          <div class="company-state">State Name : Maharashtra, Code : 27</div>
          <div class="company-email">E-Mail : megaclickofficial@gmail.com</div>
        </div>

        <table class="meta-table">
          <tr>
            <td>Invoice No.</td>
            <td>Dated</td>
          </tr>
          <tr>
            <td class="meta-value">${esc(d.invoiceNumber)}</td>
            <td class="meta-value">${esc(d.invoiceDate)}</td>
          </tr>
          <tr>
            <td>Delivery Note</td>
            <td>Mode/Terms of Payment</td>
          </tr>
          <tr>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
          </tr>
          <tr>
            <td>Reference No. &amp; Date.</td>
            <td>Other References</td>
          </tr>
          <tr>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
          </tr>
        </table>
      </div>

      <!-- Consignee -->
      <div class="party-grid consignee-grid">
        <div class="party-left">
          <div class="party-label">Consignee (Ship to)</div>
          <div class="party-name">${esc(d.consigneeName.toUpperCase())}</div>
          <div class="party-address">${addrLines(esc(d.consigneeAddress))}</div>
          <div class="party-state">
            State Name&nbsp;&nbsp;&nbsp;: ${esc(d.consigneeState)}, Code : ${esc(d.consigneeCode)}
          </div>
        </div>

        <div class="party-right">
          <table class="meta-table">
            <tr>
              <td>Buyer's Order No.</td>
              <td>Dated</td>
            </tr>
            <tr>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td>Dispatch Doc No.</td>
              <td>Delivery Note Date</td>
            </tr>
            <tr>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td>Dispatched through</td>
              <td>Destination</td>
            </tr>
            <tr>
              <td colspan="2" style="border-bottom:0;">Terms of Delivery</td>
            </tr>
          </table>
        </div>
      </div>

      <!-- Buyer -->
      <div class="party-grid buyer-grid">
        <div class="party-left">
          <div class="party-label">Buyer (Bill to)</div>
          <div class="party-name">${esc(d.buyerName.toUpperCase())}</div>
          <div class="party-address">${addrLines(esc(d.buyerAddress))}</div>
          <div class="party-state">
            State Name&nbsp;&nbsp;&nbsp;: ${esc(d.buyerState)}, Code : ${esc(d.buyerCode)}
          </div>
        </div>

        <div class="party-right"></div>
      </div>

      <!-- Particulars -->
      <table class="particulars">
        <thead>
          <tr>
            <th>Particulars</th>
            <th>Amount</th>
          </tr>
        </thead>

        <tbody>
          ${itemRows}

          <tr class="spacer-row">
            <td></td>
            <td></td>
          </tr>

          <tr class="total-row">
            <td class="total-label">Total</td>
            <td class="total-amount">&#x20B9; ${fmt(total)}</td>
          </tr>
        </tbody>
      </table>

      <!-- Amount in words -->
      <div class="words-row">
        <div>
          <div class="words-label">Amount Chargeable (in words)</div>
          <div class="words-value">${words}</div>
        </div>
        <div class="eoe">E. &amp; O.E</div>
      </div>

      <!-- Remarks + bank -->
      <div class="bottom-grid">
        <div class="remarks">
          <div class="remarks-label">Remarks:</div>
        </div>

        <div class="bank">
          <div class="bank-title">Company's Bank Details</div>

          <div class="bank-row">
            <span class="bank-key">Bank Name</span>&nbsp; : Union Bank of India (0124) (CC)
          </div>

          <div class="bank-row">
            <span class="bank-key">A/c No.</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 323805090000124
          </div>

          <div class="bank-row">
            <span class="bank-key">Branch &amp; IFS Code:</span> Nasik City &amp; UBIN0532380
          </div>

          <div class="for-company">for MegaClick Enterprises (2026-27)</div>
          <div class="authorised">Authorised Signatory</div>
        </div>
      </div>

      <div class="footer">
        <div>SUBJECT TO NASHIK JURISDICTION</div>
        <div>This is a Computer Generated Invoice</div>
      </div>

    </div>
  </div>
</body>
</html>`;
}

// ─── Numbering ───────────────────────────────────────────────────────────────

/**
 * The invoice reference, in the form the office already uses: "26-27/025" —
 * the Indian financial year (April to March) followed by a zero-padded serial.
 *
 * `serial` is whatever makes the number unique for the record being billed; the
 * digits of a client reference work as well as a running counter, since the
 * pair (year, serial) is what has to be distinct.
 */
export function invoiceNumber(serial: string | number, date = new Date()): string {
  // April starts a new financial year, so Jan–Mar still belongs to the previous.
  const startYear = date.getMonth() >= 3 ? date.getFullYear() : date.getFullYear() - 1;
  const fy = `${String(startYear).slice(2)}-${String(startYear + 1).slice(2)}`;

  const digits = String(serial).replace(/\D/g, '');
  // Falls back to the raw text when a reference carries no digits at all.
  const padded = digits ? digits.slice(-3).padStart(3, '0') : String(serial).slice(-3).toUpperCase();

  return `${fy}/${padded}`;
}

/** "Invoice 26-27-025 Sneha Verma.pdf" — the number, then who it is for. */
function invoiceFileName(data: InvoiceData): string {
  const ref = data.invoiceNumber.replace(/\//g, '-');
  const who = (data.buyerName || data.consigneeName || 'Customer')
    .replace(/[\\/:*?"<>|]/g, '')
    .trim();

  return `Invoice ${ref} ${who}.pdf`;
}

/**
 * The slice of html2pdf's chained worker this module drives. Its own types stop
 * at `save()`, but the chain has to be opened up to reach the jsPDF instance and
 * drop any page past the first.
 */
interface Html2PdfWorker {
  set(options: unknown): Html2PdfWorker;
  from(element: HTMLElement): Html2PdfWorker;
  toPdf(): Html2PdfWorker;
  get(key: 'pdf'): Html2PdfWorker;
  then(onFulfilled: (pdf: JsPdfHandle) => void): Html2PdfWorker;
  save(): Promise<void>;
}

interface JsPdfHandle {
  internal: { getNumberOfPages: () => number };
  deletePage: (pageNumber: number) => void;
}

// ─── Public API ──────────────────────────────────────────────────────────────

export async function generateInvoicePdf(data: InvoiceData): Promise<void> {
  const html2pdf = (await import('html2pdf.js')).default;

  const html = buildHtml(data);
  const el = document.createElement('div');
  el.innerHTML = html;
  el.style.cssText = 'position:absolute;left:-9999px;top:0;';
  document.body.appendChild(el);

  const opt = {
    margin: 0,
    filename: invoiceFileName(data),
    image: {
      type: 'jpeg' as const,
      quality: 0.98,
    },
    html2canvas: {
      scale: 2,
      useCORS: true,
      logging: false,
    },
    jsPDF: {
      unit: 'mm' as const,
      format: 'a4' as const,
      orientation: 'portrait' as const,
    },
    // Never break mid-content: the invoice is one fixed-height sheet by design.
    pagebreak: { mode: [] as string[] },
  };

  try {
    const target = el.querySelector('.page') as HTMLElement;

    // An invoice is always a single sheet. The page box is fixed-height with
    // overflow hidden, so anything html2canvas pushes past page 1 is empty
    // padding — drop it rather than shipping a blank second page.
    const worker = html2pdf() as unknown as Html2PdfWorker;
    await worker
      .set(opt)
      .from(target)
      .toPdf()
      .get('pdf')
      .then((pdf) => {
        for (let page = pdf.internal.getNumberOfPages(); page > 1; page -= 1) {
          pdf.deletePage(page);
        }
      })
      .save();
  } finally {
    document.body.removeChild(el);
  }
}