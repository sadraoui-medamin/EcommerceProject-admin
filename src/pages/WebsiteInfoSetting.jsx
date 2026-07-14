import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaTag } from "react-icons/fa";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { Divider } from 'antd';
import apiBaseUrl from "../config/api";

const WebsiteInfoPage = ({collapsed}) => {
  const [formData, setFormData] = useState({
    siteName: "",
    logo: "",
    favicon: "",
    contactEmail: "",
    contactPhone: "",
    address:"",
  });

  const fetchInfo = async () =>{
    try {
      const res = await axios.get(`${apiBaseUrl}/api/aboutUs/getInfo`) || {};
      console.log(res)
      setFormData({
        siteName: res.data?.data?.siteName || "",
        logo: res.data?.data?.logo || "",
        favicon: res.data?.data?.favicon || "",
        contactEmail: res.data?.data?.contactEmail || "",
        contactPhone: res.data?.data?.contactPhone || "",
        address: res.data?.data?.address || "",
      });
        console.log("fetched info",res.data)
    } catch (error) {
        console.error(error);
    }

  }

  useEffect(()  => {
    fetchInfo();
  }, []);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const validate = (data) => {
    if (!data.siteName || data.siteName.trim() === "") {
      toast.error("Site name is required");
      return false;
    }
  
    if (!data.contactEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contactEmail)) {
      toast.error("A valid contact email is required");
      return false;
    }
  
    if (!data.contactPhone || !/^\+?\d{6,15}$/.test(data.contactPhone)) {
      toast.error("A valid contact phone number is required");
      return false;
    }
  
    if (!data.address || data.address.trim() === "") {
      toast.error("Address is required");
      return false;
    }
  
    return true;
  };
  
  const handleSubmit = async () => {
    if (!validate(formData))
        return;
    try {
      const updateData = new FormData();
      updateData.append('contactEmail', formData.contactEmail);
      updateData.append('contactPhone', formData.contactPhone);
      updateData.append('address', formData.address);
      updateData.append('siteName',  formData.siteName);

      const logo = formData.logo;
      const favicon = formData.favicon;
      // Append logo
      if (logo) {
        if (logo instanceof File) {
          updateData.append("logo", logo);
        } else if (typeof logo === "string") {
          const response = await fetch(logo);
          const blob = await response.blob();
          const file = new File([blob], "logo", { type: blob.type });
          updateData.append("logo", file);
        }
      }
      // Append favicon
      if (favicon) {
        if (favicon instanceof File) {
          updateData.append("favicon", favicon);
        } else if (typeof favicon === "string") {
          const response = await fetch(favicon);
          const blob = await response.blob();
          const file = new File([blob], "favicon", { type: blob.type });
          updateData.append("favicon", file);
        }
      }
      
      await axios.post(`${apiBaseUrl}/api/aboutUs/update`, updateData);
      toast.success("Website info updated");
      fetchInfo(); //fetch data
    } catch {
      toast.error("Update failed");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const fieldName = e.target.name;
  
    if (file && (fieldName === "logo" || fieldName === "favicon")) {
      setFormData((prev) => ({
        ...prev,
        [fieldName]: file,
      }));
    }
  };
  
  
  const handleRemoveImage = (fieldName) => {
    if (fieldName === "logo" || fieldName === "favicon") {
      setFormData((prev) => ({
        ...prev,
        [fieldName]: null,
      }));
    }
  };
  
  
  return (
    <section className="flex  flex-col p-12">
<div className={`w-full flex ${collapsed ? 'items-center justify-center' :'items-start justify-start' }`}>
<div className="flex flex-col py-5 w-full md:w-[60%] ">
      <h2 className="text-2xl font-bold mb-8 ">Website Info Settings</h2>
              {/* input files */}
              <div className="flex justify-center items-start flex-col gap-4 ">
              {/* logo  */}
              <div className="flex gap-8 border rounded-2xl">
                <span className="font-medium text-gray-50 text-sm pl-1 p-2"> The logo of the company :</span>
                <div className="  relative   w-full lg:w-96   h-32 sm:h-40">
                  <label
                    htmlFor="upload-logo"
                    className="flex flex-col rounded-2xl border-2  border-gray-50 items-center justify-center w-full h-full bg-gray-100 cursor-pointer hover:bg-gray-200 transition duration-300 overflow-hidden"
                  >
                    
                    {!formData.logo ? (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-10 w-10 text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 15a4 4 0 01.88-2.5M3 15a4 4 0 004 4h10m5-5a4 4 0 00-.88-2.5M21 15a4 4 0 01-4 4H7m10-10V3m0 0l-3 3m3-3l3 3"
                          />
                        </svg>
                        <span className="mt-2 text-sm font-medium text-gray-600 justify-center">Upload the logo </span>
                      </>
                    ) : (
                      <img
                        src={
                          formData.logo instanceof File
                          ? URL.createObjectURL(formData.logo)
                          : formData.logo
                        }
                        alt="Preview"
                        className="w-full h-full object-cover hover:scale-105 transform duration-200 "
                      />
                    )}
                    <input
                      id="upload-logo"
                      type="file"
                      name="logo"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>

                  {/* Remove Button */}
                  {formData.logo && (
                    <button
                      type="button"
                      onClick={() => handleRemoveImage("logo")}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs"
                    >
                      X
                    </button>
                  )}
                </div>
              </div>
              {/* favicon  */}
              <div className="flex gap-8  border rounded-2xl ">
                <span className="font-medium text-gray-50 text-sm pl-1 p-2 pr-12"> The website favicon :</span>
                <div className="relative w-32 h-32 sm:w-40 sm:h-40">
                  <label
                    htmlFor="upload-favicon"
                    className="flex flex-col items-center rounded-full justify-center w-full h-full bg-gray-100 border-2 border-gray-50  cursor-pointer hover:bg-gray-200 transition duration-300 overflow-hidden"
                  >
                    {!formData.favicon ? (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-10 w-10 text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 15a4 4 0 01.88-2.5M3 15a4 4 0 004 4h10m5-5a4 4 0 00-.88-2.5M21 15a4 4 0 01-4 4H7m10-10V3m0 0l-3 3m3-3l3 3"
                          />
                        </svg>
                        <span className="mt-2 text-sm font-medium text-gray-600">Upload favicon</span>
                      </>
                    ) : (
                      <img
                        src={
                          formData.favicon instanceof File
                          ? URL.createObjectURL(formData.favicon)
                          : formData.favicon
                        }
                        alt="Preview"
                        className="w-full h-full object-cover rounded-full hover:scale-105 transform duration-200 "
                      />
                    )}
                    <input
                      id="upload-favicon"
                      name="favicon"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>

                  {/* Remove Button */}
                  {formData.favicon && (
                    <button
                      type="button"
                      onClick={()=>handleRemoveImage("favicon")}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs"
                    >
                      X
                    </button>
                  )}
                </div>
              </div>
            </div>
            <Divider type="horizontal" style={{ borderColor: 'black' }}/>
            <span className="font-serif mb-5 text-gray-700 text-lg ">Contact informations :</span>
            {/* input data  */}
            <div className="flex-col flex gap-4 w-full  ">
                  {/* site name  */}
                      <div className="relative flex items-center">
                        <FaTag className="absolute left-3  text-gray-400" />
                        <input 
                          className="w-full border h-9 border-gray-300 rounded-md pl-10 p-2 focus:outline-blue-500"
                          type="text" 
                          name="siteName" 
                          value={formData.siteName} 
                          onChange={handleChange} 
                          placeholder="Enter Website Name" 
                        />
                      </div>

                  {/* Contact Email */}
                  <div className="relative flex items-center">
                      <FaEnvelope className="absolute  left-3 - text-gray-400" />
                      <input 
                        className="w-full border h-9 border-gray-300 rounded-md pl-10 p-2 focus:outline-blue-500"
                        type="email" 
                        name="contactEmail" 
                        value={formData.contactEmail} 
                        onChange={handleChange} 
                        placeholder="Enter Contact Email" 
                      />
                    </div>

                  {/* Contact Phone */}
                  <div className="relative flex items-center">
                      <FaPhone className="absolute left-3  text-gray-400" />
                      <input 
                        className="w-full border h-9 border-gray-300 rounded-md pl-10 p-2 focus:outline-blue-500" 
                        type="tel" 
                        name="contactPhone" 
                        value={formData.contactPhone} 
                        onChange={handleChange} 
                        placeholder="Enter Contact Phone" 
                      />
                    </div>

                  {/* Address */}
                  <div className="relative flex items-center">
                      <FaMapMarkerAlt className="absolute  top-3  left-3 text-gray-400" />
                      <textarea 
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Enter Address "
                        className="w-full border border-gray-300 rounded-md pl-12 p-2 focus:outline-blue-500"
                        rows="3"
                        required
                      />
                    </div>



            </div>
      
        <button 
            className="w-full bg-tertiary text-white font-medium py-2 my-4 rounded-md hover:bg-tertiary/75 hover:text-secondaryWhite transition duration-200"
            onClick={handleSubmit}
            >
              Update
        </button>
      </div>
      </div>

    </section>
  );
};

export default WebsiteInfoPage;
