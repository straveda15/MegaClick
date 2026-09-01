import { useState } from 'react';
import KpiStrip from '@/components/dashboard/KpiStrip';
import RevenueCard from '@/components/dashboard/RevenueCard';
import ServiceChargeCard from '@/components/dashboard/ServiceChargeCard';
import LeadsConversionsCard from '@/components/dashboard/LeadsConversionsCard';
import TaskCompletionCard from '@/components/dashboard/TaskCompletionCard';
import TodaysTasksCard from '@/components/dashboard/TodaysTasksCard';
import UpcomingDeadlinesCard from '@/components/dashboard/UpcomingDeadlinesCard';
import RecentActivityCard from '@/components/dashboard/RecentActivityCard';
import RecentClientsCard from '@/components/dashboard/RecentClientsCard';
import DateRangeFilter, { type DateRange } from '@/components/DateRangeFilter';

const DashboardPage = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  return (
    <div className="space-y-6">
      {/* ── Page header with calendar filter ────────────────────────────── */}
      <div className="flex items-center justify-end gap-4 flex-wrap">
        <DateRangeFilter
          value={dateRange}
          onChange={setDateRange}
          label="Filter dashboard by date"
          align="end"
        />
      </div>

      {/* Live counts, read off the same endpoints the boards use. */}
      <KpiStrip />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ServiceChargeCard dateRange={dateRange} />
        <RevenueCard dateRange={dateRange} />
        <RecentClientsCard dateRange={dateRange} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <LeadsConversionsCard dateRange={dateRange} />
        <TaskCompletionCard dateRange={dateRange} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <TodaysTasksCard />
        <UpcomingDeadlinesCard />
        <RecentActivityCard />
      </div>
    </div>
  );
};

export default DashboardPage;
