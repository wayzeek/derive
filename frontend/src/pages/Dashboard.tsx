import { DashboardLayout } from '../components/layout/DashboardLayout';
import { StatCard } from '../components/dashboard/StatCard';
import { HoldersCard } from '../components/dashboard/HoldersCard';
import { DataHeader } from '../components/dashboard/DataHeader';
import { ActivityChart } from '../components/dashboard/ActivityChart';

// Mock data for submissions
const mockSubmitters = [
  { 
    id: '1', 
    address: '0xAbC123456789DEF0123456789ABCDEF01234567', 
    name: 'Universal Music',
    balance: '425,195 submissions', 
    percentage: 25, 
    rank: 1 
  },
  { 
    id: '2', 
    address: '0xDEF123456789ABC0123456789DEFABC01234567', 
    name: 'Sony Music',
    balance: '301,105 submissions', 
    percentage: 14, 
    rank: 2 
  },
  { 
    id: '3', 
    address: '0x123456789ABCDEF0123456789ABCDEF01234567', 
    name: 'Warner Music',
    balance: '108,502 submissions', 
    percentage: 8, 
    rank: 3 
  },
  { 
    id: '4', 
    address: '0x987654321FEDCBA0987654321FEDCBA09876543',
    balance: '102,095 submissions', 
    percentage: 6, 
    rank: 4 
  },
];

// Mock data for activity chart
const mockActivityData = [
  { date: 'Mon', submissions: 1205 },
  { date: 'Tue', submissions: 1341 },
  { date: 'Wed', submissions: 1580 },
  { date: 'Thu', submissions: 1294 },
  { date: 'Fri', submissions: 1452 },
  { date: 'Sat', submissions: 976 },
  { date: 'Sun', submissions: 832 },
  { date: 'Mon', submissions: 1458 },
  { date: 'Tue', submissions: 1523 },
  { date: 'Wed', submissions: 1694 },
  { date: 'Thu', submissions: 1402 },
  { date: 'Fri', submissions: 1625 },
  { date: 'Sat', submissions: 856 },
  { date: 'Sun', submissions: 745 },
];

export default function Dashboard() {
  // Icons for stat cards
  const DocumentIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-derive-purple">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
  );

  const ChartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-derive-purple">
      <line x1="18" y1="20" x2="18" y2="10"></line>
      <line x1="12" y1="20" x2="12" y2="4"></line>
      <line x1="6" y1="20" x2="6" y2="14"></line>
    </svg>
  );

  const UsersIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-derive-purple">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  );

  const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-derive-purple">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header with overall stats */}
        <DataHeader 
          title="Metadata Dashboard" 
          stats={{
            totalSubmissions: "936,897",
            dailyAverage: "1,245",
            pendingApproval: "348",
            registered: "783,521",
            teamMembers: "14"
          }}
        />

        {/* Stat Cards Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Today's Submissions"
            value="1,432"
            icon={<DocumentIcon />}
            change={{
              value: "12%",
              increase: true
            }}
          />
          <StatCard
            title="Weekly Submissions"
            value="8,752"
            icon={<ChartIcon />}
            change={{
              value: "3.2%",
              increase: true
            }}
          />
          <StatCard
            title="Active Contributors"
            value="86"
            icon={<UsersIcon />}
            change={{
              value: "5%",
              increase: false
            }}
          />
          <StatCard
            title="Processing Rate"
            value="94.7%"
            icon={<CheckIcon />}
            change={{
              value: "1.2%",
              increase: true
            }}
          />
        </div>

        {/* Activity Chart */}
        <ActivityChart data={mockActivityData} />

        {/* Top Submitters */}
        <HoldersCard submitters={mockSubmitters} />
      </div>
    </DashboardLayout>
  );
} 