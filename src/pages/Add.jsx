import React, { useState } from "react";
import axios from "axios";
import {toast } from "react-toastify"; // Import toast
import { FaTag, FaInfoCircle, FaDollarSign, FaPercentage } from "react-icons/fa";
import Details from "../components/ADD/ADDetails";
import { useNavigate } from "react-router-dom";
import apiBaseUrl from "../config/api";

const AddProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    info:"",
    price: "",
    images: [],
    category: "",
    subCategory: "",
    subSubCategory: "",
    popular: false,
    brand: "",
    discount: 0,
    status: "In stock",
    details: {
      DescriptionSection: [], // Reset description items
    },  });

  //Categories && subcategory && subsubcategory
  const categories = {
    Computer: {
      subCategories: {
        "Pc Normal & Pro": ["Desktop Pc", "Portable Pc", "Mac Book Pc"],
        "Pc Gamer": ["Desktop Gamer Pc", "Portable Gamer Pc"],
        "Pc Accessories": ["Charger Pc", "keyboard", "Mouse", "Headphones Pc"],
      },
    },
    "Phones & Tablets": {
      subCategories: {
        Phone: [],
        Tablet: [],
        "Phones Accessories": ["Ecouter", "Charger", "Powerbank"],
      },
    },
    "Household Appliances": {
      subCategories: {
        "Washing Machine": [],
        Refrigerator: [],
        "Air Conditioner": [],
        TV: [],
      },
    },
    Cosmetics: {
      subCategories: {
        Perfume: [],
        Care: [],
      },
    },
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
        setFormData((prev) => ({ ...prev,[name]: type === 'checkbox' ? checked : value || '', // Ensure emty fallback
          }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
          ...(name === "category" && { subCategory: "", subSubCategory: "" }),
          ...(name === "subCategory" && { subSubCategory: "" }),
        }));
      }
  };
  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => {
        const updatedImages = [...prev.images];
        updatedImages[index] = file;
        return { ...prev, images: updatedImages };
      });
    }
  };

  const validateFormData = (formData) => {
    // Check if no images are uploaded
    if (!formData.images.length < 1 && !formData.images[0]) {
      toast.error('Please upload at least 1 image');
      return false;
    }
    // Validate required fields
    if (!formData.name) {
      toast.error("Name is required.");
      return false;
    }
    if (!formData.info) {
      toast.error("Info is required.");
      return false;
    }
    if (!formData.price) {
      toast.error("Price is required.");
      return false;
    }
    if (!formData.category) {
      toast.error("Category is required.");
      return false;
    }
    if (!formData.subCategory) {
      toast.error("Sub-category is required for selected category.");
      return false;
    }
    // if (!formData.subSubCategory) {
    //   toast.error("Sub-sub-category is required for selected sub-category.");
    //   return false;
    // }
    if (!formData.brand) {
      toast.error("Brand is required.");
      return false;
    }
    // formData.details validate 
    const details = formData.details;
    // Validate details fields for "Pc normal & pro" and "Pc gamer"
    if (["desktop pc", "portable pc", "Mac book pc", "desktop gamer pc", "portable gamer pc"].includes(formData.subSubCategory)){
      if (!details.OperatingSystem) {
        toast.error("Operating System is required.");
        return false;
      }
      if (!details.Processor) {
        toast.error("Processor is required.");
        return false;
      }
      if (!details.RefProcessor) {
        toast.error("Ref Processor is required.");
        return false;
      }
      if (!details.Memoir) {
        toast.error("Memoir is required.");
        return false;
      }
      if (!details.HardDisk) {
        toast.error("Hard Disk is required.");
        return false;
      }
      if (formData.subSubCategory !== 'Mac book pc' && !details.GraphicsCard) {
        toast.error("Graphics Card is required.");
        return false;
      }
      if (!details.RefGraphicsCard) {
        toast.error("Ref Graphics Card is required.");
        return false;
      }
      if (!details.SizeScreen) {
        toast.error("Size Screen is required.");
        return false;
      }
      if (!details.ScreenType) {
        toast.error("Screen Type is required.");
        return false;
      }
      if (!details.RefreshRate) {
        toast.error("Refresh Rate is required.");
        return false;
      }
    }
    // Validate details fields for "charger pc"
    if (formData.subSubCategory === 'charger pc') {
      if (!details.Voltage) {
        toast.error("Voltage is required.");
        return false;
      }
      if (!details.Amperage) {
        toast.error("Amperage is required.");
        return false;
      }
    }
    // Validate details fields for "keyboard pc", "mouse", and "headphones pc"
    if (['mouse', 'keyboard', 'headphones pc'].includes(formData.subSubCategory)) {
      if (formData.subSubCategory === 'keyboard' && !details.Type) {
        toast.error("Type is required for keyboard.");
        return false;
      }
      if (!details.Connectivity) {
        toast.error("Connectivity is required.");
        return false;
      }
      // No validation needed for Gamer as it is a checkbox
    }
    // Validate details fields for "phone" and "tablet"
    if (["phone", "tablet"].includes(formData.subCategory)) {
    if (!details.Network) {
      toast.error("Network is required.");
      return false;
    }
    if (!details.Memoir) {
      toast.error("Memoir is required.");
      return false;
    }
    if (!details.Storage) {
      toast.error("Storage is required.");
      return false;
    }
    if (!details.Screen) {
      toast.error("Screen is required.");
      return false;
    }
    if (!details.ProcessorType) {
      toast.error("Processor Type is required.");
      return false;
    }
    if (!details.RefreshRate) {
      toast.error("Refresh Rate is required.");
      return false;
    }
    if (!details.System) {
      toast.error("System is required.");
      return false;
    }
    if (!details.Camera) {
      toast.error("Camera is required.");
      return false;
    }
    }
    // Validate details fields for "ecouter phones"
    if (formData.subSubCategory === 'ecouter') {
      if (!details.Connectivity) {
        toast.error("Connectivity is required.");
        return false;
      }
    }
    // Validate details fields for "charger phones"
    if (formData.subSubCategory === 'charger') {
      if (!details.TypeCable) {
        toast.error("Type Cable is required.");
        return false;
      }
      if (details.fastCharger && !details.FastCharger) {
        toast.error("Charger speed is required when Fast Charger is selected.");
        return false;
      }
    }
    // Validate details fields for "powerbank"
    if (formData.subSubCategory === 'powerbank') {
      if (!details.TypeCable) {
        toast.error("Type Cable is required.");
        return false;
      }
      if (!details.Capacity) {
        toast.error("Capacity is required.");
        return false;
      }
      if (details.fastpowerbank && !details.FastCharger) {
        toast.error("Charger speed is required when Fast powerbank is selected.");
        return false;
      }
    }
    // Validate details fields for "washing machine"
    if (formData.subCategory === 'washing machine') {
      if (!details.WipingSpeed) {
        toast.error("Wiping speed is required.");
        return false;
      }
      if (!details.NumberOfPrograms) {
        toast.error("Number of Programs is required.");
        return false;
      }
      if (!details.Type) {
        toast.error("Type is required.");
        return false;
      }
      if (!details.CapacityOfWashing) {
        toast.error("Capacity of washing is required.");
        return false;
      }
    }
    // Validate details fields for "refrigerator"
    if (formData.subCategory === 'refrigerator') {
      if (!details.Type) {
        toast.error("Type is required.");
        return false;
      }
      if (!details.CoolingSystem) {
        toast.error("Cooling System is required.");
        return false;
      }
      if (!details.Volume) {
        toast.error("Volume is required.");
        return false;
      }
    }

    // Validate details fields for "air conditioner"
    if (formData.subCategory === 'air conditioner') {
      if (!details.Type) {
        toast.error("Type is required.");
        return false;
      }
      if (!details.Power) {
        toast.error("Power is required.");
        return false;
      }
    }
    // Validate details fields for "TV"
    if (formData.subCategory === 'TV') {
      if (!details.SizeScreen) {
        toast.error("Size Screen is required.");
        return false;
      }
      if (!details.ScreenType) {
        toast.error("Screen Type is required.");
        return false;
      }
      if (!details.RefreshRate) {
        toast.error("Refresh Rate is required.");
        return false;
      }
    }

    // Validate details fields for "perfume"
    if (formData.subCategory === 'perfume') {
      if (!details.TypeUser) {
        toast.error("Type User is required.");
        return false;
      }
      if (!details.Volume) {
        toast.error("Volume is required.");
        return false;
      }
    }

    // Validate details fields for "care"
    if (formData.subCategory === 'care') {
      if (!details.AgeRange) {
        toast.error("Age Range is required.");
        return false;
      }
      if (!details.Volume) {
        toast.error("Volume is required.");
        return false;
      }
    }

    if (!details.color){
      toast.error("Color is required.");
      return false;
    }
    if (!details.waranty){
      toast.error("waranty  is required.");
      return false;
    }
   
    return true;
  };

 
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFormData(formData)) {
      return; // Stop the form submission if validation fails
    }
  

    const productData = new FormData();
    productData.append('name', formData.name);
    productData.append('price', formData.price);
    productData.append('info', formData.info);
    productData.append('category', formData.category);
    productData.append('subCategory', formData.subCategory);
    productData.append('subSubCategory', formData.subSubCategory);
    productData.append('brand', formData.brand);
    productData.append('status', formData.status);
    productData.append('discount', formData.discount);
    productData.append('popular', formData.popular);
    productData.append('details', JSON.stringify(formData.details));
  
    formData.images.forEach((image, index) => {
      productData.append(`image${index + 1}`, image);
    });
     // Append description item images
    formData.details.DescriptionSection.forEach((item, index) => {
      if (item.itemImage) {
        productData.append(`descriptionImage${index + 1}`, item.itemImage);
      }
    });


    try {
      await axios.post(`${apiBaseUrl}/api/product/add`, productData);
      toast.success('Product added successfully!');
      setFormData({
        name: "",
        info: "",
        price: "",
        images: [],
        category: "",
        subCategory: "",
        subSubCategory: "",
        popular: false,
        discount: 0,
        brand: "",
        status: "In stock",
        details: {}
      });    
       // Reload page after a short delay to allow the toast message to be seen
        setTimeout(() => {
          window.location.reload();
        }, 1500); // 1.5 seconds delay (adjust if needed)

    } catch (error) {
      toast.error('Failed to add product. Please try again.');
      console.error(error);
    }
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => {
      const updatedImages = [...prev.images];
      updatedImages[index] = null; // Remove the image at the specified index
      return { ...prev, images: updatedImages };
    });
  
    // Clear the file input (Optional, but ensures a clean state for re-upload)
    const inputElement = document.getElementById(`upload-input-${index}`);
    if (inputElement) {
      inputElement.value = "";
    }
  };
  

  return (
    <section className=" min-h-[600px] pt-4 flexCenter  mx-auto max-w-[1200px] ">
    <form
      onSubmit={handleSubmit}
      className="bg-white px-4 py-6 w-max "
    >
     <div className=" px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 w-max  gap-x-16 "  >
      {/* Leftside */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 pb-3">Add a Product</h2>

        {/* File Upload Section */}
        <div className="flexCenter">
          <div className="grid grid-cols-2 sm:grid-cols-4 pb-2 gap-x-2 w-max gap-y-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="relative w-32 h-32">
                <label
                  htmlFor={`upload-input-${i}`}
                  className="flex flex-col items-center justify-center w-full h-full bg-gray-100 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-200  transform duration-300"
                >
                  {!formData.images[i] ? (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-9 w-10 text-gray-500"
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
                      <span className="mt-2 text-sm text-gray-600">Upload</span>
                    </>
                  ) : (
                    <img
                      src={URL.createObjectURL(formData.images[i])}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  )}
                  <input
                    id={`upload-input-${i}`}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, i)}
                    className="hidden"
                  />
                </label>
                {/* Remove Image Button */}
                {formData.images[i] && (
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(i)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs"
                  >
                    X
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Product Name */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Product Name</label>
          <div className="relative flex items-center">
            <FaTag className="absolute left-3 text-gray-400" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name"
              className="w-full border h-9 border-gray-300 rounded-md pl-10 p-2 focus:outline-blue-500"
              required
            />
          </div>
        </div>

        {/* Description Info */}
        <div className="mt-2">
          <label className="block text-gray-700 font-medium mb-2">
            Description Info
          </label>
          <div className="relative">
            <FaInfoCircle className="absolute top-3 left-3 text-gray-400" />
            <textarea
              name="info"
              value={formData.info}
              onChange={handleChange}
              placeholder="Enter product description Info"
              className="w-full border border-gray-300 rounded-md pl-12 p-2 focus:outline-blue-500"
              rows="3"
              required
            ></textarea>
          </div>
        </div>

        {/* Price */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Price</label>
          <div className="relative flex items-center">
            <FaDollarSign className="absolute left-3 text-gray-400" />
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Enter price (e.g., 100)"
              className="w-full border h-9 border-gray-300 rounded-md pl-10 p-2 focus:outline-blue-500"
              min="0"
              step="0.01"
              required
            />
          </div>
        </div>

        {/* Discount */}
        <div>
          <label className="block text-gray-700 font-medium my-2">Any Discount?</label>
          <div className="relative flex items-center">
            <FaPercentage className="absolute left-3 text-gray-400" />
            <input
              type="number"
              name="discount"
              value={formData.discount || ""}
              onChange={handleChange}
              placeholder="Enter discount (e.g., 10%)"
              className="w-full border h-9 border-gray-300 rounded-md pl-10 p-2 focus:outline-blue-500"
              min="0"
              max="100"
              step="0.1"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-gray-700 my-2">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-2 border rounded-md h-9 focus:outline-blue-500"
          >
            <option value="" disabled>
              Select Category
            </option>
            {Object.keys(categories).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Subcategory */}
        {formData.category && (
          <div>
            <label className="block text-gray-700 my-2">Subcategory</label>
            <select
              name="subCategory"
              value={formData.subCategory}
              onChange={handleChange}
              className="w-full p-2 border rounded-md h-10 focus:outline-blue-500"
            >
              <option value="" disabled>
                Select Subcategory
              </option>
              {Object.keys(categories[formData.category].subCategories).map((subCat) => (
                <option key={subCat} value={subCat}>
                  {subCat}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Sub-Subcategory */}
        {formData.subCategory &&
          categories[formData.category].subCategories[formData.subCategory].length >
            0 && (
            <div className="mb-4">
              <label className="block text-gray-700 my-2">Sub-Subcategory</label>
              <select
                name="subSubCategory"
                value={formData.subSubCategory}
                onChange={handleChange}
                className="w-full p-2 border rounded-md h-10 focus:outline-blue-500"
              >
                <option value="" disabled>
                  Select Sub-Subcategory
                </option>
                {categories[formData.category].subCategories[
                  formData.subCategory
                ].map((subSubCat) => (
                  <option key={subSubCat} value={subSubCat}>
                    {subSubCat}
                  </option>
                ))}
              </select>
            </div>
          )}

        {/* Brand */}
        <div>
          <label className="block text-gray-700 my-2">Brand</label>
          <div className="relative flex items-center">
            <FaTag className="absolute left-3 text-gray-400" />
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              placeholder="Enter brand"
              className="w-full border h-9 border-gray-300 rounded-md pl-10 p-2 focus:outline-blue-500"
            />
          </div>
        </div>

        {/* Status */}
        <div className="mb-4">
          <label className="block text-gray-700 my-2">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full p-2 border rounded-md h-9 focus:outline-blue-500"
          >
            <option value="In stock" className="text-green-500">
              In stock
            </option>
            <option value="Out stock" className="text-red-500">
              Out stock
            </option>
            <option value="On order" className="text-blue-500">
              On order
            </option>
          </select>
        </div>
      </div>
      {/* right side  */}
      <div className="lg:pt-12 " >
          {/* Details  */}
          <Details 
            subCategory={formData.subCategory} 
            subSubCategory={formData.subSubCategory} 
            details={formData.details} 
            handleChange={(e) => {
              const { name, value } = e.target;
              setFormData((prev) => ({
                ...prev,
                details: {
                  ...prev.details,
                  [name]: value,
                },
              }));
            }} 
          />

          {/* Popular */}
          <label className="flex items-center gap-2 my-2 cursor-pointer max-w-max ">
            <input type="checkbox" name="popular" checked={formData.popular} onChange={handleChange} />
            Add to Popular
          </label>
  
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-tertiary text-white font-medium py-2 rounded-md hover:bg-tertiary/75 hover:text-secondaryWhite transition duration-200"
          >
            Add Product
          </button>
      </div>

     </div>
    </form>
  </section>
    );
  };
  
export default AddProduct;
