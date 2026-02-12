const Service = require("../models/Service");
const Appointment = require("../models/Appointment");

// Assumes you already have req.user + tenantId set by your auth middleware
// If your tenant is stored differently, adjust tenantId below accordingly.
exports.getDashboardStats = async (req, res, next) => {
  try {
    const tenantId = req.user?.tenantId;

    if (!tenantId) {
      return res.status(400).json({ ok: false, message: "Missing tenantId" });
    }

    // Basic counts
    const [totalServices, totalAppointments] = await Promise.all([
      Service.countDocuments({ tenantId }),
      Appointment.countDocuments({ tenantId })
    ]);

    // Appointment status breakdown (optional but looks great)
    const statusAgg = await Appointment.aggregate([
      { $match: { tenantId } },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const byStatus = statusAgg.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    // Today's appointments count (based on createdAt or date field)
    // If you have a date field like `startTime`, replace createdAt with that.
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const todaysAppointments = await Appointment.countDocuments({
      tenantId,
      createdAt: { $gte: start, $lte: end }
    });

    return res.json({
      ok: true,
      data: {
        totalServices,
        totalAppointments,
        todaysAppointments,
        byStatus
      }
    });
  } catch (err) {
    next(err);
  }
};
