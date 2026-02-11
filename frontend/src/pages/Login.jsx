import { useState } from "react";
import { api } from "../api/axios";

export default function Login() {
  const [tenantSlug, setTenantSlug] = useState("acme-dental");
  const [email, setEmail] = useState("owner@acme.com");
  const [password, setPassword] = useState("StrongPass123!");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      const res = await api.post("/api/auth/login", { tenantSlug, email, password });
      localStorage.setItem("accessToken", res.data.accessToken);
      window.location.href = "/dashboard";
    } catch (err) {
      setMsg(err?.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-[calc(100vh-48px)] overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950" />

      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-indigo-500/25 blur-3xl" />
      <div className="pointer-events-none absolute top-24 -right-24 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-fuchsia-500/15 blur-3xl" />

      <div className="relative mx-auto flex max-w-6xl items-center justify-center px-4 py-16">
        <div className="grid w-full max-w-4xl gap-8 md:grid-cols-2">
          {/* Left: Branding */}
          <div className="hidden md:flex flex-col justify-center">
            <div className="inline-flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-white/10 ring-1 ring-white/15 grid place-items-center text-white font-bold">
                A
              </div>
              <div>
                <div className="text-white text-xl font-semibold leading-5">Appointment SaaS</div>
                <div className="text-white/70 text-sm">Multi-tenant scheduling platform</div>
              </div>
            </div>

            <h1 className="mt-8 text-3xl font-semibold text-white leading-tight">
              Run bookings like a real product.
            </h1>

            <p className="mt-3 text-white/70">
              Manage services, book appointments, and keep everything isolated per tenant — production-style MERN.
            </p>

            <div className="mt-6 grid gap-3 text-sm text-white/70">
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Secure login (JWT + refresh)
              </div>
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-cyan-300" />
                Tenant isolation by design
              </div>
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-fuchsia-300" />
                Services + appointments workflow
              </div>
            </div>
          </div>

          {/* Right: Login Card */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-md">
            <div className="md:hidden mb-5">
              <div className="text-white text-xl font-semibold">Appointment SaaS</div>
              <div className="text-white/70 text-sm">Multi-tenant scheduling</div>
            </div>

            <h2 className="text-white text-2xl font-semibold">Sign in</h2>
            <p className="mt-1 text-white/70 text-sm">
              Use your tenant slug, email and password to continue.
            </p>

            <form onSubmit={handleLogin} className="mt-6 grid gap-4">
              <div>
                <label className="text-xs text-white/70">Tenant Slug</label>
                <input
                  className="mt-1 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:ring-2 focus:ring-indigo-400/40"
                  value={tenantSlug}
                  onChange={(e) => setTenantSlug(e.target.value)}
                  placeholder="acme-dental"
                  autoComplete="organization"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-white/70">Email</label>
                <input
                  className="mt-1 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:ring-2 focus:ring-indigo-400/40"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="owner@acme.com"
                  type="email"
                  autoComplete="email"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-white/70">Password</label>
                <input
                  className="mt-1 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:ring-2 focus:ring-indigo-400/40"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  type="password"
                  autoComplete="current-password"
                  required
                />
              </div>

              {msg && (
                <div className="rounded-2xl border border-rose-300/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                  {msg}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-1 inline-flex items-center justify-center rounded-2xl bg-indigo-500 px-4 py-3 text-sm font-medium text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-400 disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>

              <div className="text-xs text-white/60">
                Tip: create a tenant via <span className="font-mono">/api/auth/register</span> first, then log in.
              </div>
            </form>

            <div className="mt-8 border-t border-white/10 pt-4 text-xs text-white/60">
              Built with MERN + MongoDB Atlas • JWT auth • Multi-tenant design
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
