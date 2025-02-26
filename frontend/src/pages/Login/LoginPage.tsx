import { useConnect } from "wagmi";

export const LoginPage = () => {
  const { connectors, connectAsync } = useConnect();

  const handleBrowserWallet = async () => {
    try {
      const connector = connectors.find((c) => c.id === "injected");
      if (connector) {
        await connectAsync({ connector });
      }
    } catch (error) {
      console.error("Failed to connect:", error);
    }
  };

  const handleCoinbaseWallet = async () => {
    try {
      const connector = connectors.find((c) => c.id === "coinbaseWallet");
      if (connector) {
        await connectAsync({ connector });
      }
    } catch (error) {
      console.error("Failed to connect:", error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-[320px] rounded-2xl bg-[#1f1f1f] p-8">
        {/* Logo */}
        <div className="mb-4 flex justify-center">
          <div className="rounded-full bg-black p-2">
            <img src="/derive.png" alt="Dérive Logo" className="h-10 w-10" />
          </div>
        </div>

        {/* Title */}
        <h1 className="mb-8 text-center text-xl font-semibold text-white">
          Login to
          <br />
          Dérive
        </h1>

        {/* Wallet Options */}
        <div className="space-y-2">
          <button
            onClick={handleBrowserWallet}
            className="group flex w-full items-center justify-between rounded-lg bg-[#1A1A1A] p-3 transition-colors hover:bg-[#323232] active:bg-[#1A1A1A]"
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
            onClick={handleCoinbaseWallet}
            className="group flex w-full items-center justify-between rounded-lg bg-[#1A1A1A] p-3 transition-colors hover:bg-[#323232] active:bg-[#1A1A1A]"
          >
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-white/10"></div>
              <span className="text-sm text-white">Coinbase Wallet</span>
            </div>
            <span className="text-white/50 transition-colors group-hover:text-white">
              →
            </span>
          </button>

          <button className="group flex w-full items-center justify-between rounded-lg bg-[#1D4ED8] p-3 text-white transition-colors hover:bg-[#323232]">
            <div className="flex items-center gap-2">
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 3H7C5.89543 3 5 3.89543 5 5V19C5 20.1046 5.89543 21 7 21H15"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 12L9 12M19 12L16 9M19 12L16 15"
                />
              </svg>
              <span className="text-sm">Login</span>
            </div>
            <span className="text-white/70 transition-colors group-hover:text-white">
              →
            </span>
          </button>
        </div>

        {/* Return Link */}
        <button
          onClick={() => window.history.back()}
          className="mt-6 flex w-full items-center justify-center gap-2 text-sm text-gray-500 transition-colors hover:text-gray-300"
        >
          Return to website
        </button>
      </div>
    </div>
  );
};
