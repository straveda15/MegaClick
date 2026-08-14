import { useMemo, useState } from 'react';
import { Loader2, RefreshCcw, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useServiceCatalog, type CatalogService } from '@/hooks/useServiceCatalog';

interface ServiceCatalogPickerProps {
  selectedSlug: string;
  onSelect: (service: CatalogService | null) => void;
  /** Tailwind height class for the scroll area. */
  height?: string;
  /** Shows a "clear selection" control when a service is picked. */
  clearable?: boolean;
}

/**
 * Searchable list of the services published on the website. Shared by "Add
 * Lead" and "Create Task" so both pick from exactly the same catalog and store
 * the same slug/category alongside the title.
 */
export function ServiceCatalogPicker({
  selectedSlug,
  onSelect,
  height = 'h-[360px]',
  clearable = false,
}: ServiceCatalogPickerProps) {
  const [query, setQuery] = useState('');
  const { data, isLoading, isError, error, refetch } = useServiceCatalog();

  const services = data?.services ?? [];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return services;
    return services.filter((s) =>
      s.title.toLowerCase().includes(q) || s.category.toLowerCase().includes(q)
    );
  }, [services, query]);

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search website services"
            className="pl-9"
          />
        </div>
        {clearable && selectedSlug && (
          <button
            type="button"
            onClick={() => onSelect(null)}
            className="shrink-0 flex items-center gap-1 h-9 px-2.5 rounded-md border border-border text-xs text-muted-foreground hover:bg-muted transition-colors"
            title="Clear selected service"
          >
            <X className="w-3.5 h-3.5" />
            Clear
          </button>
        )}
      </div>

      <div className={`${height} overflow-y-auto pr-1 space-y-2`}>
        {isLoading ? (
          <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            Loading services
          </div>
        ) : isError ? (
          <div className="h-full flex flex-col items-center justify-center gap-3 text-center">
            <p className="text-sm text-destructive">
              {error instanceof Error ? error.message : 'Failed to load services.'}
            </p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCcw className="w-4 h-4" />
              Retry
            </Button>
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-12">
            No website services match your search.
          </p>
        ) : (
          filtered.map((service: CatalogService) => {
            const selected = selectedSlug === service.slug;

            return (
              <button
                key={`${service.categorySlug}-${service.slug}`}
                type="button"
                onClick={() => onSelect(service)}
                className={`w-full text-left rounded-md border px-3 py-2.5 transition-colors ${
                  selected
                    ? 'border-blue-500 bg-blue-50 text-blue-950'
                    : 'border-border bg-card hover:bg-muted/50 text-foreground'
                }`}
              >
                <span className="flex items-start justify-between gap-3">
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold leading-5 truncate">{service.title}</span>
                    <span className="block text-xs text-muted-foreground mt-0.5 truncate">{service.category}</span>
                  </span>
                  <span className="text-[11px] rounded-full bg-muted px-2 py-0.5 text-muted-foreground shrink-0">
                    {service.categorySlug.replace(/-/g, ' ')}
                  </span>
                </span>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

export default ServiceCatalogPicker;
