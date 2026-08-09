const argon2 = require("argon2");
const prisma = require("../config/prisma");
const {
  SESSION_COOKIE_NAME,
  clearSessionCookie,
  createUserSession,
  deleteSessionByToken,
  publicUserSelect,
  rotateSession,
  setSessionCookie,
  shouldRefreshSession,
} = require("../services/auth.service");
const {
  emailOnlySchema,
  loginSchema,
  registerSchema,
} = require("../validation/auth.schemas");

const sendValidationError = (response, result) =>
  response.status(400).json({
    code: "VALIDATION_ERROR",
    error: "The submitted data is invalid.",
    fields: result.error.flatten().fieldErrors,
  });

const getRequestSessionMetadata = (request) => ({
  userAgent: request.get("user-agent"),
  ipAddress: request.ip,
});

const register = async (request, response, next) => {
  const result = registerSchema.safeParse(request.body);

  if (!result.success) {
    return sendValidationError(response, result);
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: result.data.email },
      select: { id: true },
    });

    if (existingUser) {
      return response.status(409).json({
        code: "EMAIL_ALREADY_EXISTS",
        error: "An account with this email already exists.",
      });
    }

    const passwordHash = await argon2.hash(result.data.password, {
      type: argon2.argon2id,
    });
    const user = await prisma.user.create({
      data: {
        email: result.data.email,
        passwordHash,
        name: result.data.name,
        phone: result.data.phone,
      },
      select: publicUserSelect,
    });
    const { token, session } = await createUserSession({
      userId: user.id,
      ...getRequestSessionMetadata(request),
    });

    setSessionCookie(response, token, session.expiresAt);

    return response.status(201).json({ user });
  } catch (error) {
    if (error.code === "P2002") {
      return response.status(409).json({
        code: "EMAIL_ALREADY_EXISTS",
        error: "An account with this email already exists.",
      });
    }

    return next(error);
  }
};

const login = async (request, response, next) => {
  const result = loginSchema.safeParse(request.body);

  if (!result.success) {
    return sendValidationError(response, result);
  }

  try {
    const userWithPassword = await prisma.user.findUnique({
      where: { email: result.data.email },
    });
    const isPasswordValid = userWithPassword
      ? await argon2.verify(
          userWithPassword.passwordHash,
          result.data.password,
        )
      : false;

    if (!userWithPassword || !isPasswordValid) {
      return response.status(401).json({
        code: "INVALID_CREDENTIALS",
        error: "The email or password is incorrect.",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userWithPassword.id },
      select: publicUserSelect,
    });
    const { token, session } = await createUserSession({
      userId: userWithPassword.id,
      ...getRequestSessionMetadata(request),
    });

    setSessionCookie(response, token, session.expiresAt);

    return response.json({ user });
  } catch (error) {
    return next(error);
  }
};

const logout = async (request, response, next) => {
  try {
    const token = request.cookies?.[SESSION_COOKIE_NAME];
    await deleteSessionByToken(token);
    clearSessionCookie(response);

    return response.status(204).send();
  } catch (error) {
    return next(error);
  }
};

const me = (request, response) => response.json({ user: request.user });

const refresh = async (request, response, next) => {
  try {
    if (!shouldRefreshSession(request.authSession)) {
      return response.json({ user: request.user, refreshed: false });
    }

    const { token, session } = await rotateSession(
      request.authSession.id,
    );
    setSessionCookie(response, token, session.expiresAt);

    return response.json({ user: request.user, refreshed: true });
  } catch (error) {
    return next(error);
  }
};

const forgotPassword = async (request, response) => {
  const result = emailOnlySchema.safeParse(request.body);

  if (!result.success) {
    return sendValidationError(response, result);
  }

  console.info(
    `[auth placeholder] Password reset requested for ${result.data.email}`,
  );

  return response.status(202).json({
    message:
      "If an account exists for this email, password reset instructions will be sent.",
    placeholder: true,
  });
};

const notImplemented = (_request, response) =>
  response.status(501).json({
    code: "AUTH_FLOW_NOT_IMPLEMENTED",
    error: "This authentication flow is not available yet.",
    placeholder: true,
  });

module.exports = {
  forgotPassword,
  login,
  logout,
  me,
  notImplemented,
  refresh,
  register,
};
