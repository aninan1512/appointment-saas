import { useEffect, useState } from "react";
import { api } from "../api/axios";

export default function Services() {
  const [services, setServices] = useState([]);
  const [name, setName] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [price, setPrice] = useState(0);
  const [msg, setMsg] = useState("");

  async function load() {
    setMsg("Loading services...");
    try {
      const res = await api.get("/api/services");
      setServices(res.data.services || []);
      setMsg("");
    } catch (err) {
      setMsg(err?.response?.data?.message || "Failed to load services");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function createService(e) {
    e.preventDefault();
    setMsg("Creating service...");
    try {
      await api.post("/api/services", {
        name,
        durationMinutes: Number(durationMinutes),
        price: Number(price)
      });
      setName("");
      setDurationMinutes(30);
      setPrice(0);
      await load();
      setMsg("✅ Service created");
      setTimeout(() => setMsg(""), 900);
    } catch (err) {
      setMsg(err?.response?.data?.message || "Failed to create service");
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold">Services</h1>
        <p className="text-slate-600">Create services your customers can book.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-sm font-semibold">New service</div>

          <form onSubmit={createService} className="mt-3 grid gap-3">
            <div>
              <label className="text-xs text-slate-500">Service name</label>
              <input
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Dental Cleaning"
                required
              />
            </div>

            <div>
              <label className="text-xs text-slate-500">Duration (minutes)</label>
              <input
                type="number"
                min={5}
                max={480}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-xs text-slate-500">Price</label>
              <input
                type="number"
                min={0}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
              Create Service
            </button>

            {msg && <p className="text-sm text-slate-600">{msg}</p>}
          </form>
        </div>

        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-sm font-semibold">Your services</div>

          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-slate-500">
                <tr>
                  <th className="py-2">Name</th>
                  <th className="py-2">Duration</th>
                  <th className="py-2">Price</th>
                  <th className="py-2">Service ID</th>
                </tr>
              </thead>
              <tbody className="border-t border-slate-100">
                {services.map((s) => (
                  <tr key={s._id} className="border-b border-slate-100">
                    <td className="py-3 font-medium">{s.name}</td>
                    <td className="py-3">{s.durationMinutes} min</td>
                    <td className="py-3">{s.price}</td>
                    <td className="py-3 font-mono text-xs text-slate-600">{s._id}</td>
                  </tr>
                ))}
                {services.length === 0 && (
                  <tr>
                    <td className="py-3 text-slate-600" colSpan={4}>
                      No services yet. Create one on the left.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
