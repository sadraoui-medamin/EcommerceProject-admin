import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/app/Sidebar";
import Topbar from "./components/app/Topbar";
import Dashboard from "./pages/dashbord";
import { ToastContainer } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css"; // Import toast CSS
import Orders from "./pages/Orders";
import Login from "./pages/Login";
import { useEffect, useState } from "react";
import AddProduct from "./pages/Add";
import List from "./pages/ListProduct";
import HomeBunners from "./pages/HomeBunners";
import ManageAdmins from "./pages/ManageAdmins";
import ManageUsers from "./pages/ManageUsers";
import WebsiteInfoSetting from "./pages/WebsiteInfoSetting";
import axios from "axios";
import apiBaseUrl from "./config/api";
export default function App() {
  const [activeButton, setActiveButton] = useState('/'); 
  const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : "")
  useEffect(() => {
      localStorage.setItem('token', token);
      console.log(token);
  }, []) 

  const [admin, setAdmin] = useState({
         name: '',
         role: '' 
       }
    );

useEffect(() => {
  const fetchAdmin = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/admins/getAdmin`,{
          headers: { token },
        });
        const adminInfo = {
          name: response.data?.name,
          role: response.data?.role
        };
        setAdmin(adminInfo);
      } catch (error) {
        console.error("Failed to fetch admin info", error);
      }
  };

  fetchAdmin();
}, []); 



    // Track the active button of the sidebar 

    const [collapsed, setCollapsed] = useState(false);
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    // Function to toggle sidebar
    const toggleSidebar = () => {
      setCollapsed((prevState) => !prevState);
    };
    // Function to handle screen size changes
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };
    // Automatically collapse sidebar when screen width is less than 500px
    useEffect(() => {
      window.addEventListener('resize', handleResize);
  
      if (screenWidth < 1400) {
        setCollapsed(true);
      }
  
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, [screenWidth]);
  return (
    <main>
        {/* share Toast Container  */}
        <ToastContainer position="top-right" autoClose={3000} />
   
      { token ==="" 
      ?(
        <Login  setToken={setToken} admin={admin} setAdmin={setAdmin}/>
       ):(
        <BrowserRouter>
      
         {/* Full Page Layout */}
         <div className=" flex  bg-gray-10  h-screen">
           {/* Sidebar */}
           <div className=" pl-4 py-2  shadow-lg first-line:drop-shadow-md h-[695px] rounded-2xl xs:mr-8 mr-3 bg-white ">
             <Sidebar collapsed={collapsed} toggleSidebar={toggleSidebar} activeButton={activeButton} setActiveButton={setActiveButton}/>
           </div>
   
           {/* Main Content Area */}
           <div className="flex flex-col flex-grow  ">
             {/* Topbar(Header) */}
             <div className=" px-4 py-2  shadow-md rounded-2xl mb-4 bg-white" >
               <Topbar token={token} setToken={setToken} admin={admin}/>
             </div>
   
             {/* Content */}
             <div className=" overflow-y-auto   pl-0  min-h-[calc(100%-100px)]   bg-white  shadow-md rounded-2xl">
               <Routes>
                 <Route path="/" element={<Dashboard  setToken={setToken}  setActiveButton={setActiveButton}/>} />
                 <Route path="/ADDproduct" element={<AddProduct setToken={setToken} />} />
                 <Route path="/listProducts/:id?" element={<List  token={token} setToken={setToken} />} />
                 <Route path="/Orders/:id?" element={<Orders setToken={setToken} />} />
                 <Route path="/HomeBunners" element={<HomeBunners setToken={setToken} />} />
                 <Route path="/ManageAdmins/:id?" element={<ManageAdmins setToken={setToken} />} />
                 <Route path="/ManageUsers/:id?" element={<ManageUsers setToken={setToken} />} />
                 <Route path="/WebsiteInfoSetting" element={<WebsiteInfoSetting  collapsed={collapsed} />} />
               </Routes>
             </div>
           </div>
         </div>
       </BrowserRouter>
        )}

    </main>
  );
}
