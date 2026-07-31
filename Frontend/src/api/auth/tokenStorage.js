const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

const getStorage = () => {
  if (typeof window === "undefined") return null;

  try {
    const testKey = "__bocc_auth_storage_test__";
    window.sessionStorage.setItem(testKey, "1");
    window.sessionStorage.removeItem(testKey);
    return window.sessionStorage;
  } catch {
    return window.localStorage;
  }
};

export const getStoredAccessToken = () => {
  if (typeof window === "undefined") return null;

  const storage = getStorage();

  try {
    return storage?.getItem(ACCESS_TOKEN_KEY) ?? null;
  } catch {
    return null;
  }
};

export const getStoredRefreshToken = () => {
  if (typeof window === "undefined") return null;

  const storage = getStorage();

  try {
    return storage?.getItem(REFRESH_TOKEN_KEY) ?? null;
  } catch {
    return null;
  }
};

export const persistAuthTokens = ({ accessToken, refreshToken }) => {
  if (typeof window === "undefined") return;

  const storage = getStorage();

  try {
    if (!storage) return;

    if (accessToken) {
      storage.setItem(ACCESS_TOKEN_KEY, accessToken);
    } else {
      storage.removeItem(ACCESS_TOKEN_KEY);
    }

    if (refreshToken) {
      storage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    } else {
      storage.removeItem(REFRESH_TOKEN_KEY);
    }
  } catch {
    // Ignore storage failures and fall back to the next available option.
  }

  window.dispatchEvent(new Event("auth:login"));
};

export const clearAuthTokens = () => {
  if (typeof window === "undefined") return;

  const storage = getStorage();

  try {
    storage?.removeItem(ACCESS_TOKEN_KEY);
    storage?.removeItem(REFRESH_TOKEN_KEY);
  } catch {
    // Ignore storage failures.
  }

  window.dispatchEvent(new Event("auth:logout"));
};
