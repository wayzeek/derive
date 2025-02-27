import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

// Mock data for the overview page
const mockSubmissionStats = {
  todaySubmissions: {
    value: 1432,
    change: 12,
    isPositive: true,
  },
  weeklySubmissions: {
    value: 8752,
    change: 3.2,
    isPositive: true,
  },
  aiReviewAgents: {
    value: 21,
    change: 20,
    isPositive: true,
  },
  aiVerificationRate: {
    value: 94.7,
    change: 1.2,
    isPositive: true,
  },
  registeredOnChain: {
    value: 783521,
  },
};

const mockTopSubmitters = [
  { address: "0x1a2b...3c4d", submissions: 425196, name: "Universal Music" },
  { address: "0x5e6f...7g8h", submissions: 301105, name: "Sony Music" },
  { address: "0x9i0j...1k2l", submissions: 287654, name: "Warner Music" },
  { address: "0x3m4n...5o6p", submissions: 156789, name: "BMG Rights" },
  { address: "0x7q8r...9s0t", submissions: 98765, name: "Kobalt Music" },
  { address: "0x1u2v...3w4x", submissions: 76543, name: "Believe Digital" },
  { address: "0x5y6z...7a8b", submissions: 45678, name: "Independent" },
];

// Enhanced mock data for submission activity chart with more detailed values and categories
const mockSubmissionActivity = [
  { 
    date: "Mon", 
    submissions: 1250, 
    universal: 425, 
    sony: 325, 
    warner: 275, 
    bmg: 125,
    independent: 100,
    believe: 75,
    kobalt: 50,
    verified: 1175, 
    pending: 45, 
    rejected: 30 
  },
  { 
    date: "Tue", 
    submissions: 1420, 
    universal: 480, 
    sony: 370, 
    warner: 310, 
    bmg: 145,
    independent: 115,
    believe: 85,
    kobalt: 60,
    verified: 1320, 
    pending: 70, 
    rejected: 30 
  },
  { 
    date: "Wed", 
    submissions: 1650, 
    universal: 560, 
    sony: 430, 
    warner: 360, 
    bmg: 165,
    independent: 135,
    believe: 100,
    kobalt: 70,
    verified: 1520, 
    pending: 90, 
    rejected: 40 
  },
  { 
    date: "Thu", 
    submissions: 1380, 
    universal: 470, 
    sony: 360, 
    warner: 300, 
    bmg: 140,
    independent: 110,
    believe: 80,
    kobalt: 55,
    verified: 1290, 
    pending: 60, 
    rejected: 30 
  },
  { 
    date: "Fri", 
    submissions: 1520, 
    universal: 515, 
    sony: 395, 
    warner: 335, 
    bmg: 155,
    independent: 120,
    believe: 90,
    kobalt: 65,
    verified: 1410, 
    pending: 80, 
    rejected: 30 
  },
  { 
    date: "Sat", 
    submissions: 980, 
    universal: 330, 
    sony: 255, 
    warner: 215, 
    bmg: 100,
    independent: 80,
    believe: 60,
    kobalt: 40,
    verified: 920, 
    pending: 40, 
    rejected: 20 
  },
  { 
    date: "Sun", 
    submissions: 850, 
    universal: 290, 
    sony: 220, 
    warner: 185, 
    bmg: 85,
    independent: 70,
    believe: 50,
    kobalt: 35,
    verified: 790, 
    pending: 35, 
    rejected: 25 
  },
];

