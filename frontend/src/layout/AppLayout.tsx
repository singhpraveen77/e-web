import { Outlet } from "react-router-dom";
import Navbar from "../compoBig/Navbar";
import Footer from "../compoBig/Footer";

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-[rgb(var(--fg))] flex flex-col items-center">
      <Navbar />
      <main className="pt-16 w-full flex justify-center items-center">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default AppLayout;
