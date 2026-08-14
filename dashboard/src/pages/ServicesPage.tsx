import { useEffect, useMemo, useState } from 'react';
import { Search, ChevronUp, ChevronDown, ChevronsUpDown, Loader2, RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  MOCK_SERVICES,
  STAGE_LABELS,
  STAGE_STYLES,
  PRIORITY_STYLES,
  STATUS_STYLES,
  type Service,
  type ServiceStage,
  type ServicePriority,
} from '@/data/mockServices';
import { useServiceCatalog, type CatalogService } from '@/hooks/useServiceCatalog';
import { useCreateManualTask, useMyTasks, type Task } from '@/hooks/useTasks';
import { useTeam } from '@/hooks/useTeam';
import { useAuth } from '@/context/AuthContext';

/* ── KPI stage order ────────────────────────────────────────────────────────── */
const KPI_STAGES: ServiceStage[] = [
  'documents_pending',
  'documents_received',
  'application_submitted',
  'government_verification',
  'approval_received',
  'certificate_ready',
  'completed',
];

/* ── Sort icon ──────────────────────────────────────────────────────────────── */
type SortKey = keyof Service | null;
type SortDir  = 'asc' | 'desc';

type AssignServiceForm = {
  client: string;
  assignedToId: string;
  deadline: string;
  priority: ServicePriority;
};

const formatDateInput = (date: Date) => {
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

const todayDateInput = () => formatDateInput(new Date());

const defaultDeadline = () => {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return formatDateInput(date);
};

const makeInitials = (name: string) => {
  const initials = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  return initials || 'CL';
};

const parseServiceTaskDescription = (description?: string) => {
  if (!description) return null;

  const lines = description.split('\n');
  if (lines[0] === 'Service request') {
    const client = lines.find((line) => line.startsWith('Client: '))?.replace('Client: ', '').trim();
    const category = lines.find((line) => line.startsWith('Category: '))?.replace('Category: ', '').trim();
    return client ? { client, category: category || 'Service' } : null;
  }

  const legacy = description.match(/^Service requested by (.+?)\. Category: (.+?)\./);
  return legacy ? { client: legacy[1].trim(), category: legacy[2].trim() } : null;
};

const taskPriorityToServicePriority = (priority?: Task['priority']): ServicePriority => {
  switch (priority) {
    case 'low': return 'Low';
    case 'high': return 'High';
    case 'urgent':
    case 'critical': return 'Urgent';
    default: return 'Medium';
  }
};

const taskStatusToServiceStage = (status: Task['status']): ServiceStage => {
  switch (status) {
    case 'completed': return 'completed';
    case 'in_progress': return 'application_submitted';
    case 'cancelled': return 'documents_pending';
    default: return 'documents_pending';
  }
};

const taskStatusToServiceStatus = (status: Task['status']): Service['status'] => {
  switch (status) {
    case 'completed': return 'Completed';
    case 'cancelled': return 'Rejected';
    default: return 'In Progress';
  }
};

const taskStatusToProgress = (status: Task['status']) => {
  switch (status) {
    case 'completed': return 100;
    case 'in_progress': return 43;
    case 'cancelled': return 0;
    default: return 14;
  }
};

function SortIcon({ col, sortKey, sortDir }: { col: SortKey; sortKey: SortKey; sortDir: SortDir }) {
  if (sortKey !== col) return <ChevronsUpDown className="w-3 h-3 text-muted-foreground/40 ml-1 shrink-0" />;
  return sortDir === 'asc'
    ? <ChevronUp className="w-3 h-3 text-primary ml-1 shrink-0" />
    : <ChevronDown className="w-3 h-3 text-primary ml-1 shrink-0" />;
}

/* ── Progress bar ───────────────────────────────────────────────────────────── */
function ProgressBar({ value }: { value: number }) {
  const color =
    value === 100 ? 'bg-emerald-500' :
    value >= 70   ? 'bg-blue-600'    :
    value >= 40   ? 'bg-blue-500'    :
                    'bg-blue-400';

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden min-w-[90px]">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-xs text-muted-foreground w-8 text-right shrink-0">{value}%</span>
    </div>
  );
}

