const { z } = require("zod");
const mongoose = require("mongoose");

const Appointment = require("../models/Appointment");
const Service = require("../models/Service");

const createSchema = z.object({
  serviceId: z.string().min(10),
  customerName: z.string().min(2).max(100),
  customerEmail: z.string().email().optional().or(z.literal("")),
  customerPhone: z.string().optional().or(z.literal("")),
  startAt: z.string(), // ISO string from frontend
  notes: z.string().max(500).optional().or(z.literal(""))
});

async function listAppointments(req, res, next) {
  try {
    const tenantId = req.user.tenantId;

    const items = await Appointment.find({ tenantId })
      .populate("serviceId", "name durationMinutes price")
      .sort({ startAt: 1 });

    res.json({ ok: true, appointments: items });
  } catch (err) {
    next(err);
  }
}

async function createAppointment(req, res, next) {
  try {
    const tenantId = req.user.tenantId;
    const data = createSchema.parse(req.body);

    if (!mongoose.isValidObjectId(data.serviceId)) {
      res.status(400);
      throw new Error("Invalid serviceId format");
    }

    const service = await Service.findOne({ _id: data.serviceId, tenantId });
    if (!service) {
      res.status(400);
      throw new Error("Invalid serviceId for this tenant");
    }

    const start = new Date(data.startAt);
    if (Number.isNaN(start.getTime())) {
      res.status(400);
      throw new Error("Invalid startAt date");
    }

    const end = new Date(start.getTime() + service.durationMinutes * 60 * 1000);

    // Simple conflict check (overlapping time)
    const conflict = await Appointment.findOne({
      tenantId,
      status: "BOOKED",
      startAt: { $lt: end },
      endAt: { $gt: start }
    });

    if (conflict) {
      res.status(409);
      throw new Error("Time slot already booked");
    }

    const appt = await Appointment.create({
      tenantId,
      serviceId: service._id,
      customerName: data.customerName,
      customerEmail: data.customerEmail || undefined,
      customerPhone: data.customerPhone || undefined,
      startAt: start,
      endAt: end,
      notes: data.notes || undefined
    });

    const populated = await Appointment.findById(appt._id).populate(
      "serviceId",
      "name durationMinutes price"
    );

    res.status(201).json({ ok: true, appointment: populated });
  } catch (err) {
    next(err);
  }
}

async function updateStatus(req, res, next) {
  try {
    const tenantId = req.user.tenantId;
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      res.status(400);
      throw new Error("Invalid appointment id");
    }

    if (!["BOOKED", "CANCELLED", "COMPLETED"].includes(status)) {
      res.status(400);
      throw new Error("Invalid status");
    }

    const updated = await Appointment.findOneAndUpdate(
      { _id: id, tenantId },
      { status },
      { new: true }
    ).populate("serviceId", "name durationMinutes price");

    if (!updated) {
      res.status(404);
      throw new Error("Appointment not found");
    }

    res.json({ ok: true, appointment: updated });
  } catch (err) {
    next(err);
  }
}

module.exports = { listAppointments, createAppointment, updateStatus };
