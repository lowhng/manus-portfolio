import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ServicesPage } from "../demo/pages/ServicesPage";
import { HomePage } from "./pages/HomePage";

function routerBasename(): string | undefined {
  const path = window.location.pathname;
  if (path === "/demo2" || path.startsWith("/demo2/")) return "/demo2";
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
