import React, { createContext, useContext } from "react";

const AuthContext = createContext({
  user: {
    full_name: "BOCC User",
    email: "user@bocc.com",
  },
  isAuthenticated: true,
  isLoadingAuth: false,
  authChecked: true,
  authError: null,
  checkUserAuth: () => {},
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }) {
  return (
    <AuthContext.Provider
      value={{
        user: {
          full_name: "BOCC User",
          email: "user@bocc.com",
        },
        isAuthenticated: true,
        isLoadingAuth: false,
        authChecked: true,
        authError: null,
        checkUserAuth: () => {},
        login: () => {},
        logout: () => {},
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}