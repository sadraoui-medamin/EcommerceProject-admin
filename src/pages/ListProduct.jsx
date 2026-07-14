import React, { useEffect, useState } from "react";
import UpdateProduct from "../components/LIST/UpdateProduct";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import apiBaseUrl from "../config/api";
import { Table, Input, Select, Button, Popconfirm, Tooltip } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { FaEdit, FaTrash } from "react-icons/fa";
import { IoMdStarOutline } from "react-icons/io";
import { CgUnavailable } from "react-icons/cg";
import { LuFilter, LuPackageCheck, LuStarOff } from "react-icons/lu";
import { BiTimer } from "react-icons/bi";
import { BsFilterLeft } from "react-icons/bs";
import { TbFilterStar } from "react-icons/tb";
import { IoCloseCircle } from "react-icons/io5";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RiEditBoxLine } from "react-icons/ri";
const { Search } = Input;
const { Option } = Select;

const ListProducts = () => {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [popularFilter, setPopularFilter] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({});
  const [isClosing, setIsClosing] = useState(false);
  const navigate =useNavigate();
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(`${apiBaseUrl}/api/product/list`);
      if (data?.products) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error("Failed to fetch:", err);
      toast.error("Failed to fetch products.");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

// First: separate states for fetched base and filtered
const [fetched, setFetched] = useState([]);
// Step 1: Fetch/filter by param (like `id`) once
useEffect(() => {
  let result = [...products];

  // filter by id in URL params
  if (id) {
    result = result.filter((p) => {
      const match = p._id === id;
      if (match) setSearchTerm(p.name); // optional autofill
      return match;
    });
  }
  setFetched(result); // Save base result
}, [products, id]);

// Step 2: Refine filters from search/status/popular/etc.
useEffect(() => {
  let result = [...fetched];

  // filter by search term
  if (searchTerm) {
    result = result.filter((p) =>
      [p.name, p.category, p.subCategory, p.subSubCategory].some((field) =>
        field.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }

  // filter by popularity
  if (popularFilter === "notPopular") {
    result = result.filter((p) => p.popular === false);
  } else if (popularFilter === "popular") {
    result = result.filter((p) => p.popular === true);
  }
  // filter by status
  if (statusFilter && statusFilter !== "all") {
    result = result.filter((p) => p.status === statusFilter);
  }

  setFiltered(result);
}, [searchTerm, popularFilter, statusFilter, fetched]);


  const handleDelete = async (_id) => {
    try {
      await axios.delete(`${apiBaseUrl}/api/product/remove`, { data: { id: _id } });
      toast.success("Product deleted successfully.");
      fetchProducts();
    } catch (err) {
      toast.error("Failed to delete product.");
    }
  };

  const openEditModal = (product) => {
    setCurrentProduct(product);
    setIsEditModalOpen(true);
  };

  const CloseModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsEditModalOpen(false);
      setIsClosing(false);
    }, 500);
  };

  const columns = [
    {title: "Image",
      dataIndex: "images",
      render: (images) =>
        images && images.length > 0 ? (
          <img src={images[0]} alt="product" className="w-16 h-16 object-cover rounded-md" />
        ) : (
          <span>No Image</span>
        ),
    },
    {title: "Name",
      dataIndex: "name",
    },
    {title: "Category",
    render: (_, record) =>
      `${record.category} / ${record.subCategory}${record.subSubCategory && ` / ${record.subSubCategory}` }`,
        },
    {title: "Status",
      dataIndex: "status",
      render: (status) => {
        if (status === "In stock") {
          return (
            <span className="flex items-center gap-x-2 text-green-500 w-max" >
              <LuPackageCheck className="text-xl" />
              In Stock
            </span>
          );
        } else if (status === "Out stock") {
          return (
            <span className="flex items-center gap-x-2 text-red-500 w-max">
              <CgUnavailable className="text-xl" />
              Out Stock
            </span>
          );
        } else if (status === "On order") {
          return (
            <span className="flex items-center gap-x-2 text-blue-500 w-max">
              <BiTimer className="text-xl" />
              On Order
            </span>
          );
        } else {
          return <span>{status}</span>; // fallback for unknown status
        }
      },
    },
    {title: "Price",
      dataIndex: "price",
      render: (price) => <span className="text-red-500 font-medium">${price}</span> ,
    },
    {title: "Actions",
      render: (_, product) => (
        <div className="flex gap-2">
          <Tooltip title="Edit">
            <Button  
              onClick={()=>openEditModal(product)}
              type="primary"
              className='px-2 py-1'
              >
              <RiEditBoxLine className='text-lg '/>
            </Button>
          </Tooltip>
          <Popconfirm
            title="Are you sure to delete this product?"
            onConfirm={() => handleDelete(product._id)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete">
              <Button 
                className='px-2 py-1'
                danger
                icon={<FaTrash />} 
              />
            </Tooltip>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="px-12 pt-12">
      <h1 className="text-2xl font-bold mb-8">Product List</h1>
      {/* the Filters  */}
      <div className="flex flex-row gap-4 mb-8 items-center">
        {/* search  */}
        <Search
          prefix={<SearchOutlined />}
          placeholder="Search by name or category..."
          enterButton="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          suffix={
            searchTerm && (
                <button
                    title="Clear search bar"
                    onClick={() => {
                      setSearchTerm("");
                      setPopularFilter("");      // optional: reset filter
                      setStatusFilter("");    // optional: reset filter
                      navigate("/listProducts"); // clear route param
                    }}
                className=" text-gray-400 text-xl cursor-pointer hover:!scale-110 animation-btn rounded-full hover:bg-gray-200 hover:text-black/60"
                  >    
                    <IoCloseCircle className="text-lg"/>
                </button>
            )}
          className="w-full"
        />

        {/* filter by Popularity  */}
        <Select
            placeholder="Filter by Popularity"
            prefix={!popularFilter && <TbFilterStar   className="text-xl"/>}
            onChange={setPopularFilter}
            style={{ width: 200 }}
            allowClear

          >
            <Option value="all">
              <span className="flex items-center gap-x-2 text-gray-700">
                <BsFilterLeft  className="text-xl"  />
                All
              </span>
            </Option>
            <Option value="popular">
              <span className="flex items-center gap-x-2 text-yellow-500">
                <IoMdStarOutline  className="text-xl"  />
                Popular
              </span>
            </Option>
            <Option value="notPopular">
              <span className="flex items-center gap-x-2 text-red-700">
                <LuStarOff  className="text-xl px-1 pl-px ml-px" />
                Not Popular
              </span>
            </Option>
        </Select>

        {/* filter by  status  */}
        <Select
            prefix={!statusFilter && <LuFilter className="text-xl"/>}
            onChange={setStatusFilter}
            style={{ width: 200 }}
            placeholder="Filter by Status"
            allowClear
          >
            <Option value="all">
              <span className="flex items-center gap-x-2 text-gray-700">
                <BsFilterLeft  className="text-xl"  />
                All
              </span>
              </Option>
            <Option value="In stock">
              <span className="flex items-center gap-x-2 text-green-500">
                <LuPackageCheck  className="text-xl" />
                  In Stock
              </span>
            </Option>
            <Option value="Out stock">
              <span className="flex items-center gap-x-2 text-red-500">
                <CgUnavailable className="text-xl" />
                  Out Stock
              </span>
              </Option>
            <Option value="On order">
              <span className="flex items-center gap-x-2 text-blue-500">
              <BiTimer  className="text-xl" />
              On Order
              </span>
            </Option>
        </Select>
        
      </div>
      {/* the display List product  */}
      <Table
        rowKey="_id"
        columns={columns}
        dataSource={filtered}
        pagination={{ pageSize: 10 }}
      />
      
      {/* the Edit product modal tag  */}
      {isEditModalOpen && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center transition-opacity duration-300 ${
            isEditModalOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div
            className={`relative bg-white rounded-xl shadow-lg w-max max-h-screen overflow-x-auto flex ${
              isClosing ? "animate-slideOutTop" : "animate-slideInTop"
            }`}
          >
            <button
              onClick={CloseModal}
              className="absolute top-3 right-4 px-2 pb-2 pt-1 z-50 rounded-full h-8 bg-white text-black hover:bg-blue-500 hover:text-white"
            >
              &times;
            </button>
            <UpdateProduct
              currentProduct={currentProduct}
              setCurrentProduct={setCurrentProduct}
              setIsEditModalOpen={setIsEditModalOpen}
              fetchProducts={fetchProducts}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ListProducts;
