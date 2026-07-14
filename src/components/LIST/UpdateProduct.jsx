import React from 'react';
import { Popconfirm, Button } from 'antd';
import DetailsUpdate from './DetailsUpdate';
import { FaPercentage, FaTag } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';
import apiBaseUrl from '../../config/api';

const UpdateProduct = ({ setCurrentProduct,currentProduct ,setIsEditModalOpen,fetchProducts}) => {
  
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
   const handleDeleteImage = async (i) => {
        const updatedImages = [...currentProduct.images];
        updatedImages.splice(i, 1); // Remove image at index i
        setCurrentProduct({ ...currentProduct, images: updatedImages });
        console.log(currentProduct.images)
    };
    // handle Image Change
    const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
        setCurrentProduct((prev) => {
        const updatedImages = [...prev.images];
        updatedImages[index] = file;
        console.log("updatedImages : ",updatedImages);
        return { ...prev, images: updatedImages };
        });
    }
    };
    // Validate Form Data
    const validateFormData = (formData) => {
    // Check if no images are uploaded
    if (!formData.images[0]) {
        toast.error('Please upload at least the fist image');
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
    // // Validate description items
    // if ( details.descriptionItems.length >= 1) {

    //   if (details.descriptionItems[0].itemImage && details.descriptionItems[0].descriptionItem) {    
    //     return true;
        
    //   }else{
    //       // Validate each description item
    //     for (let i = 0; i < details.descriptionItems.length; i++) {
    //       const item = details.descriptionItems[i];
    //           if (!item.itemImage) {
    //             toast.error(`Image is required for description item ${i + 1}.`);
    //             return false;
    //           }
    //           if (!item.descriptionItem) {
    //             toast.error(`Description is required for description item ${i + 1}.`);
    //             return false;
    //           }
    //      }
    //   }
    // }
    return true;
    };
    // handle Update
    const handleUpdate = async (e) => {
    e.preventDefault();
    if (!validateFormData(currentProduct)) {
        return; // Stop the form submission if validation fails
    }
    try {
        const formData = new FormData();
        formData.append('id', currentProduct._id);
        formData.append('name', currentProduct.name);
        formData.append('info', currentProduct.info);
        formData.append('price', currentProduct.price);
        formData.append('discount', currentProduct.discount);
        formData.append('brand', currentProduct.brand);
        formData.append('status', currentProduct.status);
        formData.append('popular', currentProduct.popular);
        formData.append('details', JSON.stringify(currentProduct.details));
        formData.append('category', currentProduct.category);
        formData.append('subCategory', currentProduct.subCategory);
        if  (currentProduct.subSubCategory) { 
        formData.append('subSubCategory', currentProduct.subCategory);
        }
        // Append images 
        console.log(currentProduct.images);
        for (let i = 1; i <= currentProduct.images.length; i++) {
            const image = currentProduct.images[i - 1];
            if (image instanceof File) {
                // If it's a File, append directly
                formData.append(`image${i}`, image);
            } else if (typeof image === 'string') {
                // If it's a URL, fetch and convert to File
                const response = await fetch(image);
                const blob = await response.blob();
                const file = new File([blob], `image${i}`, { type: blob.type });
                formData.append(`image${i}`, file);
            }
        }
        
        // Log all entries in formData
        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }
        // Append description item images
        if (currentProduct.details.DescriptionSection) {
            for (let i = 0; i <  currentProduct.details.DescriptionSection.length; i++) {
                const item =  currentProduct.details.DescriptionSection[i];
                if (item.itemImage instanceof File) {
                    // If it's a File, append directly
                    formData.append(`descriptionImage${i + 1}`, item.itemImage);
                } else if (typeof item.itemImage === 'string') {
                    // If it's a URL, fetch and convert to File
                    const response = await fetch(item.itemImage);
                    const blob = await response.blob();
                    const file = new File([blob], `descriptionImage${i + 1}`, { type: blob.type });
                    formData.append(`descriptionImage${i + 1}`, file);
                }
            }
        }   

        // Send Update Request
        await axios.put(`${apiBaseUrl}/api/product/update`, formData , {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        toast.success('Product updated successfully');
        setIsEditModalOpen(false);
        fetchProducts();
    } catch (error) {
        toast.error('❌ Error updating product');
        console.error(error);
        }
    };

  return (
    <form onSubmit={handleUpdate} className="bg-white p-6 w-max rounded-xl">
     <div className="px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 w-max gap-x-9">
      {/* Left Side */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 pb-3">Update Product</h2>

        {/* File Upload Section */}
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-4 pb-2 gap-x-2 w-max gap-y-6">
        {[...Array(4)].map((_, i) => (
            <div key={i} className="relative w-32 h-32 items-center">
            <label
                htmlFor={`upload-input-${i}`}
                className="flex flex-col items-center justify-center w-32 h-32 bg-gray-100 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-200"
            >
                {currentProduct.images?.[i] ? (
                <div className="relative w-full h-full">
                    <img
                    src={
                        currentProduct.images[i] instanceof File
                        ? URL.createObjectURL(currentProduct.images[i])
                        : currentProduct.images[i]
                    }
                    alt="Preview"
                    className="w-full h-full object-cover rounded-lg"
                    />
                    {/* Delete Button with Popconfirm */}
                    <Popconfirm
                    title="Are you sure to delete this image?"
                    onConfirm={() => handleDeleteImage(i)}
                    okText="Yes"
                    cancelText="No"
                    >
                    <Button
                        size="small"
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs"
                    >
                        ✕
                    </Button>
                    </Popconfirm>
                </div>
                ) : (
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
                )}
                <input
                id={`upload-input-${i}`}
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, i)}
                className="hidden"
                />
            </label>
            </div>
        ))}
        </div>
        {/* Product Name */}
        <div>
        <label className="block text-gray-700 font-medium mb-2">Product Name</label>
        <input
            type="text"
            value={currentProduct.name}
            onChange={(e) =>
            setCurrentProduct({ ...currentProduct, name: e.target.value })
            }
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
        />
        </div>

        {/* Info */}
        <div className="mt-2">
        <label className="block text-gray-700 font-medium mb-2">Info</label>
        <textarea
            name="info"
            value={currentProduct.info}
            onChange={(e) =>
            setCurrentProduct({ ...currentProduct, info: e.target.value })
            }
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
            required
        />
        </div>

        {/* Price */}
        <div>
        <label className="block text-gray-700 font-medium mb-2">Price</label>
        <input
            type="number"
            value={currentProduct.price}
            onChange={(e) =>
            setCurrentProduct({ ...currentProduct, price: e.target.value })
            }
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
            step="0.01"
            required
        />
        </div>
        {/* Discount */}
        <div>
            <label className="block text-gray-700 font-medium my-2">Any Discount?</label>
            <div className="relative flex items-center">
            <FaPercentage className="absolute left-3 text-gray-400" />
            <input
                type="number"
                name="discount"
                value={currentProduct.discount}
                onChange={(e) =>
                setCurrentProduct({ ...currentProduct, discount: e.target.value })
                }
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
            value={currentProduct.category}
            onChange={(e) =>
            setCurrentProduct({ ...currentProduct, category: e.target.value })
            }
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
        {currentProduct.category && (
            <div>
            <label className="block text-gray-700 my-2">Subcategory</label>
            <select
                name="subCategory"
                value={currentProduct.subCategory}
                onChange={(e) =>
                setCurrentProduct({ ...currentProduct, subCategory: e.target.value })
                }
                className="w-full p-2 border rounded-md h-10 focus:outline-blue-500"
            >
                <option value="" disabled>
                Select Subcategory
                </option>
                {Object.keys(categories[currentProduct.category].subCategories).map((subCat) => (
                <option key={subCat} value={subCat}>
                    {subCat}
                </option>
                ))}
            </select>
            </div>
        )}

        {/* Sub-Subcategory */}
        {currentProduct.subCategory &&
            categories[currentProduct.category].subCategories[currentProduct.subCategory].length >
            0 && (
            <div className="mb-4">
                <label className="block text-gray-700 my-2">Sub-Subcategory</label>
                <select
                name="subSubCategory"
                value={currentProduct.subSubCategory}
                onChange={(e) =>
                setCurrentProduct({ ...currentProduct, subSubCategory: e.target.value })
                }
                className="w-full p-2 border rounded-md h-10 focus:outline-blue-500"
                >
                <option value="" disabled>
                    Select Sub-Subcategory
                </option>
                {categories[currentProduct.category].subCategories[
                    currentProduct.subCategory
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
                value={currentProduct.brand}
                onChange={(e) =>
                setCurrentProduct({ ...currentProduct, brand: e.target.value })
                }
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
            value={currentProduct.status}
            onChange={(e) =>
            setCurrentProduct({ ...currentProduct, status: e.target.value })
            }
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

      {/* Right Side */}
      <div className="lg:pt-12">

        {/* Details */}
        <DetailsUpdate  
          subCategory={currentProduct.subCategory} 
          subSubCategory={currentProduct.subSubCategory} 
          details={currentProduct.details} 
          handleChange={(e) => {
            const { name, value } = e.target;
            setCurrentProduct((prev) => ({
            ...prev,
            details: {
                ...prev.details,
                [name]: value,
            },
            }));
        }} 
        />
        {/* Popular */}
        <label className="flex items-center gap-2 mt-3 mb-2 cursor-pointer">
        <input
            type="checkbox"
            checked={currentProduct.popular}
            onChange={(e) =>
            setCurrentProduct({ ...currentProduct, popular: e.target.checked })
            }
        />
        Add to Popular
        </label>

        {/* Submit Button */}
        <button
            type="submit"
            className="w-full bg-blue-500 h-[41.6px] text-white py-2 rounded-lg transition duration-200 hover:bg-blue-400"
            >
            Save Changes
        </button>
      </div>
     </div>
    </form>
  );
};

export default UpdateProduct;
