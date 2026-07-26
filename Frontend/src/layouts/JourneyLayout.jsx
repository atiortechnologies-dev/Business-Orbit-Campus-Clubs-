import { Outlet } from "react-router-dom";

function JourneyLayout({ children }) {
  return (
    <div className="journey-layout">
      {children ? children : <Outlet />}
    </div>
  );
}

export default JourneyLayout;