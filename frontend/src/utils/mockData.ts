import { Token } from "@/types/token";

export const mockTokens: Token[] = [
  {
    id: "1",
    name: "USDC",
    symbol: "USDC",
    standard: "ERC-20",
    icon: "https://cryptologos.cc/logos/usd-coin-usdc-logo.svg",
    stats: {
      name: "USDC",
      symbol: "USDC",
      standard: "ERC-20",
      maxSupply: "∞",
      totalSupply: "5,000,000 USDX",
      totalMinted: "US$97B",
      totalBurned: "US$97B",
      totalHolders: 2521,
    },
    holders: [
      {
        address: "0xAbC...1234",
        balance: "425,195.68",
        ownershipPercentage: 25,
        rank: 1,
      },
      {
        address: "0xAbC...1234",
        balance: "301,105.88",
        ownershipPercentage: 14,
        rank: 2,
      },
      {
        address: "0xAbC...1234",
        balance: "108,502.02",
        ownershipPercentage: 8,
        rank: 3,
      },
      {
        address: "0xAbC...1234",
        balance: "102,095.53",
        ownershipPercentage: 6,
        rank: 4,
      },
      {
        address: "0xAbC...1234",
        balance: "102,095.53",
        ownershipPercentage: 6,
        rank: 5,
      },
      {
        address: "0xAbC...1234",
        balance: "102,095.53",
        ownershipPercentage: 6,
        rank: 6,
      },
      {
        address: "0xAbC...1234",
        balance: "102,095.53",
        ownershipPercentage: 6,
        rank: 7,
      },
      {
        address: "0xAbC...1234",
        balance: "102,095.53",
        ownershipPercentage: 6,
        rank: 8,
      },
    ],
  },
];
