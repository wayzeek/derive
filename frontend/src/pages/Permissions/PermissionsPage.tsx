import { PermissionsTable } from "../../components/permissions/PermissionsTable";

const SAMPLE_WALLETS = [
  {
    name: "Story Protocol",
    address: "0x9FC3da86...a70f010c8",
    category: "Protocol",
  },
  {
    name: "Derive",
    address: "0x5e6f7g8h...9i0j1k2l",
    category: "Protocol",
  },
  {
    name: "a16z",
    address: "0x3m4n5o6p...7q8r9s0t",
    category: "Investor",
  },
  {
    name: "Variant Fund",
    address: "0x1u2v3w4x...5y6z7a8b",
    category: "Investor",
  },
  {
    name: "Coinbase Ventures",
    address: "0x9c0d1e2f...3g4h5i6j",
    category: "Investor",
  },
  {
    name: "Community Multisig",
    address: "0x7k8l9m0n...1o2p3q4r",
    category: "Community",
  },
  {
    name: "Creator DAO",
    address: "0x8s9t0u1v...2w3x4y5z",
    category: "Community",
  },
];

export const PermissionsPage = () => {
  return (
    <div className="py-6 pr-6">
      <h1 className="mb-6 text-2xl font-semibold text-white">Permissions</h1>
      <p className="mb-6 text-gray-400">Manage permissions for protocol stakeholders and community members.</p>
      
      <div className="mb-8 overflow-hidden rounded-lg bg-[#1f1f1f]">
        <PermissionsTable
          wallets={SAMPLE_WALLETS}
          requiredSignatures={4}
          totalSignatures={7}
          customText="4 out of 7 signatures required from permissions"
        />
      </div>
    </div>
  );
};
