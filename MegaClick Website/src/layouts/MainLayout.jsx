import { Outlet, useLocation } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const MainLayout = () => {

  const location = useLocation();

  return (
    <>
      <Navbar showTopBar={location.pathname === "/"} />

      <Outlet />

      <Footer />
    </>
  );
};

export default MainLayout;