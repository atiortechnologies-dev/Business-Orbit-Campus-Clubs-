/**
 * @file cookies.js
 * @description Centralized helpers for issuing and clearing the httpOnly auth cookies
 *              (accessToken / refreshToken) used to replace localStorage-based tokens.
 * @architecture Keeps cookie options (path, sameSite, secure, maxAge) consistent across
 *               every controller that issues or revokes a session, so behaviour can't drift
 *               between login/register/verify-otp/refresh/logout.
 */

const isProduction = process.env.NODE_ENV === "production";

// 15 minutes by default, kept in sync with JWT_EXPIRES_IN's default.
const ACCESS_TOKEN_MAX_AGE_MS = 15 * 60 * 1000;
// 30 days by default, kept in sync with JWT_REFRESH_EXPIRES_IN's default.
const REFRESH_TOKEN_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

/**
 * @desc Base options shared by both cookies.
 *       - httpOnly: JS on the frontend can never read/steal the token (fixes the old
 *         localStorage approach, which was readable by any script on the page).
 *       - secure: only sent over HTTPS in production; allowed over http in dev.
 *       - sameSite: "strict" completely blocks Cross-Site Request Forgery (CSRF).
 */
const baseCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: "strict",
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

/**
 * @desc Set both auth cookies in one call (used after login/register/verify-otp).
 */
const setAuthCookies = (res, { accessToken, refreshToken }) => {
  if (accessToken) setAccessTokenCookie(res, accessToken);
  if (refreshToken) setRefreshTokenCookie(res, refreshToken);
};

/**
 * @desc Clear both auth cookies (used on logout / invalid refresh token).
 *       clearCookie options must match the options used to set the cookie
 *       (minus maxAge/expires) or the browser will not remove it.
 */
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
