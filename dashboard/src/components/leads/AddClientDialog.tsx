import { useMemo, useState } from 'react';
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
  type LeadServiceInput,
  type LeadTemperature,
  type LeadPriority,
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

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** A client name is letters only — no digits or symbols. Spaces stay allowed
 *  between words so multi-word names are still typable. */
const NAME_TEXT_PATTERN = /^[a-zA-Z][a-zA-Z ]*$/;
const sanitizeNameInput = (raw: string) => raw.replace(/[^a-zA-Z ]/g, '');

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
  /** Internal-facing name for the client — how the office refers to them, distinct from their legal name. */
  referenceName: string;
  state: string;
  city: string;
  /** One follow-up for the lead as a whole, whatever they booked. */
  followUpAt: string;
  followUpNote: string;
}

const EMPTY_FORM: ClientForm = {
  client: '', phone: '+91', email: '', company: '', referenceName: '', state: DEFAULT_STATE, city: '',
  followUpAt: '', followUpNote: '',
};

/* ── Dialog ─────────────────────────────────────────────────────────────────── */

interface AddClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddClientDialog({ open, onOpenChange }: AddClientDialogProps) {
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
    if (!NAME_TEXT_PATTERN.test(client)) {
      toast.error('Client name can only contain letters.');
      return;
    }
    if (phoneDigits.length !== 10) {
      toast.error('Enter a valid 10-digit phone number.');
      return;
    }

    const email = form.email.trim();
    if (email && !EMAIL_PATTERN.test(email)) {
      toast.error('Enter a valid email address.');
      return;
    }

    const chosen = services.filter((service) => service.slug);
    if (chosen.length === 0) {
      toast.error('Select at least one service.');
      return;
    }
    const today = todayDateInput();

    const dueInPast = chosen.find((service) => service.dueAt && service.dueAt < today);
    if (dueInPast) {
      toast.error(`${dueInPast.title || 'A service'}: the target date can't be in the past.`);
      return;
    }

    const badQuote = chosen.find((service) => {
      if (!service.quotation.trim()) return true;
      const amount = Number(service.quotation);
      return !Number.isFinite(amount) || amount <= 0;
    });
    if (badQuote) {
      toast.error(`${badQuote.title || 'A service'}: enter a quotation amount.`);
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

    createLead.mutate(
      {
        name: client,
        phone,
        email: form.email.trim() || undefined,
        company: form.company.trim() || undefined,
        referenceName: form.referenceName.trim() || undefined,
        state: form.state || undefined,
        city: form.city.trim() || undefined,
        services: payload,
        serviceStage: 'documents_pending',
        status: 'CONVERTED',
        source: 'manual',
        followUpAt: form.followUpAt || undefined,
        followUpNote: form.followUpNote.trim() || undefined,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          reset();
          toast.success(`Client ${client} added successfully.`);
        },
        onError: (err: Error) => toast.error(err?.message || 'Failed to add client.'),
      }
    );
  };

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(next) => { onOpenChange(next); if (!next) reset(); }}
      >
        <DialogContent className="max-w-4xl p-0 overflow-hidden" aria-describedby={undefined}>
          <DialogHeader className="px-5 pt-4 pb-2 border-b border-border">
            <DialogTitle>Add Client</DialogTitle>
            <DialogDescription className="sr-only">
              Fill in the client's details and required services.
            </DialogDescription>
          </DialogHeader>
          <div className="px-5 py-3 space-y-3 max-h-[75vh] overflow-y-auto">
            {/* ── Who they are ──────────────────────────────────────────────── */}
            <section className="space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="lead-client">Client name *</Label>
                  <Input
                    id="lead-client"
                    value={form.client}
                    onChange={(e) => update('client', sanitizeNameInput(e.target.value))}
                    pattern="^[a-zA-Z][a-zA-Z ]*$"
                    title="Letters only"
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                <div className="space-y-2">
                  <Label htmlFor="client-reference-name">Client Reference Name</Label>
                  <Input
                    id="client-reference-name"
                    value={form.referenceName}
                    onChange={(e) => update('referenceName', e.target.value)}
                    placeholder="Reference Name"
                  />
                </div>
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
                  <Label>Services *</Label>
                </div>
              </div>

              <div className="space-y-2 overflow-x-auto">
                <div className="min-w-[600px]">
                  <div
                    className="grid gap-2 mb-1"
                    style={{ gridTemplateColumns: 'minmax(0, 4fr) minmax(0, 2fr) minmax(0, 3fr) minmax(0, 2fr) 28px' }}
                  >
                    <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Select Service</div>
                    <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Quotation *</div>
                    <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Target Date</div>
                    <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Status</div>
                    <div></div>
                  </div>

                  {services.map((service) => (
                    <div
                      key={service.id}
                      className="grid gap-2 items-center mb-2"
                      style={{ gridTemplateColumns: 'minmax(0, 4fr) minmax(0, 2fr) minmax(0, 3fr) minmax(0, 2fr) 28px' }}
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
                        min={todayDateInput()}
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
                    min={todayDateInput()}
                    value={form.followUpAt}
                    onChange={(e) => update('followUpAt', e.target.value)}
                    className="h-9"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="client-followup-note" className="text-[11px]">Follow-up note</Label>
                    <span className={`text-[10px] ${form.followUpNote.length >= NOTE_MAX ? 'text-amber-600' : 'text-muted-foreground'}`}>
                      {form.followUpNote.length}/{NOTE_MAX}
                    </span>
                  </div>
                  <textarea
                    id="client-followup-note"
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
              disabled={
                createLead.isPending ||
                !form.client.trim() ||
                !NAME_TEXT_PATTERN.test(form.client.trim()) ||
                form.phone.replace(/^\+91/, '').length !== 10 ||
                (Boolean(form.email.trim()) && !EMAIL_PATTERN.test(form.email.trim())) ||
                !services.some((service) => service.slug) ||
                services.some((service) => service.slug && (!service.quotation.trim() || Number(service.quotation) <= 0))
              }
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {createLead.isPending ? 'Saving...' : 'Add Client'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AddClientDialog;
