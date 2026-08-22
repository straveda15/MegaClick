import { useNavigate } from 'react-router-dom';
import KpiStrip from '@/components/dashboard/KpiStrip';
import AreaTrendChart from '@/components/dashboard/AreaTrendChart';
import SegmentedBarChart from '@/components/dashboard/SegmentedBarChart';
import GroupedBarChart from '@/components/dashboard/GroupedBarChart';
import ListCard from '@/components/dashboard/ListCard';
import ActivityFeedItem from '@/components/dashboard/ActivityFeedItem';
import RecentClientCard from '@/components/dashboard/RecentClientCard';
import RevenueCard from '@/components/dashboard/RevenueCard';
import StatusPill from '@/components/dashboard/StatusPill';
import {
  MOCK_LEADS_VS_CONVERSIONS,
  MOCK_EMPLOYEE_PRODUCTIVITY,
  MOCK_TASK_COMPLETION_WEEK,
  MOCK_TODAYS_TASKS,
  MOCK_UPCOMING_DEADLINES,
  MOCK_RECENT_ACTIVITY,
  MOCK_RECENT_CLIENTS,
} from '@/data/mockDashboard';

const DashboardPage = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Live counts, read off the same endpoints the boards use. */}
      <KpiStrip />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="kpi-card lg:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-foreground">Monthly Leads vs Conversions</h3>
            <span className="text-xs text-muted-foreground">Last 6 months</span>
          </div>
          <AreaTrendChart
            data={MOCK_LEADS_VS_CONVERSIONS}
            series={[
              { key: 'leads', label: 'Leads', color: 'hsl(217 91% 60%)' },
              { key: 'conversions', label: 'Conversions', color: 'hsl(142 64% 24%)' },
            ]}
          />
        </div>
        {/* Money actually received, straight off the customer ledgers. */}
        <RevenueCard />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="kpi-card">
          <h3 className="text-sm font-semibold text-foreground mb-2">Employee Productivity</h3>
          <SegmentedBarChart
            data={MOCK_EMPLOYEE_PRODUCTIVITY}
            mainColor="hsl(142 64% 24%)"
            capColor="hsl(38 92% 50%)"
          />
        </div>
        <div className="kpi-card">
          <h3 className="text-sm font-semibold text-foreground mb-2">Task Completion (This Week)</h3>
          <GroupedBarChart
            data={MOCK_TASK_COMPLETION_WEEK}
            xKey="day"
            series={[
              { key: 'assigned', label: 'Assigned', color: 'hsl(217 91% 60%)' },
              { key: 'completed', label: 'Completed', color: 'hsl(262 52% 55%)' },
            ]}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ListCard
          title="Today's Tasks"
          footerAction={{ label: 'View all', onClick: () => navigate('/tasks') }}
          items={MOCK_TODAYS_TASKS.map((task) => (
            <div key={task.id} className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm text-foreground truncate">{task.title}</p>
                <p className="text-xs text-muted-foreground truncate">{task.meta}</p>
              </div>
              <StatusPill status={task.status} />
            </div>
          ))}
        />
        <ListCard
          title="Upcoming Deadlines"
          footerAction={{ label: 'View all', onClick: () => navigate('/leads') }}
          items={MOCK_UPCOMING_DEADLINES.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm text-foreground truncate">{item.title}</p>
                <p className="text-xs text-muted-foreground truncate">{item.meta}</p>
              </div>
              <StatusPill status={item.status} />
            </div>
          ))}
        />
        <ListCard
          title="Recent Activity"
          items={MOCK_RECENT_ACTIVITY.map((activity) => (
            <ActivityFeedItem key={activity.id} {...activity} />
          ))}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground">Recent Clients</h3>
          <button
            type="button"
            onClick={() => navigate('/clients')}
            className="text-xs font-medium text-primary hover:underline"
          >
            View all
          </button>
        </div>
        <div className="flex flex-wrap gap-4">
          {MOCK_RECENT_CLIENTS.map((client) => (
            <RecentClientCard key={client.id} {...client} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
