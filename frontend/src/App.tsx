import { useLocation } from "react-router-dom";

import { AnimatePresence } from "framer-motion";
import { useAccount } from "wagmi";

import { Layout } from "./components/Layout/Layout";
import { PageTransition } from "./components/Transitions/PageTransition";
import { AppRouter } from "./router/AppRouter";

function App() {
  const { isConnected } = useAccount();
  const location = useLocation();

  // Check if the current route is the Universal Music Demo page or the Home page
  const isUniversalMusicDemo = location.pathname === "/demo/universal";
  const isHomePage = location.pathname === "/";
  const shouldHideSidebar = isUniversalMusicDemo || isHomePage;

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {shouldHideSidebar ? (
          <PageTransition key={location.pathname}>
            <AppRouter />
          </PageTransition>
        ) : (
          <Layout key="layout" isWalletConnected={isConnected}>
            <PageTransition key={location.pathname}>
              <AppRouter />
            </PageTransition>
          </Layout>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
