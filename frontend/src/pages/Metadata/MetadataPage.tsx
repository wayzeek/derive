import { FC, useState } from "react";

interface IPMetadata {
  id: string;
  title: string;
  creator: string;
  type: "Music" | "Image" | "Video" | "Text" | "Other";
  dateCreated: Date;
  status: "Verified" | "Pending" | "Rejected";
  ipfsHash: string;
  chainId: string;
  description: string;
  tags: string[];
}

// Mock data for IP metadata
const mockMetadata: IPMetadata[] = [
  {
    id: "meta-001",
    title: "Sunset Boulevard",
    creator: "Visual Arts Studio",
    type: "Image",
    dateCreated: new Date(2023, 8, 15),
    status: "Verified",
    ipfsHash: "QmT8CZxmWqzuJLBMHzW7Kdkm6Lh5Bosxpz3JvZz1jkwLKn",
    chainId: "0x89",
    description: "A digital painting of a sunset over a city boulevard with neon lights.",
    tags: ["digital art", "cityscape", "sunset", "neon"]
  },
  {
    id: "meta-002",
    title: "Echoes of Tomorrow",
    creator: "Luna Ray",
    type: "Music",
    dateCreated: new Date(2023, 8, 10),
    status: "Verified",
    ipfsHash: "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG",
    chainId: "0x1",
    description: "An electronic music track with ambient sounds and futuristic themes.",
    tags: ["electronic", "ambient", "futuristic", "soundtrack"]
  },
  {
    id: "meta-003",
    title: "Urban Stories",
    creator: "Documentary Films",
    type: "Video",
    dateCreated: new Date(2023, 7, 28),
    status: "Pending",
    ipfsHash: "QmX6j9DHCCbJ3YEVz9TUTf8kxcEwgX2qJNUNMuRNe9iKnQ",
    chainId: "0x89",
    description: "A short documentary exploring urban life and culture in major cities.",
    tags: ["documentary", "urban", "culture", "short film"]
  },
  {
    id: "meta-004",
    title: "Digital Dreams",
    creator: "Tech Writers Collective",
    type: "Text",
    dateCreated: new Date(2023, 7, 20),
    status: "Verified",
    ipfsHash: "QmRA3NWM4ue3GQVHZkQuR1dvYLVU4TJLhP6ZCKpYJgZxpw",
    chainId: "0x1",
    description: "A collection of short stories exploring the intersection of technology and human experience.",
    tags: ["fiction", "technology", "anthology", "digital age"]
  },
  {
    id: "meta-005",
    title: "Abstract Thoughts",
    creator: "Modern Art Collective",
    type: "Image",
    dateCreated: new Date(2023, 7, 15),
    status: "Rejected",
    ipfsHash: "QmSgvgwxZGMrjhgjJdRChEWDuyNpgguGz3d8YTCWco4xVV",
    chainId: "0x89",
    description: "A series of abstract digital artworks exploring consciousness and perception.",
    tags: ["abstract", "digital art", "consciousness", "perception"]
  }
];

