const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant", required: true, index: true },

    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },

    customerName: { type: String, required: true, trim: true },
    customerEmail: { type: String, trim: true, lowercase: true },
    customerPhone: { type: String, trim: true },

    startAt: { type: Date, required: true },
    endAt: { type: Date, required: true },

    status: { type: String, enum: ["BOOKED", "CANCELLED", "COMPLETED"], default: "BOOKED" },
    notes: { type: String, trim: true }
  },
  { timestamps: true }
);

appointmentSchema.index({ tenantId: 1, startAt: 1 });

module.exports = mongoose.model("Appointment", appointmentSchema);
