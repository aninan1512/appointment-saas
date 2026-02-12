import { useEffect, useState } from "react";
import { api } from "../axios";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await api.get("/api/dashboard/stats");
        setStats(res.data.data);
      } catch (e) {
        setError("Failed to load dashboard stats.");
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) return <div className="p-6">Loading dashboard…</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  const byStatus = stats?.byStatus || {};

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Services" value={stats.totalServices} />
        <StatCard title="Total Appointments" value={stats.totalAppointments} />
        <StatCard title="Today’s Appointments" value={stats.todaysAppointments} />
        <StatCard title="Completed" value={byStatus.COMPLETED || 0} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard title="Booked" value={byStatus.BOOKED || 0} />
        <StatCard title="Cancelled" value={byStatus.CANCELLED || 0} />
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="mt-2 text-3xl font-bold">{value ?? 0}</div>
    </div>
  );
}
