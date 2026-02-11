const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant", required: true, index: true },
    name: { type: String, required: true, trim: true },
    durationMinutes: { type: Number, required: true, min: 5, max: 480 },
    price: { type: Number, default: 0, min: 0 }
  },
  { timestamps: true }
);

serviceSchema.index({ tenantId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model("Service", serviceSchema);