// Monthly data for when the filter changes
const mockMonthlyActivity = [
  {
    date: "Jan",
    submissions: 32500,
    universal: 11050,
    sony: 8450,
    warner: 7150,
    bmg: 3250,
    independent: 2600,
    believe: 1950,
    kobalt: 1300,
    verified: 30100,
    pending: 1500,
    rejected: 900,
  },
  {
    date: "Feb",
    submissions: 28900,
    universal: 9825,
    sony: 7515,
    warner: 6360,
    bmg: 2890,
    independent: 2310,
    believe: 1650,
    kobalt: 1150,
    verified: 26800,
    pending: 1300,
    rejected: 800,
  },
  {
    date: "Mar",
    submissions: 35600,
    universal: 17800,
    sony: 14450,
    warner: 10680,
    bmg: 4248,
    independent: 2840,
    believe: 2000,
    kobalt: 1400,
    verified: 33200,
    pending: 1600,
    rejected: 800,
  },
  {
    date: "Apr",
    submissions: 38200,
    universal: 19100,
    sony: 14450,
    warner: 11460,
    bmg: 4572,
    independent: 3048,
    believe: 2100,
    kobalt: 1500,
    verified: 35700,
    pending: 1700,
    rejected: 800,
  },
  {
    date: "May",
    submissions: 42100,
    universal: 21050,
    sony: 16250,
    warner: 12630,
    bmg: 5052,
    independent: 3368,
    believe: 2300,
    kobalt: 1600,
    verified: 39300,
    pending: 1900,
    rejected: 900,
  },
  {
    date: "Jun",
    submissions: 45800,
    universal: 22900,
    sony: 17800,
    warner: 13740,
    bmg: 5496,
    independent: 3664,
    believe: 2500,
    kobalt: 1800,
    verified: 42700,
    pending: 2100,
    rejected: 1000,
  },
  {
    date: "Jul",
    submissions: 48300,
    universal: 24150,
    sony: 19150,
    warner: 14490,
    bmg: 5796,
    independent: 3864,
    believe: 2700,
    kobalt: 1900,
    verified: 45100,
    pending: 2200,
    rejected: 1000,
  },
];

// Daily data for when the filter changes
const mockDailyActivity = [
  { 
    date: "9AM", 
    submissions: 210, 
    universal: 70, 
    sony: 55, 
    warner: 45, 
    bmg: 25, 
    independent: 15,
    believe: 12,
    kobalt: 8,
    verified: 195, 
    pending: 10, 
    rejected: 5 
  },
  { 
    date: "10AM", 
    submissions: 320, 
    universal: 110, 
    sony: 85, 
    warner: 70, 
    bmg: 35, 
    independent: 20,
    believe: 15,
    kobalt: 10,
    verified: 298, 
    pending: 15, 
    rejected: 7 
  },
  { 
    date: "11AM", 
    submissions: 280, 
    universal: 95, 
    sony: 75, 
    warner: 60, 
    bmg: 30, 
    independent: 20,
    believe: 12,
    kobalt: 8,
    verified: 260, 
    pending: 12, 
    rejected: 8 
  },
  { 
    date: "12PM", 
    submissions: 190, 
    universal: 65, 
    sony: 50, 
    warner: 40, 
    bmg: 20, 
    independent: 15,
    believe: 10,
    kobalt: 5,
    verified: 175, 
    pending: 10, 
    rejected: 5 
  },
  { 
    date: "1PM", 
    submissions: 150, 
    universal: 50, 
    sony: 40, 
    warner: 30, 
    bmg: 15, 
    independent: 15,
    believe: 7,
    kobalt: 3,
    verified: 140, 
    pending: 7, 
    rejected: 3 
  },
  { 
    date: "2PM", 
    submissions: 230, 
    universal: 80, 
    sony: 60, 
    warner: 50, 
    bmg: 25, 
    independent: 15,
    believe: 10,
    kobalt: 5,
    verified: 215, 
    pending: 10, 
    rejected: 5 
  },
  { 
    date: "3PM", 
    submissions: 260, 
    universal: 90, 
    sony: 70, 
    warner: 55, 
    bmg: 25, 
    independent: 20,
    believe: 12,
    kobalt: 8,
    verified: 240, 
    pending: 12, 
    rejected: 8 
  },
];

