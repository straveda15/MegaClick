import { useEffect, useMemo, useState } from 'react';
import {
  ArrowDown, ArrowUp, CheckCircle2, GripVertical, Loader2, Plus, Save, Trash2,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ServiceCatalogPicker from '@/components/ServiceCatalogPicker';
import type { CatalogService } from '@/hooks/useServiceCatalog';
import {
  useDeleteServiceSteps,
  useSaveServiceSteps,
  useServiceStepTemplate,
  useServiceStepTemplates,
} from '@/hooks/useServiceSteps';

/* ── Draft rows ─────────────────────────────────────────────────────────────
 *
 * Steps are edited as a local draft and saved in one go, so reordering and
 * renaming several at once costs a single request.
 */

interface DraftStep {
  /** Local-only key — the server re-derives `order` from array position. */
  key: string;
  title: string;
  description: string;
}

const newStep = (): DraftStep => ({
  key: `step-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  title: '',
  description: '',
});

const ServiceStepsPage = () => {
  const [selected, setSelected] = useState<CatalogService | null>(null);
  const [draft, setDraft] = useState<DraftStep[]>([]);
  const [dirty, setDirty] = useState(false);

  const { data: templates = [], isLoading: templatesLoading } = useServiceStepTemplates();
  const { data: template, isFetching: templateLoading } = useServiceStepTemplate(selected?.slug);
  const saveSteps = useSaveServiceSteps();
  const deleteSteps = useDeleteServiceSteps();

  // Clear draft when selection changes so we don't accidentally keep the previous
  // service's dirty state when switching services.
  useEffect(() => {
    setDirty(false);
    if (!selected) {
      setDraft([]);
    }
  }, [selected?.slug]);

  // Load the saved checklist. Local edits win until they're saved or the selection changes.
  useEffect(() => {
    if (!selected || templateLoading || dirty) return;

    setDraft(
      (template?.steps ?? []).map((step, index) => ({
        key: `saved-${index}`,
        title: step.title,
        description: step.description ?? '',
      }))
    );
  }, [selected?.slug, template, templateLoading, dirty]);

  const configuredSlugs = useMemo(
    () => new Set(templates.map((t) => t.serviceSlug)),
    [templates]
  );

  const updateStep = (key: string, field: 'title' | 'description', value: string) => {
    setDraft((current) => current.map((step) => (step.key === key ? { ...step, [field]: value } : step)));
    setDirty(true);
  };

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= draft.length) return;
    setDraft((current) => {
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
    setDirty(true);
  };

  const removeStep = (key: string) => {
    setDraft((current) => current.filter((step) => step.key !== key));
    setDirty(true);
  };

  const addStep = () => {
    setDraft((current) => [...current, newStep()]);
    setDirty(true);
  };

  const handleSave = () => {
    if (!selected) return;

    const steps = draft
      .map((step, index) => ({
        title: step.title.trim(),
        description: step.description.trim() || undefined,
        order: index,
      }))
      .filter((step) => step.title);

    if (steps.length === 0) {
      toast.error('Add at least one step before saving.');
      return;
    }

    saveSteps.mutate(
      { serviceSlug: selected.slug, serviceTitle: selected.title, steps },
      {
        onSuccess: () => {
          setDirty(false);
          toast.success(`Saved ${steps.length} step${steps.length === 1 ? '' : 's'} for ${selected.title}.`);
        },
        onError: (err: Error) => toast.error(err?.message || 'Failed to save steps.'),
      }
    );
  };

  const handleDelete = () => {
    if (!selected) return;
    deleteSteps.mutate(selected.slug, {
      onSuccess: () => {
        setDraft([]);
        setDirty(false);
        toast.success(`Removed the checklist for ${selected.title}.`);
      },
      onError: (err: Error) => toast.error(err?.message || 'Failed to remove the checklist.'),
    });
  };

  return (
    <div className="space-y-5">
      {/* ── Intro ───────────────────────────────────────────────────────────── */}
      <div className="bg-card border border-border rounded-lg px-5 py-4">
        <h2 className="text-base font-semibold text-foreground">Service Steps</h2>
        <p className="text-sm text-muted-foreground mt-1 max-w-3xl">
          Define the steps each service goes through. When that service is assigned to an
          employee from a lead, these steps preload into the assign screen — the admin ticks off
          whatever is already done, and the rest becomes the employee's checklist.
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          {templatesLoading
            ? 'Loading configured services…'
            : `${templates.length} service${templates.length === 1 ? '' : 's'} configured.`}
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] items-start">
        {/* ── Pick a service ────────────────────────────────────────────────── */}
        <div className="bg-card border border-border rounded-lg p-4">
          <Label className="mb-3 block">Service</Label>
          <ServiceCatalogPicker
            selectedSlug={selected?.slug ?? ''}
            onSelect={setSelected}
            height="h-[520px]"
            clearable
          />
        </div>

        {/* ── Edit its steps ────────────────────────────────────────────────── */}
        <div className="bg-card border border-border rounded-lg p-4 min-h-[400px]">
          {!selected ? (
            <div className="h-[520px] flex flex-col items-center justify-center text-center gap-2">
              <p className="text-sm font-medium text-foreground">Pick a service to set up its steps</p>
              <p className="text-xs text-muted-foreground max-w-xs">
                Services with a checklist already configured are marked below.
              </p>
              {templates.length > 0 && (
                <div className="flex flex-wrap gap-1.5 justify-center mt-3 max-w-md">
                  {templates.map((t) => (
                    <span
                      key={t.serviceSlug}
                      className="inline-flex items-center gap-1 text-[11px] rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 px-2 py-0.5"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      {t.serviceTitle ?? t.serviceSlug} · {t.steps.length}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-border">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{selected.title}</p>
                  <p className="text-xs text-muted-foreground">{selected.category}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {configuredSlugs.has(selected.slug) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDelete}
                      disabled={deleteSteps.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                      Clear
                    </Button>
                  )}
                  <Button size="sm" onClick={handleSave} disabled={!dirty || saveSteps.isPending}>
                    {saveSteps.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save
                  </Button>
                </div>
              </div>

              {templateLoading ? (
                <div className="py-16 text-center text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                  Loading steps…
                </div>
              ) : (
                <div className="pt-3 space-y-2">
                  {draft.length === 0 && (
                    <p className="text-sm text-muted-foreground py-8 text-center">
                      No steps yet. Add the first one below.
                    </p>
                  )}

                  {draft.map((step, index) => (
                    <div
                      key={step.key}
                      className="rounded-md border border-border bg-muted/20 px-3 py-2.5 flex items-start gap-2"
                    >
                      <div className="flex flex-col items-center pt-1.5 shrink-0">
                        <GripVertical className="w-3.5 h-3.5 text-muted-foreground/50" />
                        <span className="text-[11px] font-semibold text-muted-foreground mt-1">{index + 1}</span>
                      </div>

                      <div className="flex-1 min-w-0 space-y-2">
                        <Input
                          value={step.title}
                          onChange={(e) => updateStep(step.key, 'title', e.target.value)}
                          placeholder={`Step ${index + 1} — e.g. Collect PAN and Aadhaar`}
                        />
                        <Input
                          value={step.description}
                          onChange={(e) => updateStep(step.key, 'description', e.target.value)}
                          placeholder="Optional note for whoever does this step"
                          className="text-xs"
                        />
                      </div>

                      <div className="flex flex-col gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => move(index, -1)}
                          disabled={index === 0}
                          className="h-6 w-6 rounded border border-border bg-card flex items-center justify-center text-muted-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Move up"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => move(index, 1)}
                          disabled={index === draft.length - 1}
                          className="h-6 w-6 rounded border border-border bg-card flex items-center justify-center text-muted-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Move down"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeStep(step.key)}
                          className="h-6 w-6 rounded border border-border bg-card flex items-center justify-center text-destructive hover:bg-destructive/10"
                          title="Remove step"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}

                  <Button variant="outline" size="sm" onClick={addStep} className="w-full">
                    <Plus className="w-4 h-4" />
                    Add step
                  </Button>

                  {dirty && (
                    <p className="text-[11px] text-amber-700 pt-1">
                      Unsaved changes — hit Save to apply them to future assignments.
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceStepsPage;
