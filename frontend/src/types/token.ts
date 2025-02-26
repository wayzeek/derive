export interface TokenHolder {
  address: string;
  balance: string;
  ownershipPercentage: number;
  rank: number;
}

export interface TokenStats {
  name: string;
  symbol: string;
  standard: string;
  maxSupply: string;
  totalSupply: string;
  totalMinted: string;
  totalBurned: string;
  totalHolders: number;
}

export interface Token {
  id: string;
  name: string;
  symbol: string;
  standard: string;
  icon?: string;
  stats: TokenStats;
  holders: TokenHolder[];
}