// New mock data for rights distribution with more metadata and interesting categories
const mockRightsDistribution = [
  { name: "Master Recording", value: 35, count: 274375, growth: 5.2, revenue: 4250000 },
  { name: "Composition", value: 25, count: 195982, growth: 3.8, revenue: 3150000 },
  { name: "Publishing", value: 20, count: 156786, growth: 4.5, revenue: 2750000 },
  { name: "Performance", value: 15, count: 117589, growth: 2.9, revenue: 1850000 },
  { name: "Mechanical", value: 5, count: 39196, growth: 1.7, revenue: 950000 },
];

// New mock data for IP registration trend with more metadata
const mockIPRegistrationTrend = [
  { month: "Jan", registrations: 12500, universal: 4250, sony: 3125, warner: 2625, bmg: 1500, independent: 1000, believe: 800, kobalt: 700, growth: 0 },
  { month: "Feb", registrations: 14200, universal: 4830, sony: 3550, warner: 2980, bmg: 1704, independent: 1136, believe: 910, kobalt: 790, growth: 13.6 },
  { month: "Mar", registrations: 16800, universal: 5710, sony: 4200, warner: 3530, bmg: 2016, independent: 1344, believe: 1080, kobalt: 920, growth: 18.3 },
  { month: "Apr", registrations: 19500, universal: 6630, sony: 4875, warner: 4095, bmg: 2340, independent: 1560, believe: 1250, kobalt: 1050, growth: 16.1 },
  { month: "May", registrations: 22100, universal: 7510, sony: 5525, warner: 4640, bmg: 2652, independent: 1768, believe: 1420, kobalt: 1185, growth: 13.3 },
  { month: "Jun", registrations: 25800, universal: 8770, sony: 6450, warner: 5420, bmg: 3096, independent: 2064, believe: 1650, kobalt: 1350, growth: 16.7 },
  { month: "Jul", registrations: 28300, universal: 9620, sony: 7075, warner: 5940, bmg: 3396, independent: 2264, believe: 1810, kobalt: 1495, growth: 9.7 },
];

// Colors for the pie chart - more vibrant and interesting
const RIGHTS_COLORS = ["#8B5CF6", "#EC4899", "#3B82F6", "#10B981", "#F59E0B"];

// Brand colors for labels
const LABEL_COLORS = {
  universal: "#4686C6",
  sony: "#EC2427",
  warner: "#EDB41F",
  bmg: "#F36525",
  independent: "#F7EE49",
  believe: "#45B64A",
  kobalt: "#A4DDE6"
};

type FilterType = "daily" | "weekly" | "monthly";

// Custom tooltip for the stacked bar chart
const CustomBarTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-md bg-[#0F0F0F] p-3 shadow-md">
        <p className="mb-2 font-medium text-white">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p
            key={`item-${index}`}
            className="text-sm"
            style={{ color: entry.color }}
          >
            {`${entry.name}: ${entry.value.toLocaleString()}`}
          </p>
        ))}
        <p className="mt-2 text-sm text-gray-400">
          Total:{" "}
          {payload
            .reduce((sum: number, entry: any) => sum + entry.value, 0)
            .toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

// Custom tooltip for the pie chart with enhanced metadata
const CustomPieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-md bg-[#0F0F0F] p-3 shadow-md">
        <p className="font-medium text-white">{payload[0].name}</p>
        <p className="text-sm text-gray-400">{`${payload[0].value}% of total`}</p>
        <p className="text-sm text-gray-400">{`${payload[0].payload.count.toLocaleString()} registrations`}</p>
        <p className="text-sm text-gray-400">{`$${(payload[0].payload.revenue / 1000000).toFixed(2)}M revenue`}</p>
        <p className={`text-sm ${payload[0].payload.growth > 3 ? "text-green-500" : "text-yellow-500"}`}>
          {`${payload[0].payload.growth}% growth`}
        </p>
      </div>
    );
  }
  return null;
};

