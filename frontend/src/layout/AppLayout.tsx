import { Outlet } from "react-router-dom";
import Navbar from "../compoBig/Navbar";
import Footer from "../compoBig/Footer";

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-[rgb(var(--bg))] text-[rgb(var(--fg))] flex flex-col">
      <Navbar />
      <main className="pt-16 flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default AppLayout;
