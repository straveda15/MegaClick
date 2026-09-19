import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  useCreateCatalogService,
  useServiceCatalog,
  useUpdateCatalogService,
  type CatalogService,
} from '@/hooks/useServiceCatalog';

const MAX_TITLE_LENGTH = 100;

interface AddServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Pass a service to edit it; leave empty to add a new one. */
  service?: CatalogService | null;
  /** Called with the saved service, so the caller can select it straight away. */
  onSaved?: (service: CatalogService) => void;
}

/**
 * Adds a service to the shared catalog, or edits one already in it. Once saved
 * it is offered by every service dropdown — Add Lead, Add Client and the
 * Service Steps picker read the same catalog — so nothing else needs telling.
 */
export function AddServiceDialog({ open, onOpenChange, service, onSaved }: AddServiceDialogProps) {
  const isEdit = Boolean(service);
  const [title, setTitle] = useState('');
  const [categorySlug, setCategorySlug] = useState('');

  const { data: catalog } = useServiceCatalog();
  const createService = useCreateCatalogService();
  const updateService = useUpdateCatalogService();
  const mutation = isEdit ? updateService : createService;
  const categories = catalog?.categories ?? [];

  // Each opening starts from the service being edited, or blank for a new one;
  // the dialog stays mounted between uses.
  useEffect(() => {
    if (!open) return;
    setTitle(service?.title ?? '');
    setCategorySlug(service?.categorySlug ?? '');
    createService.reset();
    updateService.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, service?.slug]);

  const trimmed = title.replace(/\s+/g, ' ').trim();
  const unchanged = isEdit && trimmed === service?.title && categorySlug === service?.categorySlug;
  const canSubmit = trimmed.length > 0 && categorySlug !== '' && !unchanged && !mutation.isPending;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;

    const callbacks = {
      onSuccess: (saved: CatalogService) => {
        toast.success(isEdit ? `Updated "${saved.title}".` : `Added "${saved.title}" to the services list.`);
        onOpenChange(false);
        onSaved?.(saved);
      },
      onError: (err: Error) =>
        toast.error(err.message || (isEdit ? 'Could not update the service.' : 'Could not add the service.')),
    };

    if (service) {
      updateService.mutate({ slug: service.slug, title: trimmed, categorySlug }, callbacks);
    } else {
      createService.mutate({ title: trimmed, categorySlug }, callbacks);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>{isEdit ? 'Edit service' : 'New service'}</DialogTitle>
            <DialogDescription>
              {isEdit
                ? 'Its steps stay as they are. Leads and clients that already have this service keep the name they were added with.'
                : 'It will appear in the service list when adding a lead or a client. Set up its steps right after.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-1.5">
            <Label htmlFor="new-service-title">Service name</Label>
            <Input
              id="new-service-title"
              autoFocus
              value={title}
              maxLength={MAX_TITLE_LENGTH}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Trade Licence Renewal"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Category</Label>
            <Select value={categorySlug} onValueChange={setCategorySlug}>
              <SelectTrigger>
                <SelectValue placeholder={catalog ? 'Select a category' : 'Loading categories…'} />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.slug} value={category.slug}>{category.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!canSubmit}>
              {mutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {isEdit ? 'Save changes' : 'Add service'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddServiceDialog;
