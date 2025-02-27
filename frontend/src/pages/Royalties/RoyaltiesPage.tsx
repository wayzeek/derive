import { FC, useState } from "react";

interface RoyaltyDistribution {
  id: string;
  title: string;
  artist: string;
  totalRoyalties: number;
  lastDistribution: Date;
  status: "Active" | "Pending" | "Completed";
  splits: {
    entity: string;
    role: string;
    percentage: number;
    address: string;
  }[];
}

// Mock data for royalty distributions
const mockRoyaltyDistributions: RoyaltyDistribution[] = [
  {
    id: "roy-001",
    title: "Summer Nights",
    artist: "Luna Ray",
    totalRoyalties: 24500,
    lastDistribution: new Date(2023, 9, 15),
    status: "Active",
    splits: [
      { entity: "Luna Ray", role: "Artist", percentage: 50, address: "0x1a2b...3c4d" },
      { entity: "Universal Music", role: "Label", percentage: 30, address: "0x5e6f...7g8h" },
      { entity: "SongWriters Inc", role: "Publisher", percentage: 15, address: "0x9i0j...1k2l" },
      { entity: "Studio Session", role: "Producer", percentage: 5, address: "0x3m4n...5o6p" }
    ]
  },
  {
    id: "roy-002",
    title: "Midnight Drive",
    artist: "The Echoes",
    totalRoyalties: 18750,
    lastDistribution: new Date(2023, 9, 10),
    status: "Active",
    splits: [
      { entity: "The Echoes", role: "Artist", percentage: 45, address: "0x7q8r...9s0t" },
      { entity: "Sony Music", role: "Label", percentage: 35, address: "0x1u2v...3w4x" },
      { entity: "Melody Rights", role: "Publisher", percentage: 20, address: "0x5y6z...7a8b" }
    ]
  },
  {
    id: "roy-003",
    title: "Ocean Waves",
    artist: "Coastal Sounds",
    totalRoyalties: 12300,
    lastDistribution: new Date(2023, 9, 5),
    status: "Pending",
    splits: [
      { entity: "Coastal Sounds", role: "Artist", percentage: 60, address: "0x1c2d...3e4f" },
      { entity: "Indie Label Co", role: "Label", percentage: 25, address: "0x5g6h...7i8j" },
      { entity: "Beach Publishing", role: "Publisher", percentage: 15, address: "0x9k0l...1m2n" }
    ]
  },
  {
    id: "roy-004",
    title: "Urban Jungle",
    artist: "Metro Beats",
    totalRoyalties: 31200,
    lastDistribution: new Date(2023, 8, 28),
    status: "Completed",
    splits: [
      { entity: "Metro Beats", role: "Artist", percentage: 55, address: "0x3o4p...5q6r" },
      { entity: "Warner Music", role: "Label", percentage: 30, address: "0x7s8t...9u0v" },
      { entity: "City Sounds", role: "Publisher", percentage: 10, address: "0x1w2x...3y4z" },
      { entity: "Mix Master", role: "Producer", percentage: 5, address: "0x5a6b...7c8d" }
    ]
  },
  {
    id: "roy-005",
    title: "Electric Dreams",
    artist: "Synth Wave",
    totalRoyalties: 15800,
    lastDistribution: new Date(2023, 8, 20),
    status: "Active",
    splits: [
      { entity: "Synth Wave", role: "Artist", percentage: 65, address: "0x9e0f...1g2h" },
      { entity: "Digital Records", role: "Label", percentage: 20, address: "0x3i4j...5k6l" },
      { entity: "Future Rights", role: "Publisher", percentage: 15, address: "0x7m8n...9o0p" }
    ]
  }
];

