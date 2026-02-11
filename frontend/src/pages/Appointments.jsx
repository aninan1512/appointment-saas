import { useEffect, useMemo, useState } from "react";
import { api } from "../api/axios";

function toLocalInputValue(date = new Date()) {
  const pad = (n) => String(n).padStart(2, "0");
  const yyyy = date.getFullYear();
  const mm = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const hh = pad(date.getHours());
  const min = pad(date.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
}

function Badge({ status }) {
  const classes =
    status === "COMPLETED"
      ? "bg-emerald-50 border-emerald-200 text-emerald-700"
      : status === "CANCELLED"
      ? "bg-rose-50 border-rose-200 text-rose-700"
      : "bg-slate-50 border-slate-200 text-slate-700";

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${classes}`}>
      {status}
    </span>
  );
}

export default function Appointments() {
  const [services, setServices] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const [serviceId, setServiceId] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [startAtLocal, setStartAtLocal] = useState(toLocalInputValue());
  const [notes, setNotes] = useState("");

  const [filter, setFilter] = useState("ALL");
  const [msg, setMsg] = useState("");

  async function loadAll() {
    setMsg("Loading...");
    try {
      const [svcRes, apptRes] = await Promise.all([
        api.get("/api/services"),
        api.get("/api/appointments")
      ]);

      const svcs = svcRes.data.services || [];
      setServices(svcs);
      if (!serviceId && svcs.length > 0) setServiceId(svcs[0]._id);

      setAppointments(apptRes.data.appointments || []);
      setMsg("");
    } catch (err) {
      setMsg(err?.response?.data?.message || "Failed to load data");
    }
  }

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const canCreate = useMemo(() => {
    return serviceId && customerName.trim().length >= 2 && startAtLocal;
  }, [serviceId, customerName, startAtLocal]);

  const filtered = useMemo(() => {
    if (filter === "ALL") return appointments;
    return appointments.filter((a) => a.status === filter);
  }, [appointments, filter]);

  async function createAppointment(e) {
    e.preventDefault();
    if (!canCreate) return;

    setMsg("Creating appointment...");
    try {
      const startAtISO = new Date(startAtLocal).toISOString();

      await api.post("/api/appointments", {
        serviceId,
        customerName,
        customerEmail,
        customerPhone,
        startAt: startAtISO,
        notes
      });

      setCustomerName("");
      setCustomerEmail("");
      setCustomerPhone("");
      setNotes("");
      setStartAtLocal(toLocalInputValue());

      await loadAll();
      setMsg("✅ Appointment created");
      setTimeout(() => setMsg(""), 900);
    } catch (err) {
      setMsg(err?.response?.data?.message || "Failed to create appointment");
    }
  }

  async function setStatus(id, status) {
    setMsg("Updating...");
    try {
      await api.patch(`/api/appointments/${id}/status`, { status });
      await loadAll();
      setMsg("✅ Updated");
      setTimeout(() => setMsg(""), 700);
    } catch (err) {
      setMsg(err?.response?.data?.message || "Failed to update status");
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold">Appointments</h1>
        <p className="text-slate-600">
          Book, manage, cancel, and complete appointments — scoped to your tenant.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-sm font-semibold">New appointment</div>

          <form onSubmit={createAppointment} className="mt-3 grid gap-3">
            <div>
              <label className="text-xs text-slate-500">Service</label>
              <select
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
                disabled={services.length === 0}
              >
                {services.length === 0 && <option value="">Create a service first</option>}
                {services.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name} ({s.durationMinutes} min)
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs text-slate-500">Customer name</label>
                <input
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="John Smith"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-slate-500">Start time</label>
                <input
                  type="datetime-local"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                  value={startAtLocal}
                  onChange={(e) => setStartAtLocal(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs text-slate-500">Email (optional)</label>
                <input
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="john@gmail.com"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500">Phone (optional)</label>
                <input
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="555-123-4567"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-500">Notes (optional)</label>
              <input
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="First visit"
              />
            </div>

            <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60" disabled={!canCreate}>
              Create Appointment
            </button>

            {msg && <p className="text-sm text-slate-600">{msg}</p>}
          </form>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-semibold">Appointments</div>
            <select
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="ALL">All</option>
              <option value="BOOKED">Booked</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div className="mt-3 grid gap-3">
            {filtered.map((a) => (
              <div key={a._id} className="rounded-2xl border border-slate-200 bg-white p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold">{a.serviceId?.name || "Service"}</div>
                    <div className="text-sm text-slate-600">
                      {a.customerName}{a.customerEmail ? ` • ${a.customerEmail}` : ""}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      {new Date(a.startAt).toLocaleString()} → {new Date(a.endAt).toLocaleString()}
                    </div>
                  </div>
                  <Badge status={a.status} />
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <button
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium hover:bg-slate-100 disabled:opacity-60"
                    onClick={() => setStatus(a._id, "COMPLETED")}
                    disabled={a.status !== "BOOKED"}
                  >
                    Mark Completed
                  </button>
                  <button
                    className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700 hover:bg-rose-100 disabled:opacity-60"
                    onClick={() => setStatus(a._id, "CANCELLED")}
                    disabled={a.status !== "BOOKED"}
                  >
                    Cancel
                  </button>

                  <span className="ml-auto font-mono text-[10px] text-slate-400">{a._id}</span>
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-sm text-slate-600">
                No appointments found for this filter.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
