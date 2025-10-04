
import {Outlet} from "react-router-dom"
import Navbar from "../component/Navbar"
import Footer from "../component/Footer"

const AppLayout = () => {
  return (
    <div>
    <Navbar/>
    <main className="pt-16">   {/* push content below navbar */}
        <Outlet />
      </main>    
      <Footer/>
    </div>
    
  )
}

export default AppLayout