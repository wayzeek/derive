import { Button } from '../ui/button';

// Interface for a single holder/submitter
interface Submitter {
  id: string;
  address: string;
  name?: string;
  balance: string;
  percentage: number;
  rank: number;
}

interface HoldersCardProps {
  submitters: Submitter[];
  title?: string;
}

export function HoldersCard({ submitters, title = 'Top Submitters' }: HoldersCardProps) {
  return (
    <div className="rounded-xl bg-white shadow-sm">
      <div className="border-b border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-derive-purple">{title}</h2>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">All</Button>
            <Button variant="outline" size="sm">Top Submitters</Button>
            <Button variant="outline" size="sm">Recent</Button>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="space-y-6">
          {submitters.map((submitter) => (
            <div key={submitter.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-derive-purple text-white text-xs">
                  #{submitter.rank}
                </div>
                <div>
                  <div className="flex items-center">
                    <p className="font-medium text-derive-grey">
                      {submitter.address.substring(0, 6)}...{submitter.address.substring(submitter.address.length - 4)}
                    </p>
                    {submitter.name && (
                      <span className="ml-2 rounded bg-derive-purple/10 px-2 py-1 text-xs text-derive-purple">
                        {submitter.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <p className="font-bold text-derive-purple">{submitter.balance}</p>
                <div className="mt-1 flex items-center justify-end">
                  <div className="h-2 w-24 rounded-full bg-gray-200">
                    <div 
                      className="h-2 rounded-full bg-derive-bright-red" 
                      style={{ width: `${submitter.percentage}%` }}
                    ></div>
                  </div>
                  <span className="ml-2 text-xs text-derive-grey">{submitter.percentage}% of total</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 