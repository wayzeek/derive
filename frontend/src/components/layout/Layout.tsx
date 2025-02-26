import { Sidebar } from "./Sidebar";

interface LayoutProps {
  children: React.ReactNode;
  isWalletConnected?: boolean;
}

export const Layout = ({
  children,
  isWalletConnected = false,
}: LayoutProps) => {
  return (
    <div className="flex min-h-screen">
      <Sidebar isWalletConnected={isWalletConnected} />
      <main className="ml-[315px] flex-1 overflow-auto bg-[#0F0F0F]">
        {children}
      </main>
    </div>
  );
};
