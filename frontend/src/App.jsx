import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Services from "./pages/Services";
import Appointments from "./pages/Appointments";

function Nav() {
  const token = localStorage.getItem("accessToken");
  const location = useLocation();

  if (!token || location.pathname === "/login") return null;

  return (
    <div className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-slate-900 text-white grid place-items-center font-bold">
            A
          </div>
          <div>
            <div className="text-sm font-semibold leading-4">Appointment SaaS</div>
            <div className="text-xs text-slate-500">Multi-tenant dashboard</div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Link className="rounded-xl px-3 py-2 hover:bg-slate-100" to="/dashboard">Dashboard</Link>
          <Link className="rounded-xl px-3 py-2 hover:bg-slate-100" to="/services">Services</Link>
          <Link className="rounded-xl px-3 py-2 hover:bg-slate-100" to="/appointments">Appointments</Link>
        </div>
      </div>
    </div>
  );
}

function PageShell({ children }) {
  return <div className="mx-auto max-w-6xl px-4 py-6">{children}</div>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Nav />
      <PageShell>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/services" element={<Services />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </PageShell>
    </BrowserRouter>
  );
}
