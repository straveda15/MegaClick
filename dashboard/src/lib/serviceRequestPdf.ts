import html2pdf from 'html2pdf.js';
import { STAGE_LABELS } from '@/data/services';
import { TEMPERATURE_LABELS } from '@/data/leadTemperature';
import { sourceLabel } from '@/data/leadSource';
import type { LeadTemperature } from '@/hooks/useLeads';
import type { ServiceStage } from '@/hooks/useTasks';

/* ── The document model ─────────────────────────────────────────────────────
 *
 * Both boards describe a service request slightly differently — the Leads page
 * works off lead documents, the Clients page off the clients rollup. Each maps
 * into this one shape so there is a single PDF layout to maintain.
 */

export interface PdfStep {
  title: string;
  description?: string;
  done: boolean;
}

export interface PdfService {
  title: string;
  category?: string;
  stage?: ServiceStage | string;
  temperature?: LeadTemperature;
  startAt?: string | null;
  dueAt?: string | null;
  assignedTo?: string | null;
  taskStatus?: string;
  progress: number;
  steps?: PdfStep[];
  notes?: string;
}

export interface PdfClient {
  reference: string;
  name: string;
  phone?: string;
  email?: string;
  company?: string;
  address?: string;
  city?: string;
  state?: string;
  source?: string;
  followUpAt?: string | null;
  followUpNote?: string;
}

const TASK_STATUS_LABELS: Record<string, string> = {
  unassigned: 'Not assigned', pending: 'Not started', in_progress: 'In progress',
  completed: 'Completed', cancelled: 'Cancelled', overdue: 'Overdue',
};

/* ── Rendering ──────────────────────────────────────────────────────────────── */

