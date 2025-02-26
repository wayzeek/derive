import { FC } from "react";

import { formatDistanceToNow } from "date-fns";

interface Transaction {
  type: "Mint" | "Burn";
  txHash: string;
  timestamp: Date;
  from: string;
  to: string;
  status: "Pending" | "Complete" | "Failed";
  quantity: number;
}

interface TransactionsTableProps {
  transactions: Transaction[];
}

export const TransactionsTable: FC<TransactionsTableProps> = ({
  transactions,
}) => {
  const MintIcon = () => (
    <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" />
    </svg>
  );

  const ArrowIcon = () => (
    <svg
      className="h-4 w-4 text-white"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 14l-7 7m0 0l-7-7m7 7V3"
      />
    </svg>
  );

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

  const TransferArrow = () => (
    <div className="flex h-6 w-6 items-center justify-center rounded bg-[#1d4ed8] bg-opacity-20">
      <svg
        className="h-4 w-4 text-[#3b82f6]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </svg>
    </div>
  );

  return (
    <div className="overflow-x-auto pb-4 pr-4 pt-6">
      <table className="w-full border-separate border-spacing-0">
        <thead>
          <tr className="border-b border-gray-800">
            <th className="font-normal pb-4 pl-6 pr-4 text-left text-xs text-gray-500">
              TX Type
            </th>
            <th className="font-normal px-4 pb-4 text-left text-xs text-gray-500">
              TX Hash
            </th>
            <th className="font-normal whitespace-nowrap px-4 pb-4 text-left text-xs text-gray-500">
              Timestamp
            </th>
            <th className="font-normal px-4 pb-4 text-left text-xs text-gray-500">
              From
            </th>
            <th className="w-6"></th>
            <th className="font-normal px-4 pb-4 text-left text-xs text-gray-500">
              To
            </th>
            <th className="font-normal px-4 pb-4 text-left text-xs text-gray-500">
              Status
            </th>
            <th className="font-normal px-4 pb-4 text-right text-xs text-gray-500">
              Quantity
            </th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr
              key={tx.txHash}
              className="border-b border-gray-800/50 transition-colors hover:bg-[#1f2937]"
            >
              <td className="py-4 pl-6 pr-4">
                <div className="flex items-center gap-2">
                  {tx.type === "Mint" ? (
                    <span className="text-emerald-400">
                      <MintIcon />
                    </span>
                  ) : (
                    <span className="text-red-400">
                      <ArrowIcon />
                    </span>
                  )}
                  <span className="text-sm text-gray-100">{tx.type}</span>
                </div>
              </td>
              <td className="px-4 py-4">
                <a
                  href={`https://etherscan.io/tx/${tx.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-sm text-gray-400 hover:text-gray-300"
                >
                  {tx.txHash}
                  <ExternalLinkIcon />
                </a>
              </td>
              <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500">
                {formatDistanceToNow(tx.timestamp, { addSuffix: true })}
              </td>
              <td className="px-4 py-4">
                <a
                  href={`https://etherscan.io/address/${tx.from}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-sm text-gray-400 hover:text-gray-300"
                >
                  {tx.from}
                  <ExternalLinkIcon />
                </a>
              </td>
              <td className="py-4">
                <TransferArrow />
              </td>
              <td className="px-4 py-4">
                <a
                  href={`https://etherscan.io/address/${tx.to}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-sm text-gray-400 hover:text-gray-300"
                >
                  {tx.to}
                  <ExternalLinkIcon />
                </a>
              </td>
              <td className="px-4 py-4">
                <span
                  className={`rounded px-2.5 py-1 text-xs font-medium ${tx.status === "Complete" ? "bg-emerald-500/20 text-emerald-400" : ""} ${tx.status === "Pending" ? "bg-gray-700 text-gray-300" : ""} ${tx.status === "Failed" ? "bg-red-500/20 text-red-400" : ""} `}
                >
                  {tx.status}
                </span>
              </td>
              <td className="px-4 py-4 text-right text-sm tabular-nums text-gray-100">
                {tx.quantity.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
