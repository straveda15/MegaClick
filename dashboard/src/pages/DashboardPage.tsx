import { useEffect } from 'react';
import KpiStrip from '@/components/dashboard/KpiStrip';
import RevenueCard from '@/components/dashboard/RevenueCard';
import ServiceChargeCard from '@/components/dashboard/ServiceChargeCard';
import LeadsConversionsCard from '@/components/dashboard/LeadsConversionsCard';
import TaskCompletionCard from '@/components/dashboard/TaskCompletionCard';
import TodaysTasksCard from '@/components/dashboard/TodaysTasksCard';
import UpcomingDeadlinesCard from '@/components/dashboard/UpcomingDeadlinesCard';
import RecentActivityCard from '@/components/dashboard/RecentActivityCard';
import RecentClientsCard from '@/components/dashboard/RecentClientsCard';
import { useDashboardFilterStore } from '@/store/dashboardFilterStore';

const DashboardPage = () => {
  // The calendar filter itself sits in the top bar, next to the user menu.
  const dateRange = useDashboardFilterStore((state) => state.dateRange);
  const setDateRange = useDashboardFilterStore((state) => state.setDateRange);

  // The filter is only reachable from this page, so leaving it clears the range
  // rather than leaving a hidden filter behind for next time.
  useEffect(() => () => setDateRange(undefined), [setDateRange]);

  return (
    <div className="space-y-6">
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
