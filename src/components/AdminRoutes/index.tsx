import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { tokenValue } from "@/utils/helper";
import Aside from "../Aside";
import mainBg from "/images/main-bg.png";

const AdminRoutes = () => {
  const token = localStorage.getItem(tokenValue);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) window.location.replace("/login");
  }, [token]);

  useEffect(() => {
    navigate("/home");
  }, []);

  return (
    <div className="relative">
      <img
        src={mainBg}
        alt="main-bg"
        className="fixed inset-0 -z-10 h-full w-full"
      />
      <Aside />
      <Outlet />
    </div>
  );
};

export default AdminRoutes;