// Custom tooltip for the line chart with enhanced metadata
const CustomLineTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-md bg-[#0F0F0F] p-3 shadow-md">
        <p className="mb-2 font-medium text-white">{label}</p>
        <p className="text-sm text-white">
          {`Total: ${payload[0].value.toLocaleString()} registrations`}
        </p>
        <div className="mt-2 space-y-2">
          <p className="text-sm mb-1" style={{ color: LABEL_COLORS.universal }}>
            {`Universal: ${payload[0].payload.universal.toLocaleString()} (${Math.round(payload[0].payload.universal / payload[0].value * 100)}%)`}
          </p>
          <p className="text-sm mb-1" style={{ color: LABEL_COLORS.sony }}>
            {`Sony: ${payload[0].payload.sony.toLocaleString()} (${Math.round(payload[0].payload.sony / payload[0].value * 100)}%)`}
          </p>
          <p className="text-sm mb-1" style={{ color: LABEL_COLORS.warner }}>
            {`Warner: ${payload[0].payload.warner.toLocaleString()} (${Math.round(payload[0].payload.warner / payload[0].value * 100)}%)`}
          </p>
          <p className="text-sm mb-1" style={{ color: LABEL_COLORS.bmg }}>
            {`BMG: ${payload[0].payload.bmg.toLocaleString()} (${Math.round(payload[0].payload.bmg / payload[0].value * 100)}%)`}
          </p>
          <p className="text-sm mb-1" style={{ color: LABEL_COLORS.independent }}>
            {`Independent: ${payload[0].payload.independent.toLocaleString()} (${Math.round(payload[0].payload.independent / payload[0].value * 100)}%)`}
          </p>
          <p className="text-sm mb-1" style={{ color: LABEL_COLORS.believe }}>
            {`Believe: ${payload[0].payload.believe?.toLocaleString() || 0} (${Math.round((payload[0].payload.believe || 0) / payload[0].value * 100)}%)`}
          </p>
          <p className="text-sm mb-1" style={{ color: LABEL_COLORS.kobalt }}>
            {`Kobalt: ${payload[0].payload.kobalt?.toLocaleString() || 0} (${Math.round((payload[0].payload.kobalt || 0) / payload[0].value * 100)}%)`}
          </p>
        </div>
        <div className="mt-2 pt-2 border-t border-gray-700">
          <p className={`text-sm ${payload[0].payload.growth > 10 ? "text-green-500" : "text-yellow-500"}`}>
            {`Growth: ${payload[0].payload.growth}% vs previous month`}
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export const OverviewPage = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>("weekly");

  // Select the appropriate data based on the active filter
  const getActivityData = () => {
    switch (activeFilter) {
      case "daily":
        return mockDailyActivity;
      case "weekly":
        return mockSubmissionActivity;
      case "monthly":
        return mockMonthlyActivity;
      default:
        return mockSubmissionActivity;
    }
  };

  const activityData = getActivityData();

  return (
    <div className="space-y-8 p-6">
      {/* Top Bar */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Overview</h1>
        <div className="flex items-center">
          <div className="rounded-lg bg-[#1f1f1f] px-6 py-3">
            <div className="text-sm text-text-secondary">
              Total Registered On-Chain
            </div>
            <div className="text-base font-medium text-white">
              {mockSubmissionStats.registeredOnChain.value.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Today's Submissions Card */}
        <div className="rounded-xl bg-[#1f1f1f] p-6 shadow-sm">
          <div className="flex justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-300">
                Today's Submissions
              </h3>
              <p className="mt-2 text-4xl font-bold text-white">
                {mockSubmissionStats.todaySubmissions.value.toLocaleString()}
              </p>
              <p
                className={`mt-2 flex items-center text-sm ${mockSubmissionStats.todaySubmissions.isPositive ? "text-green-500" : "text-red-500"}`}
              >
                {mockSubmissionStats.todaySubmissions.isPositive ? "↑" : "↓"}{" "}
                {mockSubmissionStats.todaySubmissions.change}% vs last period
              </p>
            </div>
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2a2a2a]">
              <svg
                className="h-3.5 w-3.5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Weekly Submissions Card */}
        <div className="rounded-xl bg-[#1f1f1f] p-6 shadow-sm">
          <div className="flex justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-300">
                Weekly Submissions
              </h3>
              <p className="mt-2 text-4xl font-bold text-white">
                {mockSubmissionStats.weeklySubmissions.value.toLocaleString()}
              </p>
              <p
                className={`mt-2 flex items-center text-sm ${mockSubmissionStats.weeklySubmissions.isPositive ? "text-green-500" : "text-red-500"}`}
              >
                {mockSubmissionStats.weeklySubmissions.isPositive ? "↑" : "↓"}{" "}
                {mockSubmissionStats.weeklySubmissions.change}% vs last period
              </p>
            </div>
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2a2a2a]">
              <svg
                className="h-3.5 w-3.5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* AI Review Agents Card */}
        <div className="rounded-xl bg-[#1f1f1f] p-6 shadow-sm">
          <div className="flex justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-300">
                Review Agents
              </h3>
              <p className="mt-2 text-4xl font-bold text-white">
                {mockSubmissionStats.aiReviewAgents.value}
              </p>
              <p
                className={`mt-2 flex items-center text-sm ${mockSubmissionStats.aiReviewAgents.isPositive ? "text-green-500" : "text-red-500"}`}
              >
                {mockSubmissionStats.aiReviewAgents.isPositive ? "↑" : "↓"}{" "}
                {mockSubmissionStats.aiReviewAgents.change}% vs last period
              </p>
            </div>
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2a2a2a]">
              <svg
                className="h-3.5 w-3.5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* AI Verification Rate Card */}
        <div className="rounded-xl bg-[#1f1f1f] p-6 shadow-sm">
          <div className="flex justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-300">
                Verification Rate
              </h3>
              <p className="mt-2 text-4xl font-bold text-white">
                {mockSubmissionStats.aiVerificationRate.value}%
              </p>
              <p
                className={`mt-2 flex items-center text-sm ${mockSubmissionStats.aiVerificationRate.isPositive ? "text-green-500" : "text-red-500"}`}
              >
                {mockSubmissionStats.aiVerificationRate.isPositive ? "↑" : "↓"}{" "}
                {mockSubmissionStats.aiVerificationRate.change}% vs last period
              </p>
            </div>
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2a2a2a]">
              <svg
                className="h-3.5 w-3.5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Submission Activity Section */}
      <div>
        <h2 className="mb-4 text-2xl font-semibold text-white">
          Submission Activity
        </h2>
        <div className="mb-6 flex gap-6">
          <button
            onClick={() => setActiveFilter("daily")}
            className={`text-sm font-medium ${activeFilter === "daily" ? "text-white" : "text-text-secondary hover:text-white"}`}
          >
            Daily
          </button>
          <button
            onClick={() => setActiveFilter("weekly")}
            className={`text-sm font-medium ${activeFilter === "weekly" ? "text-white" : "text-text-secondary hover:text-white"}`}
          >
            Weekly
          </button>
          <button
            onClick={() => setActiveFilter("monthly")}
            className={`text-sm font-medium ${activeFilter === "monthly" ? "text-white" : "text-text-secondary hover:text-white"}`}
          >
            Monthly
          </button>
        </div>

        {/* Recharts Stacked Bar Chart */}
        <div className="mb-8 rounded-xl bg-[#1f1f1f] p-6">
          <div className="mb-4 flex flex-wrap justify-between px-4">
            <div className="flex items-center gap-2 mr-4 mb-2">
              <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: LABEL_COLORS.universal }}></div>
              <span className="text-xs text-text-secondary">Universal</span>
            </div>
            <div className="flex items-center gap-2 mr-4 mb-2">
              <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: LABEL_COLORS.sony }}></div>
              <span className="text-xs text-text-secondary">Sony</span>
            </div>
            <div className="flex items-center gap-2 mr-4 mb-2">
              <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: LABEL_COLORS.warner }}></div>
              <span className="text-xs text-text-secondary">Warner</span>
            </div>
            <div className="flex items-center gap-2 mr-4 mb-2">
              <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: LABEL_COLORS.bmg }}></div>
              <span className="text-xs text-text-secondary">BMG</span>
            </div>
            <div className="flex items-center gap-2 mr-4 mb-2">
              <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: LABEL_COLORS.independent }}></div>
              <span className="text-xs text-text-secondary">Independent</span>
            </div>
            <div className="flex items-center gap-2 mr-4 mb-2">
              <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: LABEL_COLORS.believe }}></div>
              <span className="text-xs text-text-secondary">Believe</span>
            </div>
            <div className="flex items-center gap-2 mr-4 mb-2">
              <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: LABEL_COLORS.kobalt }}></div>
              <span className="text-xs text-text-secondary">Kobalt</span>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={activityData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#333"
                vertical={false}
              />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip content={<CustomBarTooltip />} />
              <Legend />
              <Bar
                dataKey="universal"
                name="Universal"
                stackId="a"
                fill={LABEL_COLORS.universal}
                radius={[0, 0, 0, 0]}
              />
              <Bar 
                dataKey="sony" 
                name="Sony"
                stackId="a" 
                fill={LABEL_COLORS.sony} 
              />
              <Bar 
                dataKey="warner" 
                name="Warner"
                stackId="a" 
                fill={LABEL_COLORS.warner} 
              />
              <Bar 
                dataKey="bmg" 
                name="BMG"
                stackId="a" 
                fill={LABEL_COLORS.bmg} 
              />
              <Bar 
                dataKey="independent" 
                name="Independent"
                stackId="a" 
                fill={LABEL_COLORS.independent} 
              />
              <Bar 
                dataKey="believe" 
                name="Believe"
                stackId="a" 
                fill={LABEL_COLORS.believe} 
              />
              <Bar 
                dataKey="kobalt" 
                name="Kobalt"
                stackId="a" 
                fill={LABEL_COLORS.kobalt} 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* New Charts Section */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Rights Distribution Pie Chart */}
        <div className="rounded-xl bg-[#1f1f1f] p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">
            Rights Distribution
          </h2>
          <div className="mb-4 flex flex-wrap gap-4">
            {mockRightsDistribution.map((entry, index) => (
              <div key={`legend-${index}`} className="flex items-center gap-2">
                <div 
                  className="h-3 w-3 rounded-full" 
                  style={{ backgroundColor: RIGHTS_COLORS[index % RIGHTS_COLORS.length] }}
                ></div>
                <span className="text-xs text-text-secondary">{entry.name}</span>
              </div>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={mockRightsDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                innerRadius={60}
                fill="#8884d8"
                dataKey="value"
                paddingAngle={2}
                label={({ percent }) =>
                  `${(percent * 100).toFixed(0)}%`
                }
              >
                {mockRightsDistribution.map((_entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={RIGHTS_COLORS[index % RIGHTS_COLORS.length]}
                    stroke="#1f1f1f"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomPieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-[#0F0F0F] p-3">
              <p className="text-sm text-gray-400">Total Registrations</p>
              <p className="text-xl font-semibold text-white">
                {mockRightsDistribution.reduce((sum, item) => sum + item.count, 0).toLocaleString()}
              </p>
            </div>
            <div className="rounded-lg bg-[#0F0F0F] p-3">
              <p className="text-sm text-gray-400">Total Revenue</p>
              <p className="text-xl font-semibold text-white">
                ${(mockRightsDistribution.reduce((sum, item) => sum + item.revenue, 0) / 1000000).toFixed(2)}M
              </p>
            </div>
          </div>
        </div>

        {/* IP Registration Trend Line Chart */}
        <div className="rounded-xl bg-[#1f1f1f] p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">
            IP Registration Trend
          </h2>
          <div className="mb-4 flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-white"></div>
              <span className="text-xs text-text-secondary">Total Registrations</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: LABEL_COLORS.universal }}></div>
              <span className="text-xs text-text-secondary">Universal</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: LABEL_COLORS.sony }}></div>
              <span className="text-xs text-text-secondary">Sony</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: LABEL_COLORS.warner }}></div>
              <span className="text-xs text-text-secondary">Warner</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: LABEL_COLORS.bmg }}></div>
              <span className="text-xs text-text-secondary">BMG</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: LABEL_COLORS.independent }}></div>
              <span className="text-xs text-text-secondary">Independent</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: LABEL_COLORS.believe }}></div>
              <span className="text-xs text-text-secondary">Believe</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: LABEL_COLORS.kobalt }}></div>
              <span className="text-xs text-text-secondary">Kobalt</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={mockIPRegistrationTrend}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#333"
                vertical={false}
              />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip content={<CustomLineTooltip />} />
              <Line
                type="monotone"
                dataKey="registrations"
                name="Total"
                stroke="#FFFFFF"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="universal"
                name="Universal"
                stroke={LABEL_COLORS.universal}
                strokeWidth={1.5}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="sony"
                name="Sony"
                stroke={LABEL_COLORS.sony}
                strokeWidth={1.5}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="warner"
                name="Warner"
                stroke={LABEL_COLORS.warner}
                strokeWidth={1.5}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="bmg"
                name="BMG"
                stroke={LABEL_COLORS.bmg}
                strokeWidth={1.5}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="independent"
                name="Independent"
                stroke={LABEL_COLORS.independent}
                strokeWidth={1.5}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="believe"
                name="Believe"
                stroke={LABEL_COLORS.believe}
                strokeWidth={1.5}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="kobalt"
                name="Kobalt"
                stroke={LABEL_COLORS.kobalt}
                strokeWidth={1.5}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-[#0F0F0F] p-3">
              <p className="text-sm text-gray-400">Total Registrations</p>
              <p className="text-xl font-semibold text-white">
                {mockIPRegistrationTrend[mockIPRegistrationTrend.length - 1].registrations.toLocaleString()}
              </p>
            </div>
            <div className="rounded-lg bg-[#0F0F0F] p-3">
              <p className="text-sm text-gray-400">Growth Rate</p>
              <p className={`text-xl font-semibold ${mockIPRegistrationTrend[mockIPRegistrationTrend.length - 1].growth > 10 ? "text-green-500" : "text-yellow-500"}`}>
                {mockIPRegistrationTrend[mockIPRegistrationTrend.length - 1].growth}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Submitters Table */}
      <div>
        <h2 className="mb-4 text-2xl font-semibold text-white">
          Top Submitters
        </h2>
        <div className="overflow-hidden rounded-xl bg-[#1f1f1f]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#252525]">
                <th className="px-6 py-4 text-left text-sm font-medium text-text-secondary">
                  Rank
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-text-secondary">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-text-secondary">
                  Address
                </th>
                <th className="px-6 py-4 text-right text-sm font-medium text-text-secondary">
                  Submissions
                </th>
              </tr>
            </thead>
            <tbody>
              {mockTopSubmitters.map((submitter, index) => (
                <tr
                  key={submitter.address}
                  className="border-b border-[#252525] last:border-0"
                >
                  <td className="px-6 py-4 text-sm">{index + 1}</td>
                  <td className="px-6 py-4 text-sm">{submitter.name}</td>
                  <td className="px-6 py-4 text-sm">{submitter.address}</td>
                  <td className="px-6 py-4 text-right text-sm">
                    {submitter.submissions.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
