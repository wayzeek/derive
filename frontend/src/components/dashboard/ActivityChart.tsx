import { useState } from 'react';
import { Button } from '../ui/button';

interface ChartData {
  date: string;
  submissions: number;
}

interface ActivityChartProps {
  data: ChartData[];
  title?: string;
}

export function ActivityChart({ data, title = "Submission Activity" }: ActivityChartProps) {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  
  // Find max value for scaling
  const maxValue = Math.max(...data.map(item => item.submissions));
  
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-derive-purple">{title}</h2>
        <div className="flex space-x-2">
          <Button 
            variant={timeframe === 'week' ? 'secondary' : 'outline'} 
            size="sm"
            onClick={() => setTimeframe('week')}
          >
            Week
          </Button>
          <Button 
            variant={timeframe === 'month' ? 'secondary' : 'outline'} 
            size="sm"
            onClick={() => setTimeframe('month')}
          >
            Month
          </Button>
          <Button 
            variant={timeframe === 'quarter' ? 'secondary' : 'outline'} 
            size="sm"
            onClick={() => setTimeframe('quarter')}
          >
            Quarter
          </Button>
          <Button 
            variant={timeframe === 'year' ? 'secondary' : 'outline'} 
            size="sm"
            onClick={() => setTimeframe('year')}
          >
            Year
          </Button>
        </div>
      </div>
      
      <div className="h-60">
        <div className="flex h-full items-end space-x-2">
          {data.map((item, index) => (
            <div key={index} className="flex flex-1 flex-col items-center">
              <div 
                className="w-full rounded-t-sm bg-derive-bright-red transition-all duration-500"
                style={{ 
                  height: `${(item.submissions / maxValue) * 100}%`,
                  opacity: 0.7 + ((index / data.length) * 0.3)
                }}
              ></div>
              <div className="mt-2 text-xs text-derive-grey">{item.date}</div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-4 flex justify-between text-sm text-derive-grey">
        <div>Total submissions: {data.reduce((sum, item) => sum + item.submissions, 0).toLocaleString()}</div>
        <div>Average: {Math.round(data.reduce((sum, item) => sum + item.submissions, 0) / data.length).toLocaleString()} per day</div>
      </div>
    </div>
  );
} 