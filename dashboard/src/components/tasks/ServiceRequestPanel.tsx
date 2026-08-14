import { Briefcase, Building2, Mail, MapPin, Phone, StickyNote, User } from 'lucide-react';
import type { TaskServiceRequest } from '@/hooks/useTasks';

const STAGE_LABELS: Record<string, string> = {
  documents_pending:       'Documents Pending',
  documents_received:      'Documents Received',
  application_submitted:   'Application Submitted',
  government_verification: 'Government Verification',
  approval_received:       'Approval Received',
  certificate_ready:       'Certificate Ready',
  completed:               'Completed',
};

interface ServiceRequestPanelProps {
  request: TaskServiceRequest;
  /** `compact` fits the task card; `full` is for the detail modal. */
  variant?: 'compact' | 'full';
}

/**
 * Everything the assignee needs to act on a client service request: which
 * service was requested and how to reach the client who asked for it. Rendered
 * on both the task card and the task detail modal so the context travels with
 * the task wherever the employee sees it.
 */
export function ServiceRequestPanel({ request, variant = 'full' }: ServiceRequestPanelProps) {
  const contactRows = [
    { icon: Phone, label: 'Phone', value: request.clientPhone, href: request.clientPhone ? `tel:${request.clientPhone}` : undefined },
    { icon: Mail, label: 'Email', value: request.clientEmail, href: request.clientEmail ? `mailto:${request.clientEmail}` : undefined },
    { icon: Building2, label: 'Company', value: request.clientCompany },
    { icon: MapPin, label: 'Address', value: request.clientAddress },
  ].filter((row) => row.value);

  const compact = variant === 'compact';

  return (
    <div className="rounded-xl border border-blue-200 bg-blue-50/50 overflow-hidden">
      <div className="px-3.5 py-2 bg-blue-100/60 border-b border-blue-200 flex items-center gap-1.5">
        <Briefcase className="w-3 h-3 text-blue-700 shrink-0" />
        <span className="text-[9px] uppercase tracking-wider font-bold text-blue-800">
          Client Service Request
        </span>
        {request.stage && (
          <span className="ml-auto text-[9px] font-semibold text-blue-700 bg-white/70 border border-blue-200 px-1.5 py-0.5 rounded-full">
            {STAGE_LABELS[request.stage] ?? request.stage}
          </span>
        )}
      </div>

      <div className={`px-3.5 ${compact ? 'py-2.5 space-y-2' : 'py-3 space-y-3'}`}>
        {/* What they want */}
        <div>
          <p className="text-[9px] uppercase tracking-wider font-bold text-blue-700/70">Service requested</p>
          <p className="text-[13px] font-semibold text-foreground leading-snug mt-0.5">
            {request.serviceTitle || '—'}
          </p>
          {request.serviceCategory && (
            <p className="text-[11px] text-muted-foreground">{request.serviceCategory}</p>
          )}
        </div>

        {/* Who wants it */}
        <div>
          <p className="text-[9px] uppercase tracking-wider font-bold text-blue-700/70 mb-1">Client</p>
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <span className="text-[13px] font-semibold text-foreground">{request.clientName || '—'}</span>
          </div>

          {contactRows.length > 0 && (
            <div className={`mt-1.5 ${compact ? 'space-y-1' : 'grid grid-cols-1 sm:grid-cols-2 gap-1.5'}`}>
              {contactRows.map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-start gap-1.5 min-w-0">
                  <Icon className="w-3 h-3 text-muted-foreground shrink-0 mt-[3px]" />
                  {href ? (
                    <a href={href} className="text-[11px] text-blue-700 hover:underline truncate">
                      {value}
                    </a>
                  ) : (
                    <span className="text-[11px] text-foreground break-words">{value}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Anything else the assigner wanted them to know */}
        {request.notes && (
          <div>
            <p className="text-[9px] uppercase tracking-wider font-bold text-blue-700/70 mb-1 flex items-center gap-1">
              <StickyNote className="w-3 h-3" /> Notes
            </p>
            <p className="text-[11px] text-foreground leading-relaxed whitespace-pre-line">
              {request.notes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ServiceRequestPanel;
