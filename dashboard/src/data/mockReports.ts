export interface ReportMetric {
  id: string;
  label: string;
  value: string;
  period: string;
}

export const MOCK_REPORT_METRICS: ReportMetric[] = [
  { id: 'rm1', label: 'Lead-to-client conversion rate', value: '45%', period: 'Last 6 months' },
  { id: 'rm2', label: 'Average service turnaround', value: '9.4 days', period: 'Last 30 days' },
  { id: 'rm3', label: 'Client retention rate', value: '92%', period: 'Trailing 12 months' },
  { id: 'rm4', label: 'Tasks completed on time', value: '87%', period: 'This month' },
];
