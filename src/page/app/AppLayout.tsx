import { Outlet } from "react-router";
import NavBar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function AppLayout() {

  return (
    <>
      <NavBar />
      <Outlet />
      <Footer />
    </>
  );
}
