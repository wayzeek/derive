import { useState } from "react";

import { TransactionsTable } from "../../components/Stats/TransactionsTable";

type TransactionType = "All" | "Mint" | "Burn" | "Yield" | "Transfer";

const SAMPLE_TRANSACTIONS = [
  {
    type: "Mint" as const,
    txHash: "0xa8befa4f9e9a",
    timestamp: new Date(Date.now() - 1000 * 60), // 1 min ago
    from: "Null: 0x000...000",
    to: "Treasury",
    status: "Pending" as const,
    quantity: 12412,
  },
  {
    type: "Burn" as const,
    txHash: "0xa8befa4f9e9a",
    timestamp: new Date(Date.now() - 1000 * 60 * 12), // 12 mins ago
    from: "Base: Batch Sender",
    to: "Null: 0x000...000",
    status: "Pending" as const,
    quantity: 12,
  },
  {
    type: "Mint" as const,
    txHash: "0xa8befa4f9e9a",
    timestamp: new Date(Date.now() - 1000 * 60 * 56), // about 1 hour ago
    from: "0x73f7b118...2a251dd58",
    to: "Treasury",
    status: "Complete" as const,
    quantity: 24921,
  },
  {
    type: "Burn" as const,
    txHash: "0xa8befa4f9e9a",
    timestamp: new Date(Date.now() - 1000 * 60 * 120), // about 2 hours ago
    from: "0x9FC3da86...a70f010c8",
    to: "0x9FC3da86...a70f010c8",
    status: "Failed" as const,
    quantity: 314,
  },
  {
    type: "Burn" as const,
    txHash: "0xa8befa4f9e9a",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12), // 12 days ago
    from: "Treasury",
    to: "0x9FC3da86...a70f010c8",
    status: "Complete" as const,
    quantity: 88721,
  },
];

export const TransactionsPage = () => {
  const [activeFilter, setActiveFilter] = useState<TransactionType>("All");

  return (
    <div className="py-6 pr-6">
      <div className="mb-4 rounded-lg bg-[#1f1f1f]">
        <div className="flex p-4">
          {(["All", "Mint", "Burn", "Yield", "Transfer"] as const).map(
            (type) => (
              <button
                key={type}
                onClick={() => setActiveFilter(type)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  activeFilter === type
                    ? "text-white"
                    : "text-text-secondary hover:text-white"
                }`}
              >
                {type}
              </button>
            ),
          )}
        </div>
      </div>
      <div className="rounded-lg bg-[#1f1f1f]">
        <TransactionsTable
          transactions={
            activeFilter === "All"
              ? SAMPLE_TRANSACTIONS
              : SAMPLE_TRANSACTIONS.filter((tx) => tx.type === activeFilter)
          }
        />
      </div>
    </div>
  );
};