const formatDate = (iso?: string | null) => {
  if (!iso) return '—';
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? '—'
    : d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

/** Anything interpolated into the document comes from user data — escape it. */
const escape = (value?: string | null) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const field = (label: string, value?: string | null) => `
  <div style="margin-bottom:10px">
    <div style="font-size:9px;letter-spacing:.08em;text-transform:uppercase;color:#6b7280;font-weight:700">${escape(label)}</div>
    <div style="font-size:12px;color:#111827;margin-top:2px">${escape(value) || '—'}</div>
  </div>`;

const serviceBlock = (service: PdfService) => {
  const steps = [...(service.steps ?? [])];
  const doneCount = steps.filter((step) => step.done).length;

  const stepsHtml = steps.length
    ? `
      <div style="margin-top:12px">
        <div style="font-size:9px;letter-spacing:.08em;text-transform:uppercase;color:#6b7280;font-weight:700;margin-bottom:6px">
          Steps — ${doneCount} of ${steps.length} complete
        </div>
        ${steps
          .map(
            (step) => `
          <div style="display:flex;gap:8px;align-items:flex-start;padding:4px 0;border-bottom:1px solid #f3f4f6">
            <div style="width:14px;height:14px;border:1px solid ${step.done ? '#059669' : '#d1d5db'};border-radius:3px;background:${step.done ? '#059669' : '#fff'};color:#fff;font-size:10px;line-height:13px;text-align:center;flex-shrink:0">${step.done ? '✓' : ''}</div>
            <div>
              <div style="font-size:11px;color:${step.done ? '#6b7280' : '#111827'}">${escape(step.title)}</div>
              ${step.description ? `<div style="font-size:9px;color:#9ca3af">${escape(step.description)}</div>` : ''}
            </div>
          </div>`
          )
          .join('')}
      </div>`
    : `<div style="margin-top:12px;font-size:10px;color:#9ca3af">No step checklist configured for this service.</div>`;

  const stageLabel = STAGE_LABELS[service.stage as ServiceStage] ?? service.stage ?? '—';

  return `
    <div style="border:1px solid #e5e7eb;border-radius:8px;padding:14px;margin-bottom:12px;page-break-inside:avoid">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px">
        <div>
          <div style="font-size:14px;font-weight:700;color:#111827">${escape(service.title)}</div>
          ${service.category ? `<div style="font-size:10px;color:#6b7280;margin-top:1px">${escape(service.category)}</div>` : ''}
        </div>
        <div style="font-size:10px;color:#374151;text-align:right;white-space:nowrap">
          ${escape(TASK_STATUS_LABELS[service.taskStatus ?? ''] ?? service.taskStatus ?? '')}
        </div>
      </div>

      <table style="width:100%;margin-top:12px;border-collapse:collapse;font-size:11px">
        <tr>
          <td style="padding:3px 0;color:#6b7280;width:110px">Handled by</td>
          <td style="padding:3px 0;color:#111827">${escape(service.assignedTo) || 'Unassigned'}</td>
          <td style="padding:3px 0;color:#6b7280;width:90px">Start date</td>
          <td style="padding:3px 0;color:#111827">${formatDate(service.startAt)}</td>
        </tr>
        <tr>
          <td style="padding:3px 0;color:#6b7280">Current stage</td>
          <td style="padding:3px 0;color:#111827">${escape(stageLabel)}</td>
          <td style="padding:3px 0;color:#6b7280">Target date</td>
          <td style="padding:3px 0;color:#111827">${formatDate(service.dueAt)}</td>
        </tr>
        <tr>
          <td style="padding:3px 0;color:#6b7280">Status</td>
          <td style="padding:3px 0;color:#111827">${service.temperature ? escape(TEMPERATURE_LABELS[service.temperature]) : '—'}</td>
          <td style="padding:3px 0;color:#6b7280">Progress</td>
          <td style="padding:3px 0;color:#111827">${service.progress}%</td>
        </tr>
      </table>

      <div style="margin-top:8px;height:6px;background:#f3f4f6;border-radius:99px;overflow:hidden">
        <div style="height:6px;width:${Math.max(0, Math.min(100, service.progress))}%;background:${service.progress === 100 ? '#059669' : '#2563eb'}"></div>
      </div>

      ${service.notes ? `<div style="margin-top:10px;font-size:10px;color:#6b7280"><strong style="color:#374151">Notes:</strong> ${escape(service.notes)}</div>` : ''}
      ${stepsHtml}
    </div>`;
};

const buildDocument = (client: PdfClient, services: PdfService[], title: string) => `
  <div style="font-family:Arial,Helvetica,sans-serif;padding:32px;width:794px;box-sizing:border-box;background:#fff">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #111827;padding-bottom:12px">
      <div>
        <div style="font-size:20px;font-weight:800;color:#111827">${escape(title)}</div>
        <div style="font-size:11px;color:#6b7280;margin-top:2px">Reference ${escape(client.reference)}</div>
      </div>
      <div style="font-size:10px;color:#6b7280;text-align:right">
        Generated ${formatDate(new Date().toISOString())}
      </div>
    </div>

    <div style="margin-top:18px">
      <div style="font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#111827;font-weight:800;margin-bottom:10px">
        Client Information
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:0 32px">
        <div style="width:45%">
          ${field('Name', client.name)}
          ${field('Phone', client.phone)}
          ${field('Email', client.email)}
        </div>
        <div style="width:45%">
          ${field('Company', client.company)}
          ${field('Address', client.address || [client.city, client.state].filter(Boolean).join(', '))}
          ${field('Source', client.source ? sourceLabel(client.source) : '')}
        </div>
      </div>
      ${
        client.followUpAt || client.followUpNote
          ? `<div style="border:1px solid #fcd34d;background:#fffbeb;border-radius:6px;padding:10px;margin-top:4px">
               <div style="font-size:9px;letter-spacing:.08em;text-transform:uppercase;color:#92400e;font-weight:700">
                 Follow up${client.followUpAt ? ` — ${formatDate(client.followUpAt)}` : ''}
               </div>
               ${client.followUpNote ? `<div style="font-size:11px;color:#111827;margin-top:3px">${escape(client.followUpNote)}</div>` : ''}
             </div>`
          : ''
      }
    </div>

    <div style="margin-top:22px">
      <div style="font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#111827;font-weight:800;margin-bottom:10px">
        Service Request${services.length === 1 ? '' : `s (${services.length})`}
      </div>
      ${services.map(serviceBlock).join('')}
    </div>
  </div>`;

/** Filenames must survive Windows, macOS and Linux alike. */
const safeName = (value: string) => value.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase();

/**
 * Renders a service request (or all of a client's requests) to a PDF and hands
 * it to the browser as a download.
 *
 * The node has to be attached and laid out for html2canvas to see it, so it is
 * mounted off-screen rather than hidden — `display:none` would rasterise blank.
 */
async function renderPdf(client: PdfClient, services: PdfService[], title: string, fileName: string) {
  const host = document.createElement('div');
  host.style.cssText = 'position:fixed;left:-10000px;top:0;width:794px;background:#fff;z-index:-1';
  host.innerHTML = buildDocument(client, services, title);
  document.body.appendChild(host);

  try {
    await html2pdf()
      .set({
        margin: 0,
        filename: fileName,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
        jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' },
        // Page breaks are left at the library default (`['css','legacy']`),
        // which honours the `page-break-inside:avoid` on each service block —
        // so a request never gets sliced in half across two pages.
      })
      .from(host.firstElementChild as HTMLElement)
      .save();
  } finally {
    host.remove();
  }
}

/** One service request, with the client and step detail behind it. */
export const downloadServicePdf = (client: PdfClient, service: PdfService) =>
  renderPdf(
    client,
    [service],
    'Service Request',
    `${safeName(client.name)}-${safeName(service.title)}-${client.reference}.pdf`
  );

/** Everything one client has with us, in a single document. */
export const downloadClientPdf = (client: PdfClient, services: PdfService[]) =>
  renderPdf(client, services, 'Client Service Summary', `${safeName(client.name)}-${client.reference}.pdf`);
