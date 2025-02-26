interface StatItemProps {
  label: string;
  value: string;
  className?: string;
}

function StatItem({ label, value, className = "" }: StatItemProps) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="text-sm text-derive-grey">{label}</div>
      <div className="mt-1 text-lg font-bold text-derive-purple">{value}</div>
    </div>
  );
}

interface DataHeaderProps {
  title: string;
  subtitle?: string;
  stats: {
    totalSubmissions: string;
    dailyAverage: string;
    pendingApproval: string;
    registered: string;
    teamMembers: string;
  };
}

export function DataHeader({ title, subtitle = "Music Metadata Management", stats }: DataHeaderProps) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-derive-purple text-white">
            <img src="/Metadata.svg" alt="" className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-derive-purple">{title}</h1>
            <p className="text-derive-grey">{subtitle}</p>
          </div>
        </div>

        <div className="flex space-x-8 divide-x divide-gray-200">
          <StatItem label="Total Submissions" value={stats.totalSubmissions} />
          <StatItem label="Daily Average" value={stats.dailyAverage} className="pl-8" />
          <StatItem label="Pending Approval" value={stats.pendingApproval} className="pl-8" />
          <StatItem label="Registered On-Chain" value={stats.registered} className="pl-8" />
          <StatItem label="Team Members" value={stats.teamMembers} className="pl-8" />
        </div>
      </div>
    </div>
  );
} 