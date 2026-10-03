import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { ServicesPage } from "./pages/ServicesPage";

/** Local preview uses /demo/*; demo.weihong.dev is rewritten so the browser path is /. */
function routerBasename(): string | undefined {
  const path = window.location.pathname;
  if (path === "/demo" || path.startsWith("/demo/")) return "/demo";
  return undefined;
}

export default function App() {
  return (
    <BrowserRouter basename={routerBasename()}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