export const MetadataPage: FC = () => {
  const [selectedMetadata, setSelectedMetadata] = useState<IPMetadata | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleRowClick = (metadata: IPMetadata) => {
    setSelectedMetadata(metadata);
    setIsCreating(false);
  };

  const handleCreateNew = () => {
    setIsCreating(true);
    setSelectedMetadata(null);
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
        <h1 className="text-3xl font-bold text-white">IP Metadata</h1>
        <div className="flex items-center space-x-4">
          <button 
            className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
            onClick={handleCreateNew}
          >
            Create New
          </button>
          <button className="rounded-lg border border-gray-700 bg-[#1f1f1f] px-4 py-2 text-sm font-medium text-white hover:bg-[#2a2a2a]">
            Import Metadata
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Metadata List */}
        <div className="lg:col-span-2">
          <div className="rounded-xl bg-[#1f1f1f] shadow-sm">
            <div className="border-b border-gray-800 px-6 py-4">
              <h2 className="text-xl font-semibold text-white">IP Assets</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-separate border-spacing-0">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="whitespace-nowrap px-6 py-4 text-left text-xs font-normal text-gray-500">
                      Title
                    </th>
                    <th className="whitespace-nowrap px-4 py-4 text-left text-xs font-normal text-gray-500">
                      Creator
                    </th>
                    <th className="whitespace-nowrap px-4 py-4 text-left text-xs font-normal text-gray-500">
                      Type
                    </th>
                    <th className="whitespace-nowrap px-4 py-4 text-left text-xs font-normal text-gray-500">
                      Date Created
                    </th>
                    <th className="whitespace-nowrap px-4 py-4 text-center text-xs font-normal text-gray-500">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {mockMetadata.map((metadata) => (
                    <tr
                      key={metadata.id}
                      className={`border-b border-gray-800/50 transition-colors hover:bg-[#2a2a2a] cursor-pointer ${
                        selectedMetadata?.id === metadata.id ? "bg-[#2a2a2a]" : ""
                      }`}
                      onClick={() => handleRowClick(metadata)}
                    >
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-white">
                        {metadata.title}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-300">
                        {metadata.creator}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-300">
                        {metadata.type}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-400">
                        {metadata.dateCreated.toLocaleDateString()}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-center">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                            metadata.status === "Verified"
                              ? "bg-green-500/20 text-green-400"
                              : metadata.status === "Pending"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {metadata.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Metadata Details or Create Form */}
        <div className="lg:col-span-1">
          <div className="rounded-xl bg-[#1f1f1f] shadow-sm">
            <div className="border-b border-gray-800 px-6 py-4">
              <h2 className="text-xl font-semibold text-white">
                {isCreating ? "Create New IP" : "IP Details"}
              </h2>
            </div>
            {isCreating ? (
              <div className="p-6">
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Title</label>
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-md border border-gray-700 bg-[#2a2a2a] px-3 py-2 text-white shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                      placeholder="Enter title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Creator</label>
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-md border border-gray-700 bg-[#2a2a2a] px-3 py-2 text-white shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                      placeholder="Enter creator name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Type</label>
                    <select
                      className="mt-1 block w-full rounded-md border border-gray-700 bg-[#2a2a2a] px-3 py-2 text-white shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    >
                      <option>Music</option>
                      <option>Image</option>
                      <option>Video</option>
                      <option>Text</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Description</label>
                    <textarea
                      rows={3}
                      className="mt-1 block w-full rounded-md border border-gray-700 bg-[#2a2a2a] px-3 py-2 text-white shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                      placeholder="Enter description"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Tags</label>
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-md border border-gray-700 bg-[#2a2a2a] px-3 py-2 text-white shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                      placeholder="Enter tags separated by commas"
                    />
                  </div>
                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                    >
                      Create IP Asset
                    </button>
                  </div>
                </form>
              </div>
            ) : selectedMetadata ? (
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-white">{selectedMetadata.title}</h3>
                  <p className="text-sm text-gray-400">by {selectedMetadata.creator}</p>
                </div>

                <div className="mb-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg bg-[#2a2a2a] p-4">
                      <p className="text-xs text-gray-400">Type</p>
                      <p className="text-sm font-semibold text-white">{selectedMetadata.type}</p>
                    </div>
                    <div className="rounded-lg bg-[#2a2a2a] p-4">
                      <p className="text-xs text-gray-400">Date Created</p>
                      <p className="text-sm font-semibold text-white">
                        {selectedMetadata.dateCreated.toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-lg bg-[#2a2a2a] p-4">
                    <p className="text-xs text-gray-400">Description</p>
                    <p className="text-sm text-white">{selectedMetadata.description}</p>
                  </div>

                  <div className="rounded-lg bg-[#2a2a2a] p-4">
                    <p className="text-xs text-gray-400">IPFS Hash</p>
                    <a
                      href={`https://ipfs.io/ipfs/${selectedMetadata.ipfsHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-sm text-blue-400 hover:text-blue-300"
                    >
                      {selectedMetadata.ipfsHash}
                      <ExternalLinkIcon />
                    </a>
                  </div>

                  <div className="rounded-lg bg-[#2a2a2a] p-4">
                    <p className="text-xs text-gray-400">Chain ID</p>
                    <p className="text-sm text-white">{selectedMetadata.chainId}</p>
                  </div>

                  <div className="rounded-lg bg-[#2a2a2a] p-4">
                    <p className="text-xs text-gray-400">Tags</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedMetadata.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="rounded-full bg-gray-700 px-2 py-1 text-xs text-gray-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700">
                    Verify on Chain
                  </button>
                  <button className="rounded-lg border border-gray-700 bg-[#2a2a2a] px-4 py-2 text-sm font-medium text-white hover:bg-[#333333]">
                    Edit Metadata
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex h-[400px] items-center justify-center p-6">
                <p className="text-center text-gray-500">
                  Select an IP asset to view details or create a new one
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 