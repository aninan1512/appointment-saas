const { z } = require("zod");
const Service = require("../models/Service");

const createSchema = z.object({
  name: z.string().min(2).max(80),
  durationMinutes: z.number().int().min(5).max(480),
  price: z.number().min(0).optional()
});

async function listServices(req, res, next) {
  try {
    const tenantId = req.user.tenantId;
    const services = await Service.find({ tenantId }).sort({ createdAt: -1 });
    res.json({ ok: true, services });
  } catch (err) {
    next(err);
  }
}

async function createService(req, res, next) {
  try {
    const tenantId = req.user.tenantId;
    const data = createSchema.parse(req.body);

    const service = await Service.create({
      tenantId,
      name: data.name,
      durationMinutes: data.durationMinutes,
      price: data.price ?? 0
    });

    res.status(201).json({ ok: true, service });
  } catch (err) {
    next(err);
  }
}

module.exports = { listServices, createService };
