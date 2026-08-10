import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "./index.css";
import { router } from "@/router";
import { AuthProvider } from "./context/AuthContext";
// import CookieBanner from "@/components/ui/CookieBanner";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <RouterProvider router={router} />
    {/* <CookieBanner /> */}
  </AuthProvider>,
);
