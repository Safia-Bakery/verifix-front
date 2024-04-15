import { Outlet } from "react-router-dom";
import mainBg from "/images/main-bg.png";
import { useEffect } from "react";

const AdminRoutes = () => {
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) window.location.replace("/login");
  }, [token]);

  return (
    <div className="relative">
      <img
        src={mainBg}
        alt="main-bg"
        className="fixed inset-0 -z-10 h-full w-full"
      />
      <Outlet />
    </div>
  );
};

export default AdminRoutes;
