import { useMemo, useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ServiceCatalogPicker from '@/components/ServiceCatalogPicker';
import { DEFAULT_STATE, INDIAN_STATES, citiesForState } from '@/data/indiaLocations';
import { TEMPERATURE_LABELS, TEMPERATURE_STYLES } from '@/data/leadTemperature';
import type { CatalogService } from '@/hooks/useServiceCatalog';
import {
  LEAD_TEMPERATURES,
  useCreateLead,
  type LeadServiceInput,
  type LeadTemperature,
} from '@/hooks/useLeads';

/* ── Helpers ────────────────────────────────────────────────────────────────── */

const formatDateInput = (date: Date) => {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

const todayDateInput = () => formatDateInput(new Date());

const inDays = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return formatDateInput(d);
};

/** Sentinel for "the city I need isn't in the list" — switches to free text. */
const OTHER_CITY = '__other__';

/* ── Form shape ─────────────────────────────────────────────────────────────── */

/** A service on the form, with the dates and status captured alongside it. */
interface DraftService {
  slug: string;
  title: string;
  category: string;
  categorySlug: string;
  startAt: string;
  dueAt: string;
  temperature: LeadTemperature;
}

interface ClientForm {
  client: string;
  phone: string;
  email: string;
  company: string;
  state: string;
  city: string;
  /** One follow-up for the lead as a whole, whatever they booked. */
  followUpAt: string;
  followUpNote: string;
}

const EMPTY_FORM: ClientForm = {
  client: '', phone: '', email: '', company: '', state: DEFAULT_STATE, city: '',
  followUpAt: '', followUpNote: '',
};

/* ── Dialog ─────────────────────────────────────────────────────────────────── */

interface AddLeadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Captures a client and everything they asked for.
 *
 * Each service carries its own start date, target date and status, because a
 * client rarely wants two filings on the same timeline — the marriage
 * registration may be urgent while the trademark can wait a quarter.
 */
export function AddLeadDialog({ open, onOpenChange }: AddLeadDialogProps) {
  const [form, setForm] = useState<ClientForm>(EMPTY_FORM);
  const [services, setServices] = useState<DraftService[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [cityIsFreeText, setCityIsFreeText] = useState(false);

  const createLead = useCreateLead();

  const cities = useMemo(() => citiesForState(form.state), [form.state]);

  const update = <K extends keyof ClientForm>(field: K, value: ClientForm[K]) =>
    setForm((current) => ({ ...current, [field]: value }));

  // A city only means something within its state, so changing the state clears it.
  const handleStateChange = (state: string) => {
    setForm((current) => ({ ...current, state, city: '' }));
    setCityIsFreeText(citiesForState(state).length === 0);
  };

  const handleCityChange = (value: string) => {
    if (value === OTHER_CITY) {
      setCityIsFreeText(true);
      update('city', '');
      return;
    }
    update('city', value);
  };

  /**
   * Clicking a service in the picker adds it straight to the list below, and
   * clicking it again takes it out. Direct manipulation — no separate "add
   * selected" step to get out of sync with what the list actually shows.
   */
  const toggleService = (service: CatalogService) =>
    setServices((current) =>
      current.some((s) => s.slug === service.slug)
        ? current.filter((s) => s.slug !== service.slug)
        : [
            ...current,
            {
              slug: service.slug,
              title: service.title,
              category: service.category,
              categorySlug: service.categorySlug,
              startAt: todayDateInput(),
              dueAt: inDays(30),
              temperature: 'WARM' as LeadTemperature,
            },
          ]
    );

  const updateService = <K extends keyof DraftService>(slug: string, field: K, value: DraftService[K]) =>
    setServices((current) =>
      current.map((service) => (service.slug === slug ? { ...service, [field]: value } : service))
    );

  const removeService = (slug: string) =>
    setServices((current) => current.filter((service) => service.slug !== slug));

  const reset = () => {
    setForm(EMPTY_FORM);
    setServices([]);
    setCityIsFreeText(false);
  };

  const handleSubmit = () => {
    const client = form.client.trim();
    const phone = form.phone.trim();

    if (!client || !phone) {
      toast.error('Client name and phone number are required.');
      return;
    }

    const dated = services.filter((service) => service.startAt && service.dueAt);
    const outOfOrder = dated.find((service) => service.dueAt < service.startAt);
    if (outOfOrder) {
      toast.error(`${outOfOrder.title}: the target date can't be before the start date.`);
      return;
    }

    const payload: LeadServiceInput[] = services.map((service) => ({
      title: service.title,
      slug: service.slug,
      category: service.category,
      categorySlug: service.categorySlug,
      startAt: service.startAt ? new Date(`${service.startAt}T00:00:00`).toISOString() : undefined,
      dueAt: service.dueAt ? new Date(`${service.dueAt}T23:59:00`).toISOString() : undefined,
      temperature: service.temperature,
    }));

    createLead.mutate(
      {
        name: client,
        phone,
        email: form.email.trim() || undefined,
        company: form.company.trim() || undefined,
        state: form.state || undefined,
        city: form.city.trim() || undefined,
        services: payload,
        serviceStage: 'documents_pending',
        status: 'NEW',
        source: 'manual',
        followUpAt: form.followUpAt || undefined,
        followUpNote: form.followUpNote.trim() || undefined,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          reset();
          toast.success(
            services.length > 0
              ? `Lead added — ${client} wants ${services.length} service${services.length === 1 ? '' : 's'}.`
              : `Lead added for ${client}.`
          );
        },
        onError: (err: Error) => toast.error(err?.message || 'Failed to add lead.'),
      }
    );
  };

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(next) => { onOpenChange(next); if (!next) reset(); }}
      >
        <DialogContent className="max-w-3xl p-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
            <DialogTitle>Add Lead</DialogTitle>
            <DialogDescription>
              Capture the client, then add each service they asked for with its own timeline.
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 py-5 space-y-5 max-h-[65vh] overflow-y-auto">
            {/* ── Who they are ──────────────────────────────────────────────── */}
            <section className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="lead-client">Client name *</Label>
                  <Input
                    id="lead-client"
                    value={form.client}
                    onChange={(e) => update('client', e.target.value)}
                    placeholder="Full name of the client"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lead-phone">Phone *</Label>
                  <Input
                    id="lead-phone"
                    value={form.phone}
                    onChange={(e) => update('phone', e.target.value)}
                    placeholder="+91…"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lead-email">Email</Label>
                <Input
                  id="lead-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  placeholder="client@example.com"
                />
              </div>
            </section>

            {/* ── Where they are ────────────────────────────────────────────── */}
            <section className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label htmlFor="lead-company">Company</Label>
                <Input
                  id="lead-company"
                  value={form.company}
                  onChange={(e) => update('company', e.target.value)}
                  placeholder="Optional"
                />
              </div>

              <div className="space-y-2">
                <Label>State</Label>
                <Select value={form.state} onValueChange={handleStateChange}>
                  <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {INDIAN_STATES.map((state) => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lead-city">City</Label>
                {cityIsFreeText || cities.length === 0 ? (
                  <div className="flex items-center gap-1.5">
                    <Input
                      id="lead-city"
                      value={form.city}
                      onChange={(e) => update('city', e.target.value)}
                      placeholder="Type the city"
                    />
                    {cities.length > 0 && (
                      <button
                        type="button"
                        onClick={() => { setCityIsFreeText(false); update('city', ''); }}
                        title="Back to the city list"
                        className="shrink-0 h-9 px-2 rounded-md border border-border text-muted-foreground hover:bg-muted"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ) : (
                  <Select value={form.city} onValueChange={handleCityChange}>
                    <SelectTrigger>
                      <SelectValue placeholder={`Select city in ${form.state}`} />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {cities.map((city) => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
                      <SelectItem value={OTHER_CITY}>Other…</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </section>

            {/* ── What they want ────────────────────────────────────────────── */}
            <section>
              <div className="flex items-center justify-between gap-3 mb-3">
                <div>
                  <Label>Services</Label>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Each one gets its own dates and status.
                  </p>
                </div>
                <Button
                  type="button"
                  variant={pickerOpen ? 'secondary' : 'outline'}
                  size="sm"
                  onClick={() => setPickerOpen((open) => !open)}
                >
                  <Plus className="w-4 h-4" />
                  {pickerOpen ? 'Done picking' : 'Add service'}
                </Button>
              </div>

              {/* Inline rather than a second modal on top of this one — nested
                  dialogs fight over focus and the overlay, and the picker has
                  to sit alongside the list it is filling in. */}
              {pickerOpen && (
                <div className="rounded-lg border border-border bg-muted/20 p-3 mb-3">
                  <ServiceCatalogPicker
                    selectedSlugs={services.map((s) => s.slug)}
                    onToggle={toggleService}
                    height="h-[240px]"
                  />
                  <p className="text-[11px] text-muted-foreground mt-2">
                    Tap a service to add it, tap again to remove. Dates and status are set below.
                  </p>
                </div>
              )}

              {services.length === 0 ? (
                <button
                  type="button"
                  onClick={() => setPickerOpen(true)}
                  className="w-full rounded-lg border border-dashed border-border px-4 py-8 text-center hover:bg-muted/30 transition-colors"
                >
                  <Plus className="w-5 h-5 mx-auto text-muted-foreground mb-1.5" />
                  <p className="text-sm font-medium text-foreground">Add a service</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    You can add more than one — and you can always add them later.
                  </p>
                </button>
              ) : (
                <div className="space-y-2.5">
                  {services.map((service) => (
                    <div key={service.slug} className="rounded-lg border border-border bg-muted/20 p-3.5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-foreground">{service.title}</p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">{service.category}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeService(service.slug)}
                          title={`Remove ${service.title}`}
                          aria-label={`Remove ${service.title}`}
                          className="shrink-0 h-7 w-7 rounded-md border border-border bg-card flex items-center justify-center text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                        <div className="space-y-1.5">
                          <Label className="text-[11px]">Start date</Label>
                          <Input
                            type="date"
                            value={service.startAt}
                            onChange={(e) => updateService(service.slug, 'startAt', e.target.value)}
                            className="h-9"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-[11px]">Target date</Label>
                          <Input
                            type="date"
                            min={service.startAt || undefined}
                            value={service.dueAt}
                            onChange={(e) => updateService(service.slug, 'dueAt', e.target.value)}
                            className="h-9"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-[11px]">Status</Label>
                          <div className="flex items-center gap-1.5">
                            {LEAD_TEMPERATURES.map((value) => {
                              const style = TEMPERATURE_STYLES[value];
                              const active = service.temperature === value;
                              return (
                                <button
                                  key={value}
                                  type="button"
                                  onClick={() => updateService(service.slug, 'temperature', value)}
                                  className={`flex-1 h-9 rounded-md text-xs font-medium transition-all ${
                                    active
                                      ? `${style.bg} ${style.text} ring-2 ${style.ring}`
                                      : 'bg-card border border-border text-muted-foreground hover:bg-muted'
                                  }`}
                                >
                                  {TEMPERATURE_LABELS[value]}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* ── When to chase them ────────────────────────────────────────── */}
            <section className="rounded-lg border border-border bg-muted/20 p-4 space-y-3">
              <div>
                <Label>Follow-up</Label>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  One reminder for this client, covering everything they booked.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,200px)_minmax(0,1fr)] gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="lead-followup" className="text-[11px]">Follow-up date</Label>
                  <Input
                    id="lead-followup"
                    type="date"
                    min={todayDateInput()}
                    value={form.followUpAt}
                    onChange={(e) => update('followUpAt', e.target.value)}
                    className="h-9"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="lead-followup-note" className="text-[11px]">Follow-up note</Label>
                  <textarea
                    id="lead-followup-note"
                    value={form.followUpNote}
                    onChange={(e) => update('followUpNote', e.target.value)}
                    placeholder="What was agreed, what to ask for next time…"
                    className="w-full min-h-[38px] h-9 rounded-md border border-border bg-card px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
              </div>
            </section>
          </div>

          <DialogFooter className="px-6 py-4 border-t border-border">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button
              onClick={handleSubmit}
              disabled={!form.client.trim() || !form.phone.trim() || createLead.isPending}
            >
              {createLead.isPending ? 'Adding…' : 'Add Lead'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </>
  );
}

export default AddLeadDialog;
