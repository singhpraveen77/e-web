import { Outlet } from "react-router-dom";
import Navbar from "../compoBig/Navbar";
import Footer from "../compoBig/Footer";
import ScrollTop from "../components/utility/scrollTop";

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-[rgb(var(--bg))] text-[rgb(var(--fg))] flex flex-col">
      <Navbar />
      {/* Reserve space for the floating navbar and provide consistent page paddings */}
      <main className="flex-1 w-full pt-20 pb-12">
        <ScrollTop/>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default AppLayout;
