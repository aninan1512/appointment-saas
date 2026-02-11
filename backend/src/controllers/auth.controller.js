const bcrypt = require("bcrypt");
const { z } = require("zod");

const Tenant = require("../models/Tenant");
const User = require("../models/User");
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require("../utils/tokens");

function slugify(input) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

const registerSchema = z.object({
  tenantName: z.string().min(2).max(60),
  tenantSlug: z.string().min(2).max(60).optional(),
  email: z.string().email(),
  password: z.string().min(8).max(72)
});

const loginSchema = z.object({
  tenantSlug: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(1)
});

function setRefreshCookie(res, refreshToken) {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false, // set true in production with https
    sameSite: "lax",
    path: "/api/auth/refresh",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
}

async function register(req, res, next) {
  try {
    const { tenantName, tenantSlug, email, password } = registerSchema.parse(req.body);

    const slugBase = tenantSlug ? slugify(tenantSlug) : slugify(tenantName);
    const slug = slugBase;

    const existingTenant = await Tenant.findOne({ slug });
    if (existingTenant) {
      res.status(409);
      throw new Error("Tenant slug already exists. Try a different name/slug.");
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const tenant = await Tenant.create({ name: tenantName, slug });

    const user = await User.create({
      tenantId: tenant._id,
      email: email.toLowerCase(),
      passwordHash,
      role: "OWNER"
    });

    const accessToken = signAccessToken({ sub: user._id.toString(), tenantId: tenant._id.toString(), role: user.role });
    const refreshToken = signRefreshToken({ sub: user._id.toString(), tenantId: tenant._id.toString(), role: user.role });

    setRefreshCookie(res, refreshToken);

    res.status(201).json({
      ok: true,
      tenant: { id: tenant._id, name: tenant.name, slug: tenant.slug },
      user: { id: user._id, email: user.email, role: user.role },
      accessToken
    });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { tenantSlug, email, password } = loginSchema.parse(req.body);

    const tenant = await Tenant.findOne({ slug: tenantSlug.toLowerCase() });
    if (!tenant) {
      res.status(401);
      throw new Error("Invalid tenant/email/password");
    }

    const user = await User.findOne({ tenantId: tenant._id, email: email.toLowerCase() });
    if (!user) {
      res.status(401);
      throw new Error("Invalid tenant/email/password");
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      res.status(401);
      throw new Error("Invalid tenant/email/password");
    }

    const accessToken = signAccessToken({ sub: user._id.toString(), tenantId: tenant._id.toString(), role: user.role });
    const refreshToken = signRefreshToken({ sub: user._id.toString(), tenantId: tenant._id.toString(), role: user.role });

    setRefreshCookie(res, refreshToken);

    res.json({
      ok: true,
      tenant: { id: tenant._id, name: tenant.name, slug: tenant.slug },
      user: { id: user._id, email: user.email, role: user.role },
      accessToken
    });
  } catch (err) {
    next(err);
  }
}

async function refresh(req, res, next) {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      res.status(401);
      throw new Error("Missing refresh token");
    }

    const payload = verifyRefreshToken(token);

    // Optional hard-check user still exists:
    const user = await User.findById(payload.sub);
    if (!user) {
      res.status(401);
      throw new Error("Invalid refresh token");
    }

    const accessToken = signAccessToken({
      sub: payload.sub,
      tenantId: payload.tenantId,
      role: payload.role
    });

    res.json({ ok: true, accessToken });
  } catch (err) {
    res.status(401);
    next(new Error("Invalid refresh token"));
  }
}

async function logout(req, res, next) {
  try {
    res.clearCookie("refreshToken", { path: "/api/auth/refresh" });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, refresh, logout };