export const RoyaltiesPage: FC = () => {
  const [selectedDistribution, setSelectedDistribution] = useState<RoyaltyDistribution | null>(null);

  const handleRowClick = (distribution: RoyaltyDistribution) => {
    setSelectedDistribution(distribution);
  };

  const ExternalLinkIcon = () => (
    <svg
      className="ml-1 h-3 w-3 opacity-60"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
      />
    </svg>
  );

  return (
    <div className="space-y-8 p-6">
      {/* Top Bar */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Royalty Management</h1>
        <div className="flex items-center space-x-4">
          <button className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700">
            Create Distribution
          </button>
          <button className="rounded-lg border border-gray-700 bg-[#1f1f1f] px-4 py-2 text-sm font-medium text-white hover:bg-[#2a2a2a]">
            Import Data
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Royalty Distributions List */}
        <div className="lg:col-span-2">
          <div className="rounded-xl bg-[#1f1f1f] shadow-sm">
            <div className="border-b border-gray-800 px-6 py-4">
              <h2 className="text-xl font-semibold text-white">Royalty Distributions</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-separate border-spacing-0">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="whitespace-nowrap px-6 py-4 text-left text-xs font-normal text-gray-500">
                      Title
                    </th>
                    <th className="whitespace-nowrap px-4 py-4 text-left text-xs font-normal text-gray-500">
                      Artist
                    </th>
                    <th className="whitespace-nowrap px-4 py-4 text-left text-xs font-normal text-gray-500">
                      Last Distribution
                    </th>
                    <th className="whitespace-nowrap px-4 py-4 text-right text-xs font-normal text-gray-500">
                      Total Royalties
                    </th>
                    <th className="whitespace-nowrap px-4 py-4 text-center text-xs font-normal text-gray-500">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {mockRoyaltyDistributions.map((distribution) => (
                    <tr
                      key={distribution.id}
                      className={`border-b border-gray-800/50 transition-colors hover:bg-[#2a2a2a] cursor-pointer ${
                        selectedDistribution?.id === distribution.id ? "bg-[#2a2a2a]" : ""
                      }`}
                      onClick={() => handleRowClick(distribution)}
                    >
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-white">
                        {distribution.title}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-300">
                        {distribution.artist}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-400">
                        {distribution.lastDistribution.toLocaleDateString()}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-right text-sm text-white">
                        ${distribution.totalRoyalties.toLocaleString()}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-center">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                            distribution.status === "Active"
                              ? "bg-green-500/20 text-green-400"
                              : distribution.status === "Pending"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-blue-500/20 text-blue-400"
                          }`}
                        >
                          {distribution.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Royalty Details */}
        <div className="lg:col-span-1">
          <div className="rounded-xl bg-[#1f1f1f] shadow-sm">
            <div className="border-b border-gray-800 px-6 py-4">
              <h2 className="text-xl font-semibold text-white">Distribution Details</h2>
            </div>
            {selectedDistribution ? (
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-white">{selectedDistribution.title}</h3>
                  <p className="text-sm text-gray-400">by {selectedDistribution.artist}</p>
                </div>

                <div className="mb-6 grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-[#2a2a2a] p-4">
                    <p className="text-xs text-gray-400">Total Royalties</p>
                    <p className="text-lg font-semibold text-white">
                      ${selectedDistribution.totalRoyalties.toLocaleString()}
                    </p>
                  </div>
                  <div className="rounded-lg bg-[#2a2a2a] p-4">
                    <p className="text-xs text-gray-400">Last Distribution</p>
                    <p className="text-lg font-semibold text-white">
                      {selectedDistribution.lastDistribution.toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="mb-3 text-sm font-medium text-gray-300">Revenue Splits</h4>
                  <div className="space-y-3">
                    {selectedDistribution.splits.map((split, index) => (
                      <div key={index} className="flex items-center justify-between rounded-lg bg-[#2a2a2a] p-3">
                        <div>
                          <p className="text-sm font-medium text-white">{split.entity}</p>
                          <p className="text-xs text-gray-400">{split.role}</p>
                          <a
                            href={`https://etherscan.io/address/${split.address}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-1 flex items-center text-xs text-gray-500 hover:text-gray-300"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {split.address}
                            <ExternalLinkIcon />
                          </a>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-white">{split.percentage}%</p>
                          <p className="text-xs text-gray-400">
                            ${((selectedDistribution.totalRoyalties * split.percentage) / 100).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between">
                  <button className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700">
                    Distribute Now
                  </button>
                  <button className="rounded-lg border border-gray-700 bg-[#2a2a2a] px-4 py-2 text-sm font-medium text-white hover:bg-[#333333]">
                    Edit Splits
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex h-[400px] items-center justify-center p-6">
                <p className="text-center text-gray-500">
                  Select a distribution to view details
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 