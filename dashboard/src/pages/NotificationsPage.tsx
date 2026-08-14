import { useState } from 'react';
import { format } from 'date-fns';
import { UserPlus, ListChecks, Users, Bell, Zap, Check, CheckCheck, Filter } from 'lucide-react';
import { MOCK_NOTIFICATIONS, type NotificationType } from '@/data/mockNotifications';
import { toast } from 'sonner';

const TYPE_META: Record<NotificationType, { icon: typeof Bell; bg: string; text: string; label: string }> = {
  lead:    { icon: UserPlus,   bg: 'bg-blue-100',    text: 'text-blue-600',    label: 'Lead'    },
  task:    { icon: ListChecks, bg: 'bg-amber-100',   text: 'text-amber-600',   label: 'Task'    },
  client:  { icon: Users,      bg: 'bg-emerald-100', text: 'text-emerald-600', label: 'Client'  },
  service: { icon: Zap,        bg: 'bg-purple-100',  text: 'text-purple-600',  label: 'Service' },
  system:  { icon: Bell,       bg: 'bg-gray-100',    text: 'text-gray-500',    label: 'System'  },
};

const FILTERS: Array<{ key: 'all' | NotificationType; label: string }> = [
  { key: 'all',     label: 'All'      },
  { key: 'lead',    label: 'Leads'    },
  { key: 'task',    label: 'Tasks'    },
  { key: 'client',  label: 'Clients'  },
  { key: 'service', label: 'Services' },
  { key: 'system',  label: 'System'   },
];

const NotificationsPage = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | NotificationType>('all');
  const [items, setItems]               = useState(MOCK_NOTIFICATIONS);

  const unreadCount = items.filter((n) => !n.read).length;

  const filtered = activeFilter === 'all'
    ? items
    : items.filter((n) => n.type === activeFilter);

  const markAllRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success('All notifications marked as read.');
  };

  const markRead = (id: string) => setItems((prev) =>
    prev.map((n) => n.id === id ? { ...n, read: true } : n)
  );

  return (
    <div className="space-y-5 max-w-3xl">

      {/* ── Header row ────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-foreground">Notifications</h1>
          {unreadCount > 0 && (
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-[11px] font-bold">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-1.5 text-sm text-blue-600 font-medium hover:text-blue-700 transition-colors"
          >
            <CheckCheck className="w-4 h-4" />
            Mark all read
          </button>
        )}
      </div>

      {/* ── Filter tabs ───────────────────────────────────────────────────── */}
      <div className="flex items-center gap-1 flex-wrap">
        <Filter className="w-3.5 h-3.5 text-muted-foreground shrink-0 mr-1" />
        {FILTERS.map(({ key, label }) => {
          const count = key === 'all'
            ? items.filter((n) => !n.read).length
            : items.filter((n) => n.type === key && !n.read).length;
          const active = activeFilter === key;
          return (
            <button
              key={key}
              onClick={() => setActiveFilter(key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                active
                  ? 'bg-blue-600 text-white'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
              }`}
            >
              {label}
              {count > 0 && (
                <span className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold ${
                  active ? 'bg-white/20 text-white' : 'bg-blue-600 text-white'
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── List ──────────────────────────────────────────────────────────── */}
      <div className="bg-card border border-border rounded-lg overflow-hidden divide-y divide-border">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-2">
            <Bell className="w-8 h-8 opacity-30" />
            <p className="text-sm">No notifications here.</p>
          </div>
        ) : (
          filtered.map((n) => {
            const meta = TYPE_META[n.type];
            const Icon = meta.icon;
            return (
              <div
                key={n.id}
                className={`flex items-start gap-4 px-5 py-4 transition-colors ${
                  !n.read ? 'bg-blue-50/40' : 'hover:bg-muted/20'
                }`}
              >
                {/* Icon bubble */}
                <div className={`w-10 h-10 rounded-full ${meta.bg} ${meta.text} flex items-center justify-center shrink-0 mt-0.5`}>
                  <Icon className="w-4.5 h-4.5" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className={`text-sm font-semibold leading-snug ${n.read ? 'text-foreground' : 'text-foreground'}`}>
                          {n.title}
                        </p>
                        {!n.read && (
                          <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                        )}
                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold ${meta.bg} ${meta.text}`}>
                          {meta.label}
                        </span>
                        {n.tag && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-muted text-muted-foreground">
                            {n.tag}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5 leading-snug">{n.body}</p>
                      <p className="text-[11px] text-muted-foreground/60 mt-1.5">
                        {format(new Date(n.timestamp), "MMM d, yyyy '·' h:mm a")}
                      </p>
                    </div>

                    {/* Mark-read button */}
                    {!n.read && (
                      <button
                        onClick={() => markRead(n.id)}
                        title="Mark as read"
                        className="shrink-0 mt-0.5 p-1.5 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
