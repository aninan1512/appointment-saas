const { verifyAccessToken } = require("../utils/tokens");

function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const [type, token] = header.split(" ");

    if (type !== "Bearer" || !token) {
      res.status(401);
      throw new Error("Missing or invalid Authorization header");
    }

    const payload = verifyAccessToken(token);
    req.user = payload; // { sub, tenantId, role }
    next();
  } catch (err) {
    res.status(401);
    next(new Error("Unauthorized"));
  }
}

module.exports = { requireAuth };
