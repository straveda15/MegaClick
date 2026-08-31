import { useEffect, useMemo, useState } from 'react';
import { Check, Circle, Loader2, ListChecks } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useServiceStepTemplate } from '@/hooks/useServiceSteps';
import { useAssignLeadService, type LeadService, type SalesLead } from '@/hooks/useLeads';
import { useTeam } from '@/hooks/useTeam';
import { useAbsentTodayUserIds } from '@/hooks/useAttendance';

/* ── Helpers ────────────────────────────────────────────────────────────────── */

const formatDateInput = (date: Date) => {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

const todayDateInput = () => formatDateInput(new Date());

/** How long the note to the assignee may run — an instruction, not a brief. */
const NOTES_MAX = 150;

const defaultDeadline = () => {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return formatDateInput(d);
};

const toDateInput = (iso?: string | null) => {
  if (!iso) return '';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : formatDateInput(d);
};

/** A step as shown in the stepper — the template's text plus a done flag. */
interface StepState {
  title: string;
  description?: string;
  order: number;
  done: boolean;
}

interface AssignServiceDialogProps {
  lead: SalesLead | null;
  service: LeadService | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Assigns one of a client's services to an employee.
 *
 * Everything the old assign screen had — assignee, deadline, priority, notes —
 * plus the service's step checklist, preloaded from its template on the Service
 * Steps page. The admin ticks off whatever is already done before handing it
 * over, so the employee starts with an honest picture of where things stand.
 */
export function AssignServiceDialog({ lead, service, open, onOpenChange }: AssignServiceDialogProps) {
  const [assignedToId, setAssignedToId] = useState('');
  const [deadline, setDeadline] = useState(defaultDeadline());
  const [priority, setPriority] = useState('medium');
  const [notes, setNotes] = useState('');
  const [steps, setSteps] = useState<StepState[]>([]);

  const { data: team = [], isLoading: teamLoading } = useTeam();
  const { data: template, isFetching: templateLoading } = useServiceStepTemplate(
    open ? service?.slug : undefined
  );
  const assignService = useAssignLeadService();
  const absentToday = useAbsentTodayUserIds();

  const assignedTask = typeof service?.taskId === 'object' ? service.taskId : null;
  const isReassign = Boolean(service?.assignedTo?._id);
  const currentAssigneeId = service?.assignedTo?._id ? String(service.assignedTo._id) : null;

  // Reassigning to whoever already has it isn't a reassignment — leave them
  // off the list entirely rather than let the picker offer a no-op. Staff
  // marked absent today (manual attendance override) can't take on new work.
  const activeEmployees = useMemo(() =>
    team.filter((e) =>
      e.status !== 'inactive' &&
      e.userId?._id &&
      e.userId?.isActive !== false &&
      !absentToday.has(String(e.userId._id)) &&
      (!isReassign || String(e.userId._id) !== currentAssigneeId)
    ),
  [team, isReassign, currentAssigneeId, absentToday]);

  // Reset the form each time a different service is opened.
  useEffect(() => {
    if (!open || !service) return;

    setAssignedToId('');
    setPriority((lead?.priority ?? 'MEDIUM').toLowerCase());
    setNotes((service.notes ?? '').slice(0, NOTES_MAX));

    // The deadline IS the target date the client was promised for this
    // service. It carries over as-is — including one already in the past, which
    // is a fact about the engagement rather than something to quietly reset.
    setDeadline(toDateInput(service.dueAt) || defaultDeadline());
  }, [open, service?._id]);

  // Steps come from the work already assigned if there is any (so a reassign
  // keeps the ticks), otherwise fresh from the service's template.
  useEffect(() => {
    if (!open || !service) return;
    if (templateLoading) return;

    const taskSteps = assignedTask?.serviceRequest?.steps ?? [];
    if (taskSteps.length > 0) {
      setSteps(
        [...taskSteps]
          .sort((a, b) => a.order - b.order)
          .map((step) => ({
            title: step.title,
            description: step.description,
            order: step.order,
            done: Boolean(step.done),
          }))
      );
      return;
    }

    setSteps(
      (template?.steps ?? []).map((step, index) => ({
        title: step.title,
        description: step.description,
        order: Number.isFinite(step.order) ? step.order : index,
        done: false,
      }))
    );
  }, [open, service?._id, template, templateLoading]);

  const doneCount = steps.filter((s) => s.done).length;
  const progress = steps.length ? Math.round((doneCount / steps.length) * 100) : 0;

  const toggleStep = (index: number) => {
    setSteps((current) => current.map((step, i) => (i === index ? { ...step, done: !step.done } : step)));
  };

  /** Ticks every step up to and including the tapped one — the usual case. */
  const markThrough = (index: number) => {
    setSteps((current) => current.map((step, i) => ({ ...step, done: i <= index })));
  };

  /** The target date promised for this service, as a date-input string. */
  const serviceTarget = toDateInput(service?.dueAt);
  const targetIsPast = Boolean(serviceTarget) && serviceTarget < todayDateInput();

  const handleSubmit = () => {
    if (!lead || !service) return;

    if (!assignedToId) {
      toast.error('Select an employee to assign this to.');
      return;
    }
    // A past deadline is only allowed when it is the service's own target date;
    // anything else typed in by hand still has to be today or later.
    if (!deadline || (deadline < todayDateInput() && deadline !== serviceTarget)) {
      toast.error('Deadline cannot be in the past.');
      return;
    }
    if (notes.trim().length > NOTES_MAX) {
      toast.error(`Keep the note to the assignee under ${NOTES_MAX} characters.`);
      return;
    }

    assignService.mutate(
      {
        leadId: lead._id,
        serviceId: service._id,
        assignedTo: assignedToId,
        dueAt: new Date(`${deadline}T23:59:00`).toISOString(),
        priority,
        notes: notes.trim() || undefined,
        steps: steps.map((step, index) => ({
          title: step.title,
          description: step.description,
          order: index,
          done: step.done,
        })),
      },
      {
        onSuccess: () => {
          const employee = activeEmployees.find((e) => String(e.userId?._id) === assignedToId);
          const name = [employee?.userId?.name, employee?.userId?.lastName].filter(Boolean).join(' ') || 'the employee';
          toast.success(`${service.title} assigned to ${name}.`);
          onOpenChange(false);
        },
        onError: (err: Error) => toast.error(err?.message || 'Failed to assign this service.'),
      }
    );
  };

  const clientName = lead?.customer?.name?.trim() || lead?.customer?.phone || 'this client';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>{isReassign ? 'Reassign Service' : 'Assign Service'}</DialogTitle>
          <DialogDescription>
            Creates a task for the employee carrying {clientName}'s contact details, this service
            and its checklist.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-0 md:grid-cols-[minmax(0,1fr)_minmax(300px,1fr)]">
          {/* ── Who, when, how urgent ───────────────────────────────────────── */}
          <div className="p-5 space-y-4 border-b md:border-b-0 md:border-r border-border">
            <div className="rounded-md border border-border bg-muted/30 px-3 py-3 space-y-1">
              <p className="text-sm font-semibold text-foreground">{service?.title ?? 'Service'}</p>
              {service?.category && <p className="text-xs text-muted-foreground">{service.category}</p>}
              {isReassign && (
                <p className="text-[11px] text-amber-700 pt-1">
                  Currently with {service?.assignedTo?.name ?? 'someone'}. Reassigning creates a fresh
                  task for the new employee; the existing one is left as-is.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Assign to *</Label>
              <Select
                value={assignedToId}
                onValueChange={setAssignedToId}
                disabled={teamLoading || activeEmployees.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder={teamLoading ? 'Loading employees…' : 'Select employee'} />
                </SelectTrigger>
                <SelectContent>
                  {activeEmployees.map((e) => {
                    const id = String(e.userId?._id);
                    const name = [e.userId?.name, e.userId?.lastName].filter(Boolean).join(' ') || 'Unnamed employee';
                    const meta = e.designation || e.department || 'Employee';
                    return <SelectItem key={id} value={id}>{name} - {meta}</SelectItem>;
                  })}
                </SelectContent>
              </Select>
              {!teamLoading && activeEmployees.length === 0 && (
                <p className="text-xs text-muted-foreground">No active employees available.</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="assign-deadline">Deadline</Label>
                <Input
                  id="assign-deadline"
                  type="date"
                  min={targetIsPast ? serviceTarget : todayDateInput()}
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                />
                {serviceTarget && deadline === serviceTarget && (
                  <p className={`text-[11px] ${targetIsPast ? 'text-amber-600' : 'text-muted-foreground'}`}>
                    {targetIsPast
                      ? "The service's target date has already passed."
                      : "Taken from the service's target date."}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="assign-notes">Notes for the assignee</Label>
                <span className={`text-[10px] ${notes.length >= NOTES_MAX ? 'text-amber-600' : 'text-muted-foreground'}`}>
                  {notes.length}/{NOTES_MAX}
                </span>
              </div>
              <textarea
                id="assign-notes"
                maxLength={NOTES_MAX}
                value={notes}
                onChange={(e) => setNotes(e.target.value.slice(0, NOTES_MAX))}
                placeholder="Documents collected, special instructions…"
                className="w-full min-h-[72px] rounded-md border border-border bg-card px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
          </div>

          {/* ── The stepper ─────────────────────────────────────────────────── */}
          <div className="p-5">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-1.5">
                <ListChecks className="w-4 h-4 text-blue-700" />
                <Label className="text-sm">Steps</Label>
              </div>
              {steps.length > 0 && (
                <span className="text-[11px] text-muted-foreground">
                  {doneCount} of {steps.length} done · {progress}%
                </span>
              )}
            </div>

            {templateLoading ? (
              <div className="py-12 text-center text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                Loading steps…
              </div>
            ) : steps.length === 0 ? (
              <div className="rounded-md border border-dashed border-border px-4 py-8 text-center">
                <p className="text-sm text-muted-foreground">No steps set up for this service yet.</p>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Add them on the Service Steps page and they'll preload here next time.
                </p>
              </div>
            ) : (
              <>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-3">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <p className="text-[11px] text-muted-foreground mb-2">
                  Tick anything already done. Tap the number to mark everything up to that step.
                </p>

                <div className={`space-y-1.5 pr-1 ${steps.length > 6 ? 'max-h-[300px] overflow-y-auto' : ''}`}>
                  {steps.map((step, index) => (
                    <div
                      key={`${step.title}-${index}`}
                      className={`rounded-md border px-2.5 py-2 flex items-start gap-2.5 transition-colors ${
                        step.done ? 'border-emerald-200 bg-emerald-50' : 'border-border bg-card'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => markThrough(index)}
                        title={`Mark steps 1–${index + 1} as done`}
                        className={`shrink-0 w-6 h-6 rounded-full border flex items-center justify-center text-[10px] font-bold transition-colors ${
                          step.done
                            ? 'border-emerald-500 bg-emerald-500 text-white'
                            : 'border-border bg-muted text-muted-foreground hover:border-blue-400'
                        }`}
                      >
                        {step.done ? <Check className="w-3.5 h-3.5" /> : index + 1}
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleStep(index)}
                        className="flex-1 min-w-0 text-left"
                      >
                        <span className={`block text-[13px] font-medium leading-snug ${
                          step.done ? 'text-emerald-900 line-through' : 'text-foreground'
                        }`}>
                          {step.title}
                        </span>
                        {step.description && (
                          <span className="block text-[11px] text-muted-foreground mt-0.5">
                            {step.description}
                          </span>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleStep(index)}
                        title={step.done ? 'Mark as not done' : 'Mark as done'}
                        className="shrink-0 mt-0.5 text-muted-foreground hover:text-foreground"
                      >
                        {step.done
                          ? <Check className="w-4 h-4 text-emerald-600" />
                          : <Circle className="w-4 h-4" />}
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t border-border">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={assignService.isPending}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!assignedToId || assignService.isPending}>
            {assignService.isPending ? 'Assigning…' : isReassign ? 'Reassign Service' : 'Assign Service'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AssignServiceDialog;
