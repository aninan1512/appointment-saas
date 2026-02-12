import { useEffect, useState } from "react";
import { api } from "../axios";

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await api.get("/api/services");
        setServices(res.data.data || res.data || []);
      } catch (e) {
        setError("Failed to load services.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="p-6">Loading services…</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  if (services.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold">Services</h1>
        <div className="mt-4 rounded-xl border bg-white p-6">
          <p className="text-gray-600">
            No services yet. Create your first service to start taking appointments.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Services</h1>

      <div className="mt-4 grid gap-3">
        {services.map((s) => (
          <div key={s._id} className="rounded-xl border bg-white p-4 shadow-sm">
            <div className="font-medium">{s.name}</div>
            {s.duration && <div className="text-sm text-gray-500">{s.duration} mins</div>}
            {s.price != null && <div className="text-sm text-gray-500">${s.price}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
