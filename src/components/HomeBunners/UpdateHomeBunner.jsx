import { useState, useEffect } from "react";
import axios from "axios";
import apiBaseUrl from "../../config/api";
import { toast } from "react-toastify";
import { Upload, message } from "antd";
import { InboxOutlined, CloseOutlined } from "@ant-design/icons";
import { Input } from "antd";
const { Search } = Input;
const { Dragger } = Upload;

const UpdateHomeBunnerForm = ({ banner, fetchData, closeModal }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(banner.product);
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(banner.image);

  // get  products from the server 
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${apiBaseUrl}/api/product/list`);
        setProducts(Array.isArray(res.data?.products) ? res.data.products : []);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      }
    };
    fetchProducts();
  }, []);

  // filter product by name 
  useEffect(() => {
    if (!search.trim()) {
      setFilteredProducts([]);
      return;
    }
    setFilteredProducts(
      products.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, products]);

  // render the selected product and her image 
  useEffect(() => {
    setSelectedProduct(banner?.product || null);
    setPreviewUrl(banner?.image || null);
  }, [banner]);
  

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setSearch("");
    setFilteredProducts([]);
  };
  // Handle cancel selection
  const handleCancelSelection = () => {
    setSelectedProduct(null);
    setSearch(""); // Clear search input
    setImage(null); // Remove uploaded image
    setPreviewUrl(null); // Clear preview
  };

  const handleFileChange = (file) => {
    if (!file.type.startsWith("image/")) {
      message.error("Please upload a valid image file.");
      return false;
    }
    setImage(file);
    // Create a preview URL for the selected image
    const fileReader = new FileReader();
    fileReader.onload = (e) => setPreviewUrl(e.target.result);
    fileReader.readAsDataURL(file);
    message.success(`${file.name} selected successfully.`);
    return false;
  };
    // Remove the selected image
    const handleRemoveImage = () => {
      setImage(null);
      setPreviewUrl(null);
      message.warning("Image removed.");
    };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedProduct) {
      toast.error("Please select a product.");
      return;
    }

    const formData = new FormData();
    formData.append("bannerId", banner._id);
    formData.append("productId", selectedProduct._id);
    if (image) formData.append("image", image);

    try {
      await axios.put(`${apiBaseUrl}/api/homebunner/update`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Banner updated successfully!");
      fetchData();
      closeModal();
    } catch (error) {
      toast.error("Error updating banner.");
      console.error(error);
    }
  };

  return (
    <div className="px-12 py-12">
      <h1 className="text-2xl font-bold mb-4">Update Home Banner</h1>
      <Search placeholder="Search product..." value={search} onChange={(e) => setSearch(e.target.value)} />

      {/* Autocomplete Search Results */}
      {filteredProducts.length > 0 && (
        <ul className="border rounded mt-2 max-h-96 overflow-y-auto animate-fadeIn">
          {filteredProducts.map((product) => (
            <li
              key={product._id}
              className="p-2 flex items-center gap-4 border-b cursor-pointer hover:bg-gray-200"
              onClick={() => handleSelectProduct(product)}
            >
              <img src={product.images[0]} alt={product.name} className="w-16 h-16" />
              <span className="flex flex-col gap-1">
                <span>{product.name}</span>
                <span className="text-sm text-gray-500">
                  {product.category}/{product.subCategory}
                  {product.subSubCategory ? `/${product.subSubCategory}` : ""}
                </span>
                <span className="text-sm text-green-800">{product.price} $</span>
              </span>
            </li>
          ))}
        </ul>
      )}

      {/* Selected Product */}
      {selectedProduct && (
        <div className="mt-3 p-2 bg-gray-100 border rounded flex justify-between items-center">
          <p className="flex gap-2 items-center w-full">
            Selected:
            <li key={selectedProduct._id} className="p-2 flex items-center w-full gap-4 border-b cursor-pointer">
              <img src={selectedProduct.images[0]} alt={selectedProduct.name} className="w-16 h-16" />
              <span className="flex flex-col gap-1">
                <span>{selectedProduct.name}</span>
                <span className="text-sm text-gray-500">
                  {selectedProduct.category}/{selectedProduct.subCategory}
                  {selectedProduct.subSubCategory ? `/${selectedProduct.subSubCategory}` : ""}
                </span>
                <span className="text-sm text-green-800">{selectedProduct.price} $</span>
              </span>
            </li>
          </p>
          <button
            type="button"
            onClick={handleCancelSelection}
            className=" bg-red-600 hover:bg-red-600/40 animation-btn text-white rounded-xl w-8 p-1"

          >
               <CloseOutlined  />
           </button>
        </div>
      )}
      
      {/* Image Upload (Dragger with Preview & Cancel) */}
      {selectedProduct && (
        <div className="mt-3">
          <Dragger accept="image/*" beforeUpload={handleFileChange} showUploadList={false}>
            {previewUrl ? (
              <div className="relative" onClick={(e) => e.stopPropagation()}> {/* Stop Dragger click */}
                <img src={previewUrl} alt="Preview" className="max-w-full h-32 object-cover mx-auto" />
                <button
                  type="button"
                  className="absolute top-0 right-0 bg-red-600 hover:bg-red-600/40 animation-btn text-white rounded-xl w-8 p-1"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent Dragger from triggering
                    handleRemoveImage();
                  }}
                >
                  <CloseOutlined  />
                </button>
              </div>
            ) : (
              <>
                  <InboxOutlined className=" text-gray-50 text-5xl" />
                <p className="ant-upload-text">Click or drag an image to upload</p>
                <p className="ant-upload-hint">Only image files are allowed.</p>
              </>
            )}
          </Dragger>
        </div>
      )}

      {selectedProduct && (
              <button
                onClick={handleUpdate}
                className="mt-4 bg-blue-500 text-white p-2 rounded w-full animation-btn hover:bg-blue-500/70"
              >
                Save Banner
              </button>
            )}
     </div>
  );
};

export default UpdateHomeBunnerForm;