const ServicesPage = () => {
  const [query,   setQuery]   = useState('');
  const [sortKey, setSortKey] = useState<SortKey>(null);
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [assignOpen, setAssignOpen] = useState(false);
  const [catalogQuery, setCatalogQuery] = useState('');
  const [selectedServiceSlug, setSelectedServiceSlug] = useState('');
  const [assignForm, setAssignForm] = useState<AssignServiceForm>({
    client: '',
    assignedToId: '',
    deadline: defaultDeadline(),
    priority: 'Medium',
  });
  const {
    data: serviceCatalog,
    isLoading: catalogLoading,
    isError: catalogIsError,
    error: catalogError,
    refetch: refetchCatalog,
  } = useServiceCatalog();
  const { data: team = [], isLoading: teamLoading } = useTeam();
  const { user } = useAuth();
  const createTask = useCreateManualTask();
  const { data: serviceTasks = [] } = useMyTasks({
    type: 'manual',
    view: user?.role === 'admin' ? 'all' : undefined,
  });

  useEffect(() => {
    const openModal = () => setAssignOpen(true);
    window.addEventListener('openAssignServiceModal', openModal);
    return () => window.removeEventListener('openAssignServiceModal', openModal);
  }, []);

  const handleSort = (key: keyof Service) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('asc'); }
  };

  const persistedServiceRows = useMemo(() =>
    serviceTasks.flatMap((task) => {
      const serviceDetails = parseServiceTaskDescription(task.description);
      if (!serviceDetails) return [];

      const assigneeName = [task.assignedTo?.name, task.assignedTo?.lastName]
        .filter(Boolean)
        .join(' ') || 'Unassigned';

      return [{
        id: `SV-${task._id.slice(-5).toUpperCase()}`,
        client: serviceDetails.client,
        clientInitials: makeInitials(serviceDetails.client),
        name: task.title,
        assignedTo: assigneeName,
        stage: taskStatusToServiceStage(task.status),
        progress: taskStatusToProgress(task.status),
        deadline: task.dueAt ? formatDateInput(new Date(task.dueAt)) : '',
        priority: taskPriorityToServicePriority(task.priority),
        status: taskStatusToServiceStatus(task.status),
      } satisfies Service];
    }),
  [serviceTasks]);

  const services = useMemo(
    () => [...persistedServiceRows, ...MOCK_SERVICES],
    [persistedServiceRows]
  );

  /* KPI counts */
  const stageCounts = useMemo(() =>
    KPI_STAGES.reduce((acc, stage) => {
      acc[stage] = services.filter((s) => s.stage === stage).length;
      return acc;
    }, {} as Record<ServiceStage, number>),
  [services]);

  /* Filtered + sorted rows */
  const rows = useMemo(() => {
    const q = query.toLowerCase();
    let list = services.filter((s) =>
      !q ||
      s.client.toLowerCase().includes(q) ||
      s.name.toLowerCase().includes(q) ||
      s.id.toLowerCase().includes(q) ||
      s.assignedTo.toLowerCase().includes(q)
    );
    if (sortKey) {
      list = [...list].sort((a, b) => {
        const cmp = String(a[sortKey] ?? '').localeCompare(String(b[sortKey] ?? ''), undefined, { numeric: true });
        return sortDir === 'asc' ? cmp : -cmp;
      });
    }
    return list;
  }, [services, query, sortKey, sortDir]);

  const catalogServices = serviceCatalog?.services ?? [];

  const filteredCatalogServices = useMemo(() => {
    const q = catalogQuery.trim().toLowerCase();
    if (!q) return catalogServices;

    return catalogServices.filter((service) =>
      service.title.toLowerCase().includes(q) ||
      service.category.toLowerCase().includes(q)
    );
  }, [catalogServices, catalogQuery]);

  const selectedCatalogService = useMemo(
    () => catalogServices.find((service) => service.slug === selectedServiceSlug) ?? null,
    [catalogServices, selectedServiceSlug]
  );

  const activeEmployees = useMemo(() =>
    team.filter((employee) => employee.status !== 'inactive' && employee.userId?._id && employee.userId?.isActive !== false),
  [team]);

  const selectedEmployee = useMemo(() =>
    activeEmployees.find((employee) => String(employee.userId?._id) === assignForm.assignedToId) ?? null,
  [activeEmployees, assignForm.assignedToId]);

  const selectedEmployeeName = selectedEmployee
    ? [selectedEmployee.userId?.name, selectedEmployee.userId?.lastName].filter(Boolean).join(' ') || 'Selected employee'
    : '';

  const updateAssignForm = <K extends keyof AssignServiceForm>(field: K, value: AssignServiceForm[K]) => {
    setAssignForm((current) => ({ ...current, [field]: value }));
  };

  const resetAssignForm = () => {
    setCatalogQuery('');
    setSelectedServiceSlug('');
    setAssignForm({
      client: '',
      assignedToId: '',
      deadline: defaultDeadline(),
      priority: 'Medium',
    });
  };

  const handleAssignService = () => {
    if (!selectedCatalogService) {
      toast.error('Select a service from the website catalog.');
      return;
    }

    const client = assignForm.client.trim();

    if (!client || !assignForm.assignedToId || !selectedEmployee) {
      toast.error('Client and assignee are required.');
      return;
    }

    if (!assignForm.deadline || assignForm.deadline < todayDateInput()) {
      toast.error('Deadline cannot be in the past.');
      return;
    }

    const dueAt = new Date(`${assignForm.deadline}T23:59:00`).toISOString();

    createTask.mutate(
      {
        title: selectedCatalogService.title,
        description: `Service request` + '\n' + `Client: ${client}` + '\n' + `Category: ${selectedCatalogService.category}`,
        priority: assignForm.priority.toLowerCase(),
        dueAt,
        assignedTo: assignForm.assignedToId,
        type: 'manual',
      },
      {
        onSuccess: () => {
          setAssignOpen(false);
          resetAssignForm();
          toast.success(`${selectedCatalogService.title} assigned to ${client}. Task created.`);
        },
        onError: (error: any) => {
          toast.error(error?.message || 'Failed to assign service.');
        },
      }
    );
  };

  const thBase = 'px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground whitespace-nowrap select-none';
  const thSort = `${thBase} cursor-pointer hover:text-foreground transition-colors`;

  return (
    <div className="space-y-5">

      {/* ── KPI strip ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {KPI_STAGES.map((stage) => {
          const ss = STAGE_STYLES[stage];
          return (
            <div
              key={stage}
              className="bg-card border border-border rounded-lg px-4 py-3 flex flex-col gap-1 hover:shadow-sm transition-shadow"
            >
              <span className={`text-[10px] font-semibold leading-tight ${ss.text}`}>
                {STAGE_LABELS[stage]}
              </span>
              <span className="text-2xl font-bold text-foreground leading-none mt-1">
                {stageCounts[stage]}
              </span>
            </div>
          );
        })}
      </div>

      {/* ── Search ──────────────────────────────────────────────────────────── */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search services…"
          className="w-full h-9 pl-9 pr-3 rounded-md border border-border bg-card text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </div>

      {/* ── Table ───────────────────────────────────────────────────────────── */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 border-b border-border">
              <tr>
                <th className={thSort} onClick={() => handleSort('id')}>
                  <span className="flex items-center">Service ID <SortIcon col="id" sortKey={sortKey} sortDir={sortDir} /></span>
                </th>
                <th className={thSort} onClick={() => handleSort('client')}>
                  <span className="flex items-center">Client <SortIcon col="client" sortKey={sortKey} sortDir={sortDir} /></span>
                </th>
                <th className={thSort} onClick={() => handleSort('name')}>
                  <span className="flex items-center">Service <SortIcon col="name" sortKey={sortKey} sortDir={sortDir} /></span>
                </th>
                <th className={thSort} onClick={() => handleSort('assignedTo')}>
                  <span className="flex items-center">Assigned <SortIcon col="assignedTo" sortKey={sortKey} sortDir={sortDir} /></span>
                </th>
                <th className={thSort} onClick={() => handleSort('stage')}>
                  <span className="flex items-center">Current Stage <SortIcon col="stage" sortKey={sortKey} sortDir={sortDir} /></span>
                </th>
                <th className={thBase} style={{ minWidth: 160 }}>Progress</th>
                <th className={thSort} onClick={() => handleSort('deadline')}>
                  <span className="flex items-center">Deadline <SortIcon col="deadline" sortKey={sortKey} sortDir={sortDir} /></span>
                </th>
                <th className={thSort} onClick={() => handleSort('priority')}>
                  <span className="flex items-center">Priority <SortIcon col="priority" sortKey={sortKey} sortDir={sortDir} /></span>
                </th>
                <th className={thSort} onClick={() => handleSort('status')}>
                  <span className="flex items-center">Status <SortIcon col="status" sortKey={sortKey} sortDir={sortDir} /></span>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-16 text-muted-foreground text-sm">
                    No services match your search.
                  </td>
                </tr>
              ) : (
                rows.map((svc) => {
                  const stageStyle    = STAGE_STYLES[svc.stage];
                  const priorityStyle = PRIORITY_STYLES[svc.priority];
                  const statusStyle   = STATUS_STYLES[svc.status];

                  return (
                    <tr key={svc.id} className="hover:bg-muted/30 transition-colors">

                      {/* Service ID */}
                      <td className="px-4 py-3 text-muted-foreground text-xs font-medium whitespace-nowrap">
                        {svc.id}
                      </td>

                      {/* Client */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold shrink-0">
                            {svc.clientInitials}
                          </div>
                          <span className="font-semibold text-foreground text-sm">{svc.client}</span>
                        </div>
                      </td>

                      {/* Service name */}
                      <td className="px-4 py-3 whitespace-nowrap text-foreground text-sm">
                        {svc.name}
                      </td>

                      {/* Assigned */}
                      <td className="px-4 py-3 whitespace-nowrap text-foreground text-sm">
                        {svc.assignedTo}
                      </td>

                      {/* Current Stage */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stageStyle.bg} ${stageStyle.text}`}>
                          {STAGE_LABELS[svc.stage]}
                        </span>
                      </td>

                      {/* Progress */}
                      <td className="px-4 py-3" style={{ minWidth: 160 }}>
                        <ProgressBar value={svc.progress} />
                      </td>

                      {/* Deadline */}
                      <td className="px-4 py-3 whitespace-nowrap text-foreground text-sm">
                        {svc.deadline}
                      </td>

                      {/* Priority */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityStyle.bg} ${priorityStyle.text}`}>
                          {svc.priority}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                          {svc.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        {rows.length > 0 && (
          <div className="px-4 py-3 border-t border-border bg-muted/20">
            <span className="text-xs text-muted-foreground">
              Showing {rows.length} of {services.length} services
            </span>
          </div>
        )}
      </div>

      <Dialog
        open={assignOpen}
        onOpenChange={(open) => {
          setAssignOpen(open);
          if (!open) resetAssignForm();
        }}
      >
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle>Assign Service</DialogTitle>
            <DialogDescription>
              Select a service from the website catalog and assign it to a client.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-0 md:grid-cols-[minmax(0,1.08fr)_minmax(280px,0.92fr)]">
            <div className="border-y md:border-r md:border-y-0 border-border p-4">
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                  value={catalogQuery}
                  onChange={(e) => setCatalogQuery(e.target.value)}
                  placeholder="Search website services"
                  className="pl-9"
                />
              </div>

              <div className="h-[360px] overflow-y-auto pr-1 space-y-2">
                {catalogLoading ? (
                  <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Loading services
                  </div>
                ) : catalogIsError ? (
                  <div className="h-full flex flex-col items-center justify-center gap-3 text-center">
                    <p className="text-sm text-destructive">
                      {catalogError instanceof Error ? catalogError.message : 'Failed to load services.'}
                    </p>
                    <Button variant="outline" size="sm" onClick={() => refetchCatalog()}>
                      <RefreshCcw className="w-4 h-4" />
                      Retry
                    </Button>
                  </div>
                ) : filteredCatalogServices.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-12">
                    No website services match your search.
                  </p>
                ) : (
                  filteredCatalogServices.map((service: CatalogService) => {
                    const selected = selectedServiceSlug === service.slug;

                    return (
                      <button
                        key={`${service.categorySlug}-${service.slug}`}
                        type="button"
                        onClick={() => setSelectedServiceSlug(service.slug)}
                        className={`w-full text-left rounded-md border px-3 py-2.5 transition-colors ${
                          selected
                            ? 'border-blue-500 bg-blue-50 text-blue-950'
                            : 'border-border bg-card hover:bg-muted/50 text-foreground'
                        }`}
                      >
                        <span className="flex items-start justify-between gap-3">
                          <span className="min-w-0">
                            <span className="block text-sm font-semibold leading-5 truncate">
                              {service.title}
                            </span>
                            <span className="block text-xs text-muted-foreground mt-0.5 truncate">
                              {service.category}
                            </span>
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

            <div className="p-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="assign-client">Client</Label>
                <Input
                  id="assign-client"
                  value={assignForm.client}
                  onChange={(e) => updateAssignForm('client', e.target.value)}
                  placeholder="Client name"
                />
              </div>

              <div className="space-y-2">
                <Label>Assigned To</Label>
                <Select
                  value={assignForm.assignedToId}
                  onValueChange={(value) => updateAssignForm('assignedToId', value)}
                  disabled={teamLoading || activeEmployees.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={teamLoading ? 'Loading employees...' : 'Select employee'} />
                  </SelectTrigger>
                  <SelectContent>
                    {activeEmployees.map((employee) => {
                      const employeeId = String(employee.userId?._id);
                      const employeeName = [employee.userId?.name, employee.userId?.lastName].filter(Boolean).join(' ') || 'Unnamed employee';
                      const employeeMeta = employee.designation || employee.department || 'Employee';

                      return (
                        <SelectItem key={employeeId} value={employeeId}>
                          {employeeName} - {employeeMeta}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                {!teamLoading && activeEmployees.length === 0 && (
                  <p className="text-xs text-muted-foreground">No active employees available.</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="assign-deadline">Deadline</Label>
                  <Input
                    id="assign-deadline"
                    type="date"
                    min={todayDateInput()}
                    value={assignForm.deadline}
                    onChange={(e) => updateAssignForm('deadline', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select
                    value={assignForm.priority}
                    onValueChange={(value) => updateAssignForm('priority', value as ServicePriority)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="rounded-md border border-border bg-muted/30 px-3 py-3 min-h-[78px]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
                  Selected Service
                </p>
                {selectedCatalogService ? (
                  <div className="mt-2">
                    <p className="text-sm font-semibold text-foreground">{selectedCatalogService.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{selectedCatalogService.category}</p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground mt-2">No service selected.</p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="px-6 pb-6">
            <Button variant="outline" onClick={() => setAssignOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAssignService}
              disabled={!selectedCatalogService || !assignForm.client.trim() || !assignForm.assignedToId || !selectedEmployee || createTask.isPending}
            >
              {createTask.isPending ? 'Assigning...' : 'Assign Service'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServicesPage;
