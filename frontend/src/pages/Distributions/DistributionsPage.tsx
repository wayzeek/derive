import { FC } from "react";

export const DistributionsPage: FC = () => {
  return (
    <div className="space-y-8 p-6">
      {/* Top Bar */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Distributions</h1>
        <div className="flex items-center space-x-4">
          <button className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700">
            Create Distribution
          </button>
          <button className="rounded-lg border border-gray-700 bg-[#1f1f1f] px-4 py-2 text-sm font-medium text-white hover:bg-[#2a2a2a]">
            Import Data
          </button>
        </div>
      </div>

      {/* Empty state */}
      <div className="flex h-[400px] items-center justify-center rounded-xl bg-[#1f1f1f] p-6">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#2a2a2a]">
            <svg
              className="h-6 w-6 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <h3 className="mb-1 text-lg font-medium text-white">No Distributions Yet</h3>
          <p className="mb-4 text-sm text-gray-400">
            Create your first distribution to start managing royalty payments
          </p>
          <button className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700">
            Create Distribution
          </button>
        </div>
      </div>
    </div>
  );
}; 