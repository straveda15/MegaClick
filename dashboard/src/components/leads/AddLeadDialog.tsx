import { useEffect, useMemo, useState } from 'react';
import { Pencil, Plus, Trash2, IndianRupee } from 'lucide-react';
import { toast } from 'sonner';
import { sanitizeAmountInput } from '@/lib/amount';
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
import { useServiceCatalog, type CatalogService } from '@/hooks/useServiceCatalog';
import {
  LEAD_TEMPERATURES,
  LEAD_PRIORITIES,
  useCreateLead,
  useUpdateLead,
  type LeadServiceInput,
  type LeadTemperature,
  type LeadPriority,
  type SalesLead,
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

/** How long a follow-up note may run. Long enough for a reminder, not an essay. */
const NOTE_MAX = 100;

/* ── Form shape ─────────────────────────────────────────────────────────────── */

/** A service on the form, with the dates and status captured alongside it. */
interface DraftService {
  id: string;
  slug: string;
  title: string;
  category: string;
  categorySlug: string;
  startAt: string;
  dueAt: string;
  quotation: string;
  temperature: string;
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
  client: '', phone: '+91', email: '', company: '', state: DEFAULT_STATE, city: '',
  followUpAt: '', followUpNote: '',
};

/* ── Dialog ─────────────────────────────────────────────────────────────────── */

interface AddLeadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /**
   * Editing an existing (still-unconfirmed) lead instead of capturing a new
   * one — the dialog pre-fills from it and saves back to it instead of
   * creating a fresh record.
   */
  lead?: SalesLead | null;
}

/** Draft rows from an existing lead's services — the form's own shape, pre-filled. */
const servicesFromLead = (lead: SalesLead): DraftService[] =>
  (lead.services ?? []).map((service) => ({
    id: service._id,
    slug: service.slug ?? '',
    title: service.title,
    category: service.category ?? '',
    categorySlug: service.categorySlug ?? '',
    startAt: service.startAt ? formatDateInput(new Date(service.startAt)) : todayDateInput(),
    dueAt: service.dueAt ? formatDateInput(new Date(service.dueAt)) : inDays(30),
    quotation: service.quotation != null ? String(service.quotation) : '',
    temperature: service.temperature ?? 'WARM',
  }));

const formFromLead = (lead: SalesLead): ClientForm => {
  const customer = lead.customer;
  const phone = (customer?.phone ?? '').trim();
  return {
    client: customer?.name ?? '',
    phone: phone.startsWith('+91') ? phone : `+91${phone.replace(/\D/g, '')}`,
    email: customer?.email ?? '',
    company: customer?.company ?? '',
    state: customer?.state || DEFAULT_STATE,
    city: customer?.city ?? '',
    followUpAt: lead.followUpAt ? formatDateInput(new Date(lead.followUpAt)) : '',
    followUpNote: lead.followUpNote ?? '',
  };
};

/**
 * Captures a client and everything they asked for — or, when `lead` is
 * passed, edits that same information on a lead that hasn't been confirmed
 * yet (the identical form, pre-filled, saving back instead of creating).
 *
 * Each service carries its own start date, target date and status, because a
 * client rarely wants two filings on the same timeline — the marriage
 * registration may be urgent while the trademark can wait a quarter.
 */
