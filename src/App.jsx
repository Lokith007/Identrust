import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Layout.jsx";

// Pages
import Dashboard from "./Pages/Dashboard.jsx";
import Wallet from "./Pages/Wallet.jsx";
import Issue from "./Pages/Issue.jsx";
import Settings from "./Pages/Settings.jsx";
import Demos from "./Pages/Demos.jsx";
import Verify from "./Pages/verify.jsx";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/issue" element={<Issue />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/demos" element={<Demos />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
