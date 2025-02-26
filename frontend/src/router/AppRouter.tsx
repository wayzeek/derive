import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import { OverviewPage } from "../pages/Overview/OverviewPage";
import { PermissionsPage } from "../pages/Permissions/PermissionsPage";
import { TransactionsPage } from "../pages/Transactions/TransactionsPage";
import { UniversalMusicDemo } from "../pages/Demo/UniversalMusicDemo";
import { Home } from "../pages/Home/HomePage";

// Placeholder components for new pages
const SubmissionsPage = () => (
  <div className="p-8">
    <h1 className="mb-4 text-2xl font-semibold">Submissions</h1>
    <p className="text-text-secondary">
      This page will display music rights submission management.
    </p>
  </div>
);

const MetadataPage = () => (
  <div className="p-8">
    <h1 className="mb-4 text-2xl font-semibold">Metadata</h1>
    <p className="text-text-secondary">
      This page will display music metadata management.
    </p>
  </div>
);

const RoyaltiesPage = () => (
  <div className="p-8">
    <h1 className="mb-4 text-2xl font-semibold">Royalties</h1>
    <p className="text-text-secondary">
      This page will display music royalties management.
    </p>
  </div>
);

const DistributionsPage = () => (
  <div className="p-8">
    <h1 className="mb-4 text-2xl font-semibold">Distributions</h1>
    <p className="text-text-secondary">
      This page will display music royalty distributions management.
    </p>
  </div>
);

export const AppRouter = () => {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      {/* Main navigation routes */}
      <Route path="/" element={<Home />} />
      <Route path="/overview" element={<OverviewPage />} />
      <Route path="/submissions" element={<SubmissionsPage />} />
      <Route path="/metadata" element={<MetadataPage />} />
      <Route path="/royalties" element={<RoyaltiesPage />} />
      <Route path="/distributions" element={<DistributionsPage />} />
      <Route path="/permissions" element={<PermissionsPage />} />

      {/* Secret demo page */}
      <Route path="/demo/universal" element={<UniversalMusicDemo />} />

      {/* Legacy routes - still accessible but not in sidebar */}
      <Route path="/transactions" element={<TransactionsPage />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