export function AddLeadDialog({ open, onOpenChange, lead }: AddLeadDialogProps) {
  const isEdit = Boolean(lead);

  const defaultService = () => ({
    id: crypto.randomUUID(),
    slug: '',
    title: '',
    category: '',
    categorySlug: '',
    startAt: todayDateInput(),
    dueAt: inDays(30),
    quotation: '',
    temperature: 'WARM',
  });

  const [form, setForm] = useState<ClientForm>(EMPTY_FORM);
  const [services, setServices] = useState<DraftService[]>([defaultService()]);
  const { data: catalog } = useServiceCatalog();
  const [cityIsFreeText, setCityIsFreeText] = useState(false);

  const createLead = useCreateLead();
  const updateLead = useUpdateLead();
  const saving = isEdit ? updateLead.isPending : createLead.isPending;

  // Pre-fill from the lead being edited every time the dialog opens (or reset
  // to a blank capture form when there's no lead) — state persists across
  // opens, so it can't just be set once.
  useEffect(() => {
    if (!open) return;
    if (lead) {
      setForm(formFromLead(lead));
      const rows = servicesFromLead(lead);
      setServices(rows.length > 0 ? rows : [defaultService()]);
      const state = lead.customer?.state || DEFAULT_STATE;
      setCityIsFreeText(Boolean(lead.customer?.city) && citiesForState(state).length === 0);
    } else {
      setForm(EMPTY_FORM);
      setServices([defaultService()]);
      setCityIsFreeText(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, lead?._id]);

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

  const addServiceRow = () => {
    setServices((current) => [
      ...current,
      defaultService(),
    ]);
  };

  const updateService = <K extends keyof DraftService>(id: string, field: K, value: DraftService[K]) => {
    setServices((current) =>
      current.map((service) => (service.id === id ? { ...service, [field]: value } : service))
    );
  };

  const handleServiceSelect = (id: string, slug: string) => {
    const s = catalog?.services.find((x) => x.slug === slug);
    if (!s) return;
    setServices((current) =>
      current.map((service) =>
        service.id === id
          ? { ...service, slug: s.slug, title: s.title, category: s.category, categorySlug: s.categorySlug }
          : service
      )
    );
  };

  /**
   * Moving the start date drags an earlier target date along with it, rather
   * than leaving the row in a state the form would only reject on submit.
   */
  const handleStartChange = (id: string, startAt: string) => {
    setServices((current) =>
      current.map((service) =>
        service.id === id
          ? { ...service, startAt, dueAt: service.dueAt && service.dueAt < startAt ? startAt : service.dueAt }
          : service
      )
    );
  };

  const removeService = (id: string) =>
    setServices((current) => current.filter((service) => service.id !== id));

  /** Every service already chosen on the form — see the dropdown filter. */
  const takenSlugs = useMemo(
    () => new Set(services.map((service) => service.slug).filter(Boolean)),
    [services]
  );

  const reset = () => {
    setForm(EMPTY_FORM);
    setServices([defaultService()]);
    setCityIsFreeText(false);
  };

  const handleSubmit = () => {
    const client = form.client.trim();
    const phone = form.phone.trim();
    const phoneDigits = phone.replace(/^\+91/, '');

    if (!client) {
      toast.error('Client name is required.');
      return;
    }
    if (phoneDigits.length !== 10) {
      toast.error('Enter a valid 10-digit phone number.');
      return;
    }

    const chosen = services.filter((service) => service.slug);
    const today = todayDateInput();

    // A service being edited may genuinely have started before today — only a
    // brand-new capture is held to "start date can't be in the past".
    if (!isEdit) {
      const missingStart = chosen.find((service) => !service.startAt);
      if (missingStart) {
        toast.error(`${missingStart.title || 'A service'}: pick a start date.`);
        return;
      }

      const startsInPast = chosen.find((service) => service.startAt < today);
      if (startsInPast) {
        toast.error(`${startsInPast.title || 'A service'}: the start date can't be in the past.`);
        return;
      }
    }

    const outOfOrder = chosen.find((service) => service.dueAt && service.dueAt < service.startAt);
    if (outOfOrder) {
      toast.error(`${outOfOrder.title || 'A service'}: the target date can't be before the start date.`);
      return;
    }

    // A quotation is optional, but a nonsense one is not.
    const badQuote = chosen.find((service) => {
      if (!service.quotation.trim()) return false;
      const amount = Number(service.quotation);
      return !Number.isFinite(amount) || amount < 0;
    });
    if (badQuote) {
      toast.error(`${badQuote.title || 'A service'}: enter a valid quotation amount (0 or more).`);
      return;
    }

    // Belt and braces — the dropdown already hides what's taken.
    const slugs = chosen.map((service) => service.slug);
    if (new Set(slugs).size !== slugs.length) {
      toast.error('The same service is listed more than once.');
      return;
    }

    if (form.followUpNote.trim().length > NOTE_MAX) {
      toast.error(`Keep the follow-up note under ${NOTE_MAX} characters.`);
      return;
    }

    const payload: LeadServiceInput[] = services
      .filter((s) => s.slug)
      .map((s) => ({
        title: s.title,
        slug: s.slug,
        category: s.category,
        categorySlug: s.categorySlug,
        startAt: s.startAt || undefined,
        dueAt: s.dueAt || undefined,
        quotation: s.quotation ? Number(s.quotation) : undefined,
        temperature: s.temperature as LeadTemperature,
      }));

    if (isEdit && lead) {
      updateLead.mutate(
        {
          id: lead._id,
          name: client,
          phone,
          email: form.email.trim() || undefined,
          company: form.company.trim() || undefined,
          state: form.state || undefined,
          city: form.city.trim() || undefined,
          services: payload,
          followUpAt: form.followUpAt || undefined,
          followUpNote: form.followUpNote.trim() || undefined,
        },
        {
          onSuccess: () => {
            onOpenChange(false);
            toast.success(`Saved changes for ${client}.`);
          },
          onError: (err: Error) => toast.error(err?.message || 'Failed to save changes.'),
        }
      );
      return;
    }

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
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          <DialogHeader className="px-5 pt-4 pb-2 border-b border-border">
            <DialogTitle>{isEdit ? `Edit Lead — ${lead?.customer?.name || lead?.customer?.phone || ''}` : 'Add Lead'}</DialogTitle>
          </DialogHeader>
          <div className="px-5 py-3 space-y-2 max-h-[75vh] overflow-y-auto">
            {/* ── Who they are ──────────────────────────────────────────────── */}
            <section className="space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
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
                  <div className="flex">
                    <span className="inline-flex items-center px-3 border border-r-0 border-border rounded-l-md bg-muted text-muted-foreground text-sm select-none">+91</span>
                    <Input
                      id="lead-phone"
                      value={form.phone.replace(/^\+91/, '')}
                      onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                        update('phone', '+91' + digits);
                      }}
                      placeholder="10 digit number"
                      maxLength={10}
                      className="rounded-l-none"
                    />
                  </div>
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
                </div>
              </div>

              <div className="space-y-2 overflow-x-auto">
                <div className="min-w-[600px]">
                  <div
                    className="grid gap-2 mb-1"
                    style={{ gridTemplateColumns: 'minmax(0, 4fr) minmax(0, 2fr) minmax(0, 3fr) minmax(0, 3fr) minmax(0, 2fr) 28px' }}
                  >
                    <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Select Service</div>
                    <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Quotation</div>
                    <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">When to Start</div>
                    <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Target Date</div>
                    <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Status</div>
                    <div></div>
                  </div>

                  {services.map((service) => (
                    <div
                      key={service.id}
                      className="grid gap-2 items-center mb-2"
                      style={{ gridTemplateColumns: 'minmax(0, 4fr) minmax(0, 2fr) minmax(0, 3fr) minmax(0, 3fr) minmax(0, 2fr) 28px' }}
                    >
                      <Select value={service.slug} onValueChange={(val) => handleServiceSelect(service.id, val)}>
                        <SelectTrigger className="h-9 text-xs">
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                          {/* A service already on the form is off the menu —
                              asking for the same filing twice is a mistake, not
                              a second order. */}
                          {catalog?.services
                            .filter((s) => s.slug === service.slug || !takenSlugs.has(s.slug))
                            .map((s) => (
                              <SelectItem key={s.slug} value={s.slug} className="text-xs">{s.title}</SelectItem>
                            ))}
                        </SelectContent>
                      </Select>

                      <div className="relative">
                        <IndianRupee className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                        <Input
                          type="text"
                          inputMode="decimal"
                          placeholder="0.00"
                          value={service.quotation}
                          onChange={(e) =>
                            updateService(service.id, 'quotation', sanitizeAmountInput(e.target.value))
                          }
                          className="h-9 pl-8 text-xs"
                        />
                      </div>

                      <Input
                        type="date"
                        min={isEdit ? undefined : todayDateInput()}
                        value={service.startAt}
                        onChange={(e) => handleStartChange(service.id, e.target.value)}
                        className="h-9 text-xs"
                      />

                      <Input
                        type="date"
                        min={service.startAt || undefined}
                        value={service.dueAt}
                        onChange={(e) => updateService(service.id, 'dueAt', e.target.value)}
                        className="h-9 text-xs"
                      />

                      <Select value={service.temperature} onValueChange={(val) => updateService(service.id, 'temperature', val as LeadTemperature)}>
                        <SelectTrigger className="h-9 text-xs">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          {LEAD_TEMPERATURES.map((t) => (
                            <SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <button
                        type="button"
                        onClick={() => removeService(service.id)}
                        className="shrink-0 h-9 w-7 rounded-md text-destructive hover:bg-destructive/10 flex items-center justify-center"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addServiceRow}
                    className="mt-2"
                  >
                    <Plus className="w-4 h-4 mr-1.5" />
                    Add Service
                  </Button>
                </div>
              </div>
            </section>

            {/* ── When to chase them ────────────────────────────────────────── */}
            <section className="space-y-2">
              <div>
                <Label>Follow-up</Label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,200px)_minmax(0,1fr)] gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="lead-followup" className="text-[11px]">Follow-up date</Label>
                  <Input
                    id="lead-followup"
                    type="date"
                    min={isEdit ? undefined : todayDateInput()}
                    value={form.followUpAt}
                    onChange={(e) => update('followUpAt', e.target.value)}
                    className="h-9"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="lead-followup-note" className="text-[11px]">Follow-up note</Label>
                    <span className={`text-[10px] ${form.followUpNote.length >= NOTE_MAX ? 'text-amber-600' : 'text-muted-foreground'}`}>
                      {form.followUpNote.length}/{NOTE_MAX}
                    </span>
                  </div>
                  <textarea
                    id="lead-followup-note"
                    maxLength={NOTE_MAX}
                    value={form.followUpNote}
                    onChange={(e) => update('followUpNote', e.target.value.slice(0, NOTE_MAX))}
                    className="w-full min-h-[38px] h-9 rounded-md border border-border bg-card px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
              </div>
            </section>
          </div>

          <DialogFooter className="px-5 py-3 border-t border-border">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button
              onClick={handleSubmit}
              disabled={!form.client.trim() || form.phone.replace(/^\+91/, '').length !== 10 || saving}
            >
              {isEdit
                ? (saving ? 'Saving…' : 'Save Changes')
                : (saving ? 'Adding…' : 'Add Lead')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </>
  );
}

export default AddLeadDialog;
