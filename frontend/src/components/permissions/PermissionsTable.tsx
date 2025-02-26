import { FC } from "react";

interface Wallet {
  name: string;
  address: string;
  category?: string;
}

interface PermissionsTableProps {
  wallets: Wallet[];
  requiredSignatures: number;
  totalSignatures: number;
  customText?: string;
}

export const PermissionsTable: FC<PermissionsTableProps> = ({
  wallets,
  requiredSignatures,
  totalSignatures,
  customText,
}) => {
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

  // Group wallets by category
  const walletsByCategory = wallets.reduce((acc, wallet) => {
    const category = wallet.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(wallet);
    return acc;
  }, {} as Record<string, Wallet[]>);

  // Order categories
  const categoryOrder = ['Protocol', 'Investor', 'Community', 'Other'];
  const sortedCategories = Object.keys(walletsByCategory).sort(
    (a, b) => categoryOrder.indexOf(a) - categoryOrder.indexOf(b)
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <p className="text-xs text-gray-500">
          {customText || `${requiredSignatures} out of ${totalSignatures} signatures required`}
        </p>
      </div>
      
      {sortedCategories.map((category) => (
        <div key={category} className="mb-6">
          <h3 className="mb-3 text-sm font-medium text-white">{category}</h3>
          <div className="flex flex-col gap-2">
            {walletsByCategory[category].map((wallet) => (
              <div
                key={wallet.address}
                className="flex rounded-lg bg-[#0D0E0F] px-6 py-4"
              >
                <div className="w-1/3">
                  <span className="text-sm text-gray-100">{wallet.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">–</span>
                  <a
                    href={`https://etherscan.io/address/${wallet.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm text-gray-400 hover:text-gray-300"
                  >
                    {wallet.address}
                    <ExternalLinkIcon />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}; 