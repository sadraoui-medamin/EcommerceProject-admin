import React, { useState, useEffect } from "react";
import axios from "axios";
import apiBaseUrl from "../config/api";
import { toast } from "react-toastify";
import { Table, Input, Select, Spin } from "antd";
import { FaCalendar, FaCalendarWeek, FaCheck, FaLocationDot, FaRegCalendar, FaTruck } from "react-icons/fa6";
import {  FaPhone, FaUser } from "react-icons/fa";
import { LoadingOutlined, MailFilled, SearchOutlined } from "@ant-design/icons";
import { PiThreeDFill } from "react-icons/pi";
import moment from "moment";
import { Button, Popover, Radio } from "antd";
import { RiEditLine } from "react-icons/ri";
import { TbFilter, TbFilterDollar } from "react-icons/tb";
import { IoCalendarNumber, IoCloseCircle, IoTodaySharp } from "react-icons/io5";
import { BsFilterLeft } from "react-icons/bs";
import { TbBasketExclamation } from "react-icons/tb";
import { TbBasketCheck } from "react-icons/tb";
import { useNavigate, useParams } from "react-router-dom";
import { IoIosCloseCircleOutline } from "react-icons/io";
import Search from "antd/es/input/Search";
const { Option } = Select;

const Orders = () => {
  const { id } = useParams();
  const navigate =useNavigate();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paidFilter, setPaidFilter] = useState("");

  const fetchAllOrders = async () => {
    try {
      const res = await axios.get(`${apiBaseUrl}/api/order/list`);
      if (res.data.success) {
        const reversedOrders = res.data.data.reverse(); // Reverse the array
        setOrders(reversedOrders);
      }
    } catch (error) {
      toast.error("Failed to fetch orders");
    }
  }
  useEffect(() => {
    fetchAllOrders();
  }, []);


  // First: separate states for fetched base and filtered
  const [fetched, setFetched] = useState([]);
  
  // Step 1: Fetch/filter by param (like `id`) once
  useEffect(() => {
    let result = [...orders];
  
    // filter by id in URL params
    if (id) {
      result = result.filter((order) => {
        const match = order._id === id;
        if (match) setSearchId(id); // optional autofill
        return match;
      });
    }
    setFetched(result); // Save base result
  }, [orders, id]);
  
// Step 2: Refine filters from search by ID/Date pick range /status/ayment true or false.
  const filterOrders = () => {
    let result = [...fetched];

    // Filter by Order ID
    if (searchId) {
      result = result.filter((order) =>
           order._id.toLowerCase().includes(searchId.toLowerCase())
              || order._id == searchId
      );
    }
    // Filter by Date of creation 
    const now = moment();
    result = result.filter((order) => {
      const orderDate = moment(order.date);
      if (dateFilter === "today") return orderDate.isSame(now, "day");
      if (dateFilter === "last3days") return now.diff(orderDate, "days") <= 3;
      if (dateFilter === "lastweek") return now.diff(orderDate, "weeks") < 1;
      if (dateFilter === "lastmonth") return now.diff(orderDate, "months") < 1;
      return true; // "alltime"
    });

    // Filter by status
    if (statusFilter && statusFilter !== "all" ) {
      result = result.filter((order) => order.status === statusFilter);
    }

    // Filter by payment true or false
    if (paidFilter && paidFilter !== "all") {
      if (paidFilter ==="paid") {
        result = result.filter((order) => order.payment === true);
      }else if (paidFilter === "notPaid") {
        result = result.filter((order) => order.payment === false);
      }
    }

    setFilteredOrders(result);
  };
  useEffect(() => {
    filterOrders();
  }, [searchId, dateFilter, statusFilter, paidFilter, fetched]);



  // handel change order status  functions
const [popoverVisibleId, setPopoverVisibleId] = useState(null);
const [selectedStatus, setSelectedStatus] = useState("Product Loading");

  const statusHandler = async (event, orderId) => {
    try {
      const res = await axios.post(`${apiBaseUrl}/api/order/status`, {
        orderId,
        status: event.target.value,
      });
      if (res.data.success) {
        toast.success("Order status updated");
        fetchAllOrders(); // Refresh orders
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const columns = [
    {title: "#",
      key: "index",
      render: (_, __, index) => (
        <p className="font-semibold font-mono">{index + 1}</p>
      ),
    },
    {title: "Order Items",
      key: "order",
      width: 400,
      render: (_, order) => (
        <div>
          <p className="font-semibold font-mono text-blue-500 -mx-2 mb-2">- ID Order: {order._id}</p>
          <table className="w-full text-sm ">
            <thead>
              <span className="font-semibold  font-mono  -mx-2 ">- Items :</span>
              <hr  className="px-2 mt-2"/>
            </thead>
            <tbody>
              {order.items.map((item, index) => (
                <div key={index}>
                 <tr key={index}  className="flex flex-row hover:bg-slate-100 ">
                  
                  <td className="p-2 flexCenter">
                    <a
                      title={"View product : "+item._id}
                      href={`/listProducts/${item._id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="!underline hover:text-blue-500 "
                      >
                      {item.name}
                    </a>
                  </td>
                  <td className="p-2 flexCenter font-extrabold">x</td>
                  <td className="p-2 flexCenter  text-green-600 font-semibold">{item.quantity}</td>
               
                 </tr>
                 <hr  className="px-2"/>
                </div>
              ))}
            </tbody>
          </table>
        </div>
      ),
    },
    {title: "Customer Address",
      dataIndex: "address",
      key: "address",
      width: 220,
      render: (address) => (
        <div className="flex flex-col gap-2">
           <p className="font-semibold font-serif flex items-center gap-x-2 ">
            <FaUser/>{address.firstName} {address.lastName}
           </p>
           <span className="flex items-start gap-x-2 text-gray-500"> 
            <FaLocationDot  className="mt-1"  />
            <span className="flex flex-col ">
              <p>{address.street}</p>
              <p>
                {address.city}, {address.state}, {address.country} - {address.zipcode}
              </p>
            </span>
         </span>
         <span className="flex items-center gap-x-2 text-gray-500 ">
           <MailFilled/>
           <p>{address.email}</p>
         </span>
         <span className="flex items-center gap-x-2 text-gray-500 ">
          <FaPhone/>
           <p>{address.phone}</p>
         </span>
        </div>
      ),
    },
    {title: "Amount",
    dataIndex: "amount",
    key: "amount",
    render: (amount) => (
      <td className=" text-green-500   font-medium">${amount.toFixed(2)}</td>
    ),
    },
    {title: "payment",
      dataIndex: "payment",
      key: "payment",
      with :300,
      render: (payment) => (
        <span
            className={`px-2 py-1 rounded text-white text-xs w-max flex   ${
            payment ? "bg-blue-500" : "bg-red-500"
          }`}
        >
          {payment ? "Paid" : "Not Paid"}
        </span>
      ),
    },
    { title: "Status",
      dataIndex: "status",
      render: (status) => (
          <div className="flex p-2 justify-start text-left">
            <div 
              className={`flexBetween gap-x-3 items-start text-sm ${
                status === "Out for Delivery" ? "text-blue-400" :
                status === "Delivered" ? "text-green-500" :
                status === "Product Loading" ? "text-orange-500" : "text-gray-500"
              }`}
            >
              <div >
                {status === "Out for Delivery" && ( 
                  <FaTruck className="text-blue-400" />)
                }
                {status === "Delivered" && ( 
                  <FaCheck className="text-green-500" />
                )}
                {status === "Product Loading" && ( 
                  <Spin indicator={<LoadingOutlined className='text-orange-500' spin/>} size="default" />
                )}
              </div>
              <b className="text-[12px]">{status}</b>
            </div>
          </div>
      )
    },
    {title: "Actions",
      key: "changeStatus",
      render: (_, record) => {
        const isOpen = popoverVisibleId === record._id;
        const popoverContent = (
        <div className="flex flex-col gap-2 " >
         <span className="font-serif font-extrabold text-lg ">
          Update Order Status
        </span>
        <div className="p-2  pt-0">
        <span className="font-sans text-sm mb-4 flex max-w-64 text-gray-500">
          Select one of the statuses below to update the order status :
        </span>
         <div className="flex flex-col gap-2 px-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="status"
                value="Product Loading"
                checked={selectedStatus === "Product Loading"}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="form-radio cursor-pointer text-orange-500"
              />
              <span className="text-orange-500 text-sm font-bold font-mono">Product Loading</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="status"
                value="Out for Delivery"
                checked={selectedStatus === "Out for Delivery"}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="form-radio cursor-pointer text-blue-500"
              />
              <span className="text-blue-500 text-sm font-bold font-mono">Out for Delivery</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="status"
                value="Delivered"
                checked={selectedStatus === "Delivered"}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="form-radio cursor-pointer text-green-500"
              />
              <span className="text-green-500 text-sm font-bold font-mono">Delivered</span>
            </label>
          </div>
          </div> 
          <button
            className="rounded-md mt-2 hover:!scale-105 flexCenter gap-1 animation-btns bg-blue-500 hover:bg-blue-500/70 text-white"
            onClick={() => {
              statusHandler({ target: { value: selectedStatus } }, record._id);
              setPopoverVisibleId(null);
            }}
            >
            <RiEditLine />
            <span >Save</span>
          </button>
        </div>
      );

      return (
        <Popover
          placement="topRight"
          content={popoverContent}
          trigger="click"
          open={isOpen}
          onOpenChange={(visible) => {
            if (visible) {
              setSelectedStatus(record.status); // pre-select current
              setPopoverVisibleId(record._id);
            } else {
              setPopoverVisibleId(null);
            }
          }}
        >
          <Button
            icon={<RiEditLine />}
            size="small"  
            type="primary"
            className="p-2  py-3 font-semibold text-xs"
            >
            Update Status
          </Button>
        </Popover>
      );
    },
    },
 ];

  return (
    <section className="px-12 pt-12">
      <h1 className="text-2xl font-bold mb-8">Orders Management</h1>

      {/* Filters  searchbar  filterby date , status, payment*/}
      <div className="flex flex-row w-full gap-4 mb-8">
      <Search
        prefix={<SearchOutlined />}
        placeholder="Search by Order ID"
        enterButton="Search"
      
        value={searchId}
        onChange={(e) => setSearchId(e.target.value)}
        suffix={
          searchId && (
            <button
              title="Clear search bar"
              onClick={() => {
                setSearchId("");
                setDateFilter("last3DAY"); 
                setStatusFilter("");      
                setPaidFilter("");      
                navigate("/Orders");       // optional: reset route param
              }}
              className=" text-gray-400 text-xl cursor-pointer hover:!scale-110 animation-btn rounded-full hover:bg-gray-200 hover:text-black/60"
            >
              <IoCloseCircle className="text-lg" />
            </button>
          )
        }
        className="w-full"
      />

        <Select
          prefix ={ !dateFilter && <FaRegCalendar   className="text-lg text-gray-500"/>}
          placement="Filter by Date"
          placeholder={<span className="text-gray-400 text-sm font-mono">Filter by Date</span>}
          allowClear
          onChange={setDateFilter}
          className="w-full max-w-44 !ring-1 rounded-md hover:!ring-transparent hover:!duration-300 !ring-black "
        >
          <Option value="all">
              <span className="flex items-center gap-x-2 text-gray-700">
                <BsFilterLeft  className="text-xl"  />
                All Time
              </span>
            </Option>
           <Option value="lastmonth">
                <span className="flex items-center gap-x-2 text-gray-700">
                <IoCalendarNumber        className="text-xl"  />
                Last Month
              </span>
            </Option>
            <Option value="lastweek">
                <span className="flex items-center gap-x-2 text-gray-700">
                <FaCalendarWeek        className="text-xl"  />
                Last Week
              </span>
            </Option>
            <Option value="last3days">
                <span className="flex items-center gap-x-2 text-gray-700">
                <PiThreeDFill    className="text-xl"  />
                Last 3 Days
              </span>
            </Option>
            <Option value="today">
                <span className="flex items-center gap-x-2 text-gray-700">
                <IoTodaySharp       className="text-xl"  />
                Today
              </span>
            </Option>
        </Select>

        <Select
          prefix ={ !statusFilter && <TbFilter  className="text-lg text-gray-500"/>}
          placeholder={<span className="text-gray-400 text-sm font-mono">Filter by Status</span>}
          allowClear
          onChange={setStatusFilter}
          className="w-full max-w-48 !ring-1 rounded-md hover:!ring-transparent hover:!duration-300 !ring-black "
        >
            <Option value="all" >
              <span className="flex items-center gap-x-2 text-gray-700">
                <BsFilterLeft  className="text-lg"  />
                All
              </span>
            </Option>
             <Option value="Delivered">
                <span className="flex items-center gap-x-2 text-green-500">
                <FaCheck   className="text-lg" />
                Delivered
              </span>
            </Option>
             <Option value="Out for Delivery">
                <span className="flex items-center gap-x-2 text-blue-500">
                <FaTruck   className="text-lg " />
                Out for Delivery
              </span>
            </Option>
            <Option value="Product Loading">
                <span className="flex items-center gap-x-2 text-orange-500 ">
                <Spin indicator={<LoadingOutlined className='text-orange-500' spin/>} size="default" />
                Product Loading
              </span>
            </Option>
           
           
        </Select>

        <Select
          prefix ={ !paidFilter && <TbFilterDollar className="text-lg text-gray-500"/>}
          placeholder={<span className="text-gray-400 text-sm font-mono">Filter by Payment</span>}
          allowClear
          onChange={setPaidFilter}
          className="w-full max-w-[200px] !ring-1 rounded-md hover:!ring-transparent hover:!duration-300 !ring-black "
        >
            <Option value="all">
              <span className="flex items-center gap-x-2 text-gray-700">
                <BsFilterLeft  className="text-xl"  />
                All
              </span>
            </Option>
            <Option value="paid">
                <span className="flex items-center gap-x-2 text-green-500">
                <TbBasketCheck   className="text-xl"  />
                Paid
              </span>
            </Option>
            <Option value="notPaid">
                <span className="flex items-center gap-x-2 text-red-700">
                <TbBasketExclamation   className="text-xl " />
                Not Paid
              </span>
            </Option>
        </Select>
      </div>
      {/* Table */}
      <Table
        bordered
        columns={columns}
        dataSource={filteredOrders}
        rowKey="_id"
      />
    
    </section>
  );
};

export default Orders;
   
