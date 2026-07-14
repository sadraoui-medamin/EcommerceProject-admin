import { useEffect, useState } from "react";
import axios from "axios";
import apiBaseUrl from "../config/api";
import { RiEditBoxLine, RiImageAddLine } from "react-icons/ri";
import {  FaSearch, FaTrash } from "react-icons/fa";
import { Popconfirm, Tooltip, Modal, Button } from "antd";
import { toast } from "react-toastify";
import AddHomeBunnerForm from "../components/HomeBunners/AddHomeBunners";
import UpdateHomeBunnerForm from "../components/HomeBunners/UpdateHomeBunner";

const HomeBanners = () => {
  const [banners, setBanners] = useState([]);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);

  const fetchData = async () => {
    try {
      const bannerRes = await axios.get(`${apiBaseUrl}/api/homebunner/list`);
      const bannerData = bannerRes.data?.HomeBanners || [];

      const productRes = await axios.get(`${apiBaseUrl}/api/product/list`);
      const productData = productRes.data?.products || [];

      const enrichedBanners = bannerData.map((banner) => {
        const product = productData.find((prod) => prod._id === banner.productId);
        return {
          ...banner,
          product: product || {}, 
        };
      });

      setBanners(enrichedBanners);
      setProducts(productData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (banner) => {
    setSelectedBanner(null); // Reset before setting a new one
    fetchData(); // Fetch data to ensure the latest state
    setTimeout(() => {
      setSelectedBanner(banner);
      setIsUpdateModalOpen(true);
    },0);
  };
  
  // Delete a banner
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiBaseUrl}/api/homebunner/delete`, {
        data: { id },
      });
      fetchData();
      toast.success("Banner deleted successfully!");
    } catch (error) {
      console.error("Error deleting banner:", error);
      toast.error("Failed to delete banner.");
    }
  };

  return (
    <div className="px-12 pt-12">
      <h1 className="text-2xl font-bold mb-8">Home Banners</h1>

      {/* Search Bar */}
      <div className="flex items-center mb-6 gap-4 pr-2">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search product by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 h-9 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 flex items-center gap-2 text-sm"
        >
          <RiImageAddLine className="text-xl inline-block" />
          Add Home Banner
        </button>
      </div>

      {/* Table */}
      <div>
        <table className="w-full items-center">
          <thead>
            <tr className="border-b-2 border-gray-300 items-center">
              <th className="p-2">Banner</th>
              <th className="p-2">Product</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {banners
              .filter((banner) => banner.product?.name?.toLowerCase().includes(search.toLowerCase()))
              .map((banner) => (
                <tr key={banner._id} className="hover:bg-slate-100">
                  <td className="p-2">
                    <img src={banner.image} alt="Banner" className="!min-w-32 !max-w-64 h-40 object-cover mx-auto " />
                  </td>
                  <td>
                    <div className="p-2 flex md:flex-nowrap flex-wrap items-center gap-4">
                      <img src={banner.product.images[0] || ""} alt={banner.product.name || "Unknown"} className="w-40 h-40  hidden md:block object-cover" />
                      <span className="flex flex-col gap-1 py-2">
                        <span>{banner.product.name}</span>
                        <span className="text-sm text-gray-500 ">
                          {banner.product.category}/{banner.product.subCategory}
                          {banner.product.subSubCategory ? `/${banner.product.subSubCategory}` : ""}
                        </span>
                        <span className="text-sm text-green-800">{banner.product.price} $</span>
                      </span>
                    </div>
                  </td>
                  {/* Action Edit and delete bunner */}
                  <td >
                    <div className="flexCenter gap-2 items-center">
                        <Tooltip placement="top" title="Edit Banner" color="#061178">
                          <Button
                            onClick={() => handleEdit(banner)}
                            type="primary"
                            className='px-2 py-1'
                            >
                            <RiEditBoxLine className='text-lg '/>
                          </Button>
                        </Tooltip>
                        <Popconfirm
                          title="Are you sure to delete this banner?"
                          onConfirm={() => handleDelete(banner._id)}
                          okText="Yes"
                          cancelText="No"
                        >
                          <Tooltip placement="top" title="Delete Banner" color="#820014">
                            <Button 
                              className='px-2 py-1'
                              danger
                              icon={<FaTrash />} 
                            />
                          </Tooltip>
                        </Popconfirm>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Add Banner Modal */}
      <Modal open={isModalOpen} onCancel={() => setIsModalOpen(false)   && fetchData() } footer={null}>
        <AddHomeBunnerForm fetchData={fetchData} closeModal={() => setIsModalOpen(false)} />
      </Modal>

      {/* Update Banner Modal */}
      <Modal open={isUpdateModalOpen} onCancel={() => setIsUpdateModalOpen(false)} className="min-w-[800px]" footer={null}>
        <UpdateHomeBunnerForm
          banner={selectedBanner}
          fetchData={fetchData}
          closeModal={() => setIsUpdateModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default HomeBanners;
