import type { ReactNode } from 'react';

export interface ListCardProps {
  title: string;
  items: ReactNode[];
  emptyLabel?: string;
  footerAction?: { label: string; onClick: () => void };
}

const ListCard = ({ title, items, emptyLabel = 'Nothing to show', footerAction }: ListCardProps) => (
  <div className="kpi-card !p-0 flex flex-col">
    <div className="flex items-center justify-between px-5 pt-5 pb-3">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      {footerAction && (
        <button
          type="button"
          onClick={footerAction.onClick}
          className="text-xs font-medium text-primary hover:underline"
        >
          {footerAction.label}
        </button>
      )}
    </div>
    <div className="flex-1 divide-y divide-border">
      {items.length === 0 ? (
        <p className="px-5 py-6 text-sm text-muted-foreground text-center">{emptyLabel}</p>
      ) : (
        items.map((item, idx) => <div key={idx} className="px-5 py-3">{item}</div>)
      )}
    </div>
  </div>
);

export default ListCard;
