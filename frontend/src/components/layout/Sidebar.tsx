import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import { useAccount, useConnect, useDisconnect } from "wagmi";

// Main navigation items (including Permissions)
const navigation = [
  { name: "Overview", path: "/overview", icon: "/Overview.svg" },
  { name: "Submissions", path: "/submissions", icon: "/Submissions.svg" },
  { name: "Metadata", path: "/metadata", icon: "/Metadata.svg" },
  { name: "Royalties", path: "/royalties", icon: "/Royalties.svg" },
  {
    name: "Distributions",
    path: "/distributions",
    icon: "/Distributions.svg",
    comingSoon: true,
  },
  { name: "Permissions", path: "/permissions", icon: "/Permissions.svg" },
];

interface SidebarProps {
  isWalletConnected?: boolean;
}

export const Sidebar = ({ isWalletConnected = false }: SidebarProps) => {
  const { connector } = useAccount();
  const { disconnect } = useDisconnect();
  const { connectors, connectAsync } = useConnect();
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const navigate = useNavigate();

  // Get the connector name for display
  const connectorName = connector?.name || "Wallet";
  const displayName = connectorName === "MetaMask" ? "Injected" : connectorName;

  const handleConnectWallet = async () => {
    try {
      const connector = connectors.find((c) => c.id === "injected");
      if (connector) {
        await connectAsync({ connector });
        setIsConnectModalOpen(false);
      }
    } catch (error) {
      console.error("Failed to connect:", error);
    }
  };

  return (
    <aside className="fixed left-0 top-0 flex h-screen w-[315px] flex-col bg-[#0F0F0F] p-3 overflow-y-auto">
      {/* Main Container with dark background */}
      <div className="flex flex-1 flex-col rounded-3xl bg-[#1f1f1f] p-3">
        {/* Logo */}
        <div className="mb-4 flex items-center gap-3">
          <div
            className="rounded-full bg-[#1f1f1f] p-2 cursor-pointer transition-transform hover:scale-105"
            onClick={() => navigate("/demo/universal")}
            title="Access Universal Music Demo"
          >
            <img src="/derive.png" alt="Dérive Logo" className="h-10 w-10" />
          </div>
          <span className="text-2xl font-bold text-white">Dérive</span>
        </div>

        {/* Token and Navigation Container */}
        <div className="mb-2 rounded-2xl bg-[#0F0F0F] p-2">
          {/* Token Selection - Only show when connected */}
          {isWalletConnected && (
            <>
              <div className="mb-2">
                <button className="flex w-full items-center justify-between rounded-lg bg-[#1f1f1f] px-2 py-1.5 text-white hover:bg-[#1A1A1A]">
                  <div className="flex items-center gap-3">
                    <img
                      src="https://cryptologos.cc/logos/usd-coin-usdc-logo.svg"
                      alt="USDC"
                      className="h-8 w-8"
                    />
                    <span>Token #1</span>
                  </div>
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>

              {/* Divider */}
              <div className="mb-2 h-[1px] bg-[#1A1A1A]" />
            </>
          )}

          {/* Main Navigation */}
          <nav>
            <div className="py-0.5">
              <ul className="space-y-1">
                {navigation.map((item) => (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        `mx-1 flex items-center gap-3 rounded-lg px-2 py-2 font-medium transition-colors duration-200 ${
                          isActive
                            ? "border border-[#1A1A1A] bg-[#1f1f1f] text-white before:absolute before:right-0 before:top-1/2 before:h-5 before:w-1 before:-translate-y-1/2 before:rounded-l-lg before:bg-[#60A5FA]"
                            : "text-[#D6D6D6] hover:bg-[#1A1A1A] hover:text-white"
                        } relative`
                      }
                    >
                      <img src={item.icon} alt="" className="h-5 w-5" />
                      <span>{item.name}</span>
                      {item.comingSoon && (
                        <span className="ml-auto rounded bg-[#1A1A1A] px-1.5 py-0.5 text-xs text-[#71717A]">
                          Coming Soon
                        </span>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-1 flex-col justify-end">
          {/* User Section or Connect Wallet Button */}
          {isWalletConnected ? (
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1D4ED8]">
                  <img
                    src={
                      connector?.name === "MetaMask"
                        ? "/metamask-icon.svg"
                        : "/wallet-icon.svg"
                    }
                    alt=""
                    className="h-5 w-5"
                  />
                </div>
                <div>
                  <div className="text-sm text-[#71717A]">Connected as</div>
                  <div className="font-medium text-white">{displayName}</div>
                </div>
              </div>
              <button
                onClick={() => disconnect()}
                className="text-[#71717A] transition-colors hover:text-white"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <div className="px-2">
              <button
                onClick={() => handleConnectWallet()}
                className="flex w-full items-center justify-start gap-3 rounded-lg px-4 py-3 font-medium text-white transition-colors duration-200 bg-[#0F0F0F] hover:bg-[#1A1A1A]"
              >
                <img src="/wallet-icon.svg" alt="" className="h-5 w-5" />
                <span>Connect Wallet</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Connect Modal */}
      {isConnectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-[320px] rounded-2xl bg-[#1f1f1f] p-6">
            <h2 className="mb-4 text-center text-xl font-semibold text-white">
              Connect Wallet
            </h2>

            <button
              onClick={handleConnectWallet}
              className="group mb-4 flex w-full items-center justify-between rounded-lg bg-[#1A1A1A] p-3 transition-colors hover:bg-[#323232] active:bg-[#1A1A1A]"
            >
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded bg-white/10"></div>
                <span className="text-sm text-white">Browser Wallet</span>
              </div>
              <span className="text-white/50 transition-colors group-hover:text-white">
                →
              </span>
            </button>

            <button
              onClick={() => setIsConnectModalOpen(false)}
              className="mt-4 flex w-full items-center justify-center text-sm text-gray-500 transition-colors hover:text-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};
