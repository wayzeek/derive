interface StatsCardProps {
  label: string;
  value: string;
  className?: string;
}

export const StatsCard = ({ label, value, className = "" }: StatsCardProps) => {
  return (
    <div className={`rounded-xl bg-[#1f1f1f] p-6 ${className}`}>
      <div className="mb-2 text-sm text-text-secondary">{label}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  );
};
