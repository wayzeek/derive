import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import { OverviewPage } from "../pages/Overview/OverviewPage";
import { PermissionsPage } from "../pages/Permissions/PermissionsPage";
import { TransactionsPage } from "../pages/Transactions/TransactionsPage";
import { UniversalMusicDemo } from "../pages/Demo/UniversalMusicDemo";
import { Home } from "../pages/Home/HomePage";
import { SubmissionsPage } from "../pages/Submissions/SubmissionsPage";
import { MetadataPage } from "../pages/Metadata/MetadataPage";
import { RoyaltiesPage } from "../pages/Royalties/RoyaltiesPage";
import { DistributionsPage } from "../pages/Distributions/DistributionsPage";

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
