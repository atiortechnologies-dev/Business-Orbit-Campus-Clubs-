const isProduction = process.env.NODE_ENV === "production";

// 7 days by default, kept in sync with JWT_EXPIRES_IN's default.
const ACCESS_TOKEN_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;
// 30 days by default, kept in sync with JWT_REFRESH_EXPIRES_IN's default.
const REFRESH_TOKEN_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

const baseCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: "lax",
  path: "/",
};

const setAccessTokenCookie = (res, token) => {
  res.cookie("accessToken", token, {
    ...baseCookieOptions,
    maxAge: ACCESS_TOKEN_MAX_AGE_MS,
  });
};

const setRefreshTokenCookie = (res, token) => {
  res.cookie("refreshToken", token, {
    ...baseCookieOptions,
    maxAge: REFRESH_TOKEN_MAX_AGE_MS,
  });
};

const setAuthCookies = (res, { accessToken, refreshToken }) => {
  if (accessToken) setAccessTokenCookie(res, accessToken);
  if (refreshToken) setRefreshTokenCookie(res, refreshToken);
};

const clearAuthCookies = (res) => {
  res.clearCookie("accessToken", baseCookieOptions);
  res.clearCookie("refreshToken", baseCookieOptions);
};

module.exports = {
  setAccessTokenCookie,
  setRefreshTokenCookie,
  setAuthCookies,
  clearAuthCookies,
};
