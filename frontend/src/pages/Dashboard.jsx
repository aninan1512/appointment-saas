import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/axios";

function prettyRole(role) {
  if (!role) return "User";
  return role.charAt(0) + role.slice(1).toLowerCase();
}

export default function Dashboard() {
  const [me, setMe] = useState(null);
  const [msg, setMsg] = useState("Loading your workspace...");

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/api/users/me");
        setMe(res.data.user);
        setMsg("");
      } catch (err) {
        setMsg("Session expired. Redirecting to login...");
        setTimeout(() => (window.location.href = "/login"), 800);
      }
    }
    load();
  }, []);

  async function logout() {
    try {
      await api.post("/api/auth/logout");
    } finally {
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-slate-600">
            {me ? `Welcome back — you’re signed in as ${prettyRole(me.role)}.` : msg}
          </p>
        </div>

        <button
          onClick={logout}
          className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-slate-50"
        >
          Logout
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-sm font-semibold">Quick Actions</div>
          <div className="mt-3 grid gap-2">
            <Link className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm hover:bg-slate-100" to="/services">
              + Create / Manage Services
            </Link>
            <Link className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm hover:bg-slate-100" to="/appointments">
              + Book an Appointment
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-sm font-semibold">Your Workspace</div>
          {me ? (
            <div className="mt-3 space-y-2 text-sm">
              <div><span className="text-slate-500">Role:</span> <span className="font-medium">{prettyRole(me.role)}</span></div>
              <div className="break-all"><span className="text-slate-500">Tenant ID:</span> <span className="font-mono text-xs">{me.tenantId}</span></div>
              <div className="break-all"><span className="text-slate-500">User ID:</span> <span className="font-mono text-xs">{me.sub}</span></div>
            </div>
          ) : (
            <p className="mt-3 text-sm text-slate-600">{msg}</p>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-sm font-semibold">Tips</div>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
            <li>Create 2 services (30 mins, 60 mins)</li>
            <li>Book a test appointment and try cancel/complete</li>
            <li>Verify tenant isolation in MongoDB Atlas</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
