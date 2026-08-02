import StatCard from '@/components/ui/StatCard';

const STATS = [
  { label: 'Active Opportunities', value: '12', subtext: '+2 this week', trendDirection: 'up' },
  { label: 'Total Applicants', value: '1,248', subtext: '+15%', trendDirection: 'up' },
  { label: 'Shortlisted', value: '84', subtext: 'Next: Interviews' },
  { label: 'Closed Opportunities', value: '50', subtext: 'Past 12 months' },
];

export default function StatsRow() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {STATS.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}
