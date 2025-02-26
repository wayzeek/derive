interface StatCardProps {
  label: string;
  value: string;
  className?: string;
}

export const StatCard = ({ label, value, className = "" }: StatCardProps) => {
  return (
    <div className={`card ${className}`}>
      <div className="mb-2 text-sm text-text-secondary">{label}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  );
};
