import {
  Landmark,
  Scale,
  Wallet,
  Home,
  Building2,
  Megaphone,
  LifeBuoy,
  ClipboardList,
  Crown
} from 'lucide-react';
import { MOCK_DEPARTMENTS } from '@/data/mockDepartments';

const ICON_MAP: Record<string, React.ElementType> = {
  Landmark,
  Scale,
  Wallet,
  Home,
  Building2,
  Megaphone,
  LifeBuoy,
  ClipboardList,
  Crown
};

const DepartmentsPage = () => {
  return (
    <div className="py-2">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {MOCK_DEPARTMENTS.map((dept) => {
          const Icon = ICON_MAP[dept.iconName] || Landmark;
          return (
            <div
              key={dept.id}
              className="bg-card border border-border rounded-[14px] p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]"
            >
              {/* Header */}
              <div className="flex items-center gap-3.5 mb-5">
                <div className="w-12 h-12 rounded-xl bg-blue-50/70 flex items-center justify-center shrink-0">
                  <Icon className="w-[22px] h-[22px] text-blue-500" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-foreground leading-tight">
                    {dept.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {dept.headcount} team members
                  </p>
                </div>
              </div>

              {/* Stats row */}
              <div className="flex gap-2 mb-5">
                <div className="flex-1 bg-slate-50 dark:bg-muted/40 rounded-lg py-3 text-center">
                  <div className="text-[17px] font-bold text-foreground leading-none">
                    {dept.headcount}
                  </div>
                  <div className="text-[9px] font-semibold uppercase tracking-[0.05em] text-muted-foreground mt-1.5">
                    MEMBERS
                  </div>
                </div>
                <div className="flex-1 bg-slate-50 dark:bg-muted/40 rounded-lg py-3 text-center">
                  <div className="text-[17px] font-bold text-foreground leading-none">
                    {dept.activeTasks}
                  </div>
                  <div className="text-[9px] font-semibold uppercase tracking-[0.05em] text-muted-foreground mt-1.5">
                    ACTIVE TASKS
                  </div>
                </div>
                <div className="flex-1 bg-slate-50 dark:bg-muted/40 rounded-lg py-3 text-center">
                  <div className="text-[17px] font-bold text-foreground leading-none">
                    {dept.completedTasks}
                  </div>
                  <div className="text-[9px] font-semibold uppercase tracking-[0.05em] text-muted-foreground mt-1.5">
                    COMPLETED
                  </div>
                </div>
              </div>

              {/* Avatars */}
              <div className="flex items-center gap-1.5">
                {dept.members.map((initials, idx) => (
                  <div
                    key={idx}
                    className="w-8 h-8 rounded-full bg-blue-50/70 text-blue-500 flex items-center justify-center text-[10px] font-bold"
                  >
                    {initials}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DepartmentsPage;
