import { FC, useState } from "react";
import { TransactionsTable } from "../../components/Stats/TransactionsTable";

interface Transaction {
  type: "Mint" | "Burn";
  txHash: string;
  timestamp: Date;
  from: string;
  to: string;
  status: "Pending" | "Complete" | "Failed";
  quantity: number;
}

// Mock data for submissions
const mockSubmissions: Transaction[] = [
  {
    type: "Mint",
    txHash: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t",
    timestamp: new Date(2023, 9, 15, 14, 30),
    from: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    to: "0x8901e2F3a4C5d6E7f8G9h0I1j2K3l4M5n6O7p8Q9",
    status: "Complete",
    quantity: 1
  },
  {
    type: "Mint",
    txHash: "0xa1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0",
    timestamp: new Date(2023, 9, 15, 12, 45),
    from: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    to: "0xR1s2T3u4V5w6X7y8Z9a0B1c2D3e4F5g6H7i8J9",
    status: "Complete",
    quantity: 1
  },
  {
    type: "Mint",
    txHash: "0x9z8y7x6w5v4u3t2s1r0q9p8o7n6m5l4k3j2i1h0g",
    timestamp: new Date(2023, 9, 14, 16, 20),
    from: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    to: "0xK1l2M3n4O5p6Q7r8S9t0U1v2W3x4Y5z6A7b8C9",
    status: "Pending",
    quantity: 1
  },
  {
    type: "Burn",
    txHash: "0xf9e8d7c6b5a4321098765432109876543210abcd",
    timestamp: new Date(2023, 9, 14, 10, 15),
    from: "0xD1e2F3g4H5i6J7k8L9m0N1o2P3q4R5s6T7u8V9",
    to: "0x0000000000000000000000000000000000000000",
    status: "Complete",
    quantity: 1
  },
  {
    type: "Mint",
    txHash: "0x123456789abcdef0123456789abcdef012345678",
    timestamp: new Date(2023, 9, 13, 18, 30),
    from: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    to: "0xW1x2Y3z4A5b6C7d8E9f0G1h2I3j4K5l6M7n8O9",
    status: "Failed",
    quantity: 1
  },
  {
    type: "Mint",
    txHash: "0xfedcba9876543210fedcba9876543210fedcba98",
    timestamp: new Date(2023, 9, 13, 14, 10),
    from: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    to: "0xP1q2R3s4T5u6V7w8X9y0Z1a2B3c4D5e6F7g8H9",
    status: "Complete",
    quantity: 1
  }
];

export const SubmissionsPage: FC = () => {
  const [filter, setFilter] = useState<"all" | "pending" | "complete" | "failed">("all");
  
  const filteredSubmissions = mockSubmissions.filter(submission => {
    if (filter === "all") return true;
    if (filter === "pending") return submission.status === "Pending";
    if (filter === "complete") return submission.status === "Complete";
    if (filter === "failed") return submission.status === "Failed";
    return true;
  });

  return (
    <div className="space-y-8 p-6">
      {/* Top Bar */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">IP Submissions</h1>
        <div className="flex items-center space-x-4">
          <button className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700">
            New Submission
          </button>
          <button className="rounded-lg border border-gray-700 bg-[#1f1f1f] px-4 py-2 text-sm font-medium text-white hover:bg-[#2a2a2a]">
            Export Data
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-[#1f1f1f] p-6 shadow-sm">
          <div className="flex justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-300">Total Submissions</h3>
              <p className="mt-2 text-4xl font-bold text-white">{mockSubmissions.length}</p>
              <p className="mt-2 flex items-center text-sm text-green-500">
                ↑ 12% vs last period
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

        <div className="rounded-xl bg-[#1f1f1f] p-6 shadow-sm">
          <div className="flex justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-300">Completed</h3>
              <p className="mt-2 text-4xl font-bold text-white">
                {mockSubmissions.filter(s => s.status === "Complete").length}
              </p>
              <p className="mt-2 flex items-center text-sm text-green-500">
                ↑ 8% vs last period
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

        <div className="rounded-xl bg-[#1f1f1f] p-6 shadow-sm">
          <div className="flex justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-300">Pending</h3>
              <p className="mt-2 text-4xl font-bold text-white">
                {mockSubmissions.filter(s => s.status === "Pending").length}
              </p>
              <p className="mt-2 flex items-center text-sm text-yellow-500">
                ↑ 3% vs last period
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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-[#1f1f1f] p-6 shadow-sm">
          <div className="flex justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-300">Failed</h3>
              <p className="mt-2 text-4xl font-bold text-white">
                {mockSubmissions.filter(s => s.status === "Failed").length}
              </p>
              <p className="mt-2 flex items-center text-sm text-red-500">
                ↓ 2% vs last period
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-6">
        <button
          onClick={() => setFilter("all")}
          className={`text-sm font-medium ${filter === "all" ? "text-white" : "text-text-secondary hover:text-white"}`}
        >
          All Submissions
        </button>
        <button
          onClick={() => setFilter("pending")}
          className={`text-sm font-medium ${filter === "pending" ? "text-white" : "text-text-secondary hover:text-white"}`}
        >
          Pending
        </button>
        <button
          onClick={() => setFilter("complete")}
          className={`text-sm font-medium ${filter === "complete" ? "text-white" : "text-text-secondary hover:text-white"}`}
        >
          Completed
        </button>
        <button
          onClick={() => setFilter("failed")}
          className={`text-sm font-medium ${filter === "failed" ? "text-white" : "text-text-secondary hover:text-white"}`}
        >
          Failed
        </button>
      </div>

      {/* Transactions Table */}
      <div className="rounded-xl bg-[#1f1f1f] shadow-sm">
        <div className="border-b border-gray-800 px-6 py-4">
          <h2 className="text-xl font-semibold text-white">Recent Submissions</h2>
        </div>
        <TransactionsTable transactions={filteredSubmissions} />
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Showing <span className="font-medium text-white">1</span> to{" "}
          <span className="font-medium text-white">{filteredSubmissions.length}</span> of{" "}
          <span className="font-medium text-white">{filteredSubmissions.length}</span> results
        </div>
        <div className="flex items-center space-x-2">
          <button className="rounded-md border border-gray-700 bg-[#1f1f1f] px-3 py-1 text-sm text-gray-400 hover:bg-[#2a2a2a] hover:text-white">
            Previous
          </button>
          <button className="rounded-md border border-gray-700 bg-[#1f1f1f] px-3 py-1 text-sm text-gray-400 hover:bg-[#2a2a2a] hover:text-white">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}; 