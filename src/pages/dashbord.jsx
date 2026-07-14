import React, { useEffect, useState } from "react";
import axios from "axios";
import CountUp from 'react-countup';
import topIcon from '../assets/Top_ribbon.png'
import ordersIcon from '../assets/orders.png'
import orderIcon from '../assets/order.png'
import salesIcon from '../assets/sales1.png'
import { FaCircleUser, FaDollarSign } from "react-icons/fa6" 
import {  FaCheck, FaEye, FaTruck, FaYenSign } from 'react-icons/fa'; // Assuming this icon is needed
import { ArrowRightOutlined, LoadingOutlined } from '@ant-design/icons';
import CustomerIcon from '../assets/costumers1.png'
import CustomerIcon2 from '../assets/customers2.png'
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import favoriteIcon from'../assets/favorite1.png'
import {
    
    AreaChart,Area, XAxis, YAxis, CartesianGrid,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import {  Select, Spin} from "antd";
const { Option } = Select;
import { useNavigate } from 'react-router-dom';
import apiBaseUrl from "../config/api";

const rangeOptions = [
  { label: "Today", value: "today" },
  { label: "This Week", value: "week" },
  { label: "This Month", value: "month" },
  { label: "This Year", value: "year" },
  { label: "All Time", value: "all" },
];

//Pie chart component 
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#d946ef", "#a855f7"];

const ChartCard = ({ title, data }) => (
  <div className="bg-transparent  rounded-2xl  p-4 w-full md:w-[48%] lg:w-[48%] xl:w-[48%] xl:mb-0 mb-4">
    <h2 className=" font-semibold text-green-900 mb-2 w-full text-center">{title}</h2>
    <ResponsiveContainer width="100%" height={270}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          outerRadius={80}
          fill="#8884d8"
          label
        >
          {data?.map((entry, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  </div>
);
const Dashboard = ({setActiveButton}) => {
  const [summaryCardStats, setSummaryCardStats] = useState(null);
  const [areaChartStats, setAreaChartStats] = useState(null);
  const [tableStats, setTableStats] = useState(null);
  const [pieChartStats, setPieChartStats] = useState(null);
  const navigate =useNavigate();
  // range of summary stats
  const [rangeSalesStats, setRangeSalesStats] = useState("month");
  const [rangeOrderStats, setRangeOrderStats] = useState("month");
  const [rangeCustomerStats, setRangeCustomerStats] = useState("year");


  
    //✅ 1.  fetch summaryCardStats  Section
    useEffect(() => {
      const fetchsummaryCardStats = async () => {
        try {
            const res = await axios.get(`${apiBaseUrl}/api/dashboard/getSummaryCardStats`, {
              params: {
                rangeSalesStats,
                rangeOrderStats,
                rangeCustomerStats,
              },
            });
          setSummaryCardStats(res.data);
          console.log("summaryCardStats :", summaryCardStats)
        } catch (err) {
          console.error("Failed to fetch summaryCardStats stats", err);
        }
      };
      fetchsummaryCardStats();
    }, [rangeSalesStats,rangeOrderStats,rangeCustomerStats]);

    //✅ 2.  fetch AreaChart Stats Section
    const fetchAreaChart= async () =>{
       try {
        const data = await axios.get(`${apiBaseUrl}/api/dashboard/getAreaChartStats`) ;
        setAreaChartStats(data.data || []);
        console.log("AreaChart" , areaChartStats );
       } catch (error) {
         console.error("Error fetching AreaChart data:", error);
       }
    }; 

    //✅ 3.  fetch table Stats Section
    const fetchtableStats= async () =>{
       try {
        const data = await axios.get(`${apiBaseUrl}/api/dashboard/getTableStats`) ;
        setTableStats(data.data);
       } catch (error) {
         console.error("Error fetching table data:", error);
       }
    }; 

    //✅ 4.  fetch PieChart Stats Section
    const fetchPieChartStats = async () =>{
      try {
        const data = await axios.get(`${apiBaseUrl}/api/dashboard/getPiechartStats`) ;
        setPieChartStats(data.data);
      } catch (error) {
        console.error("Error fetching pie chart data:", error);
      }
    }; 

  useEffect(() => {
    fetchAreaChart();
    fetchtableStats();
    fetchPieChartStats();
    }, []);




  // dayjs library to format timestamps as “x days ago”, “x weeks ago”, etc.
  dayjs.extend(relativeTime);

  const renderChange = (value,range) => {
    if (value === null || range === "all") return null;
    const color = value >= 0 ? "text-green-600" : "text-red-600";
    const sign = value >= 0 ? "+" : "";
    return <p className={`text-xs mt-1 font-medium ${color}`}>{sign}{value.toFixed(2)}% vs last {range}</p>;
  };
  if (!summaryCardStats) return <p className="text-center py-20 h-20">Loading...</p>
  if (!areaChartStats) return <p className="text-center py-20">Loading...</p>
  if (!tableStats) return <p className="text-center py-20">Loading...</p>
  if (!pieChartStats) return <p className="text-center py-20">Loading...</p>


  return (
    <div className="md:px-12 pt-12 px-4 ">
      <h1 className="text-2xl font-bold ">Dashboard</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
          {/* Total Sales */}
          <div className="relative border bg-slate-100 p-6 shadow rounded-xl">
            {/* Sales Range Select */}
            <div className="absolute top-4 right-4">
              <Select
                value={rangeSalesStats}
                onChange={(val) => setRangeSalesStats(val)}
                size="small"
                style={{ width: 96 }}
              >
                {rangeOptions.map((r) => (
                  <Option key={r.value} value={r.value}>
                    <span className="!text-[10px] font-medium text-gray-500 hover:text-gray-900 ">{r.label}</span>
                  </Option>
                ))}
              </Select>
            </div>
          <div className="flex flex-col xs:flex-row md:flex-col lg:flex-row mt-8">
              <div className="flex  text-left  flex-col w-full">
                <h3 className="text-gray-500">Total Sales</h3>
                <p className="text-2xl font-bold">
                  ${""}
                  <CountUp end={summaryCardStats?.totalSales || 0} duration={1.5} separator="," decimals={2} />
                </p>
                {renderChange(summaryCardStats?.salesChange, rangeSalesStats)}
              </div>
              <div className="flexCenter items-center w-full  lg:mt-0 mt-4  ">
                <img src={salesIcon} className="w-12 h-12 mb-2" alt="Sales" />
              </div>
            </div>
          </div>

          {/* Total Orders */}
          <div className="relative border bg-slate-100 p-6 shadow rounded-xl">
            {/* Orders Range Select */}
            <div className="absolute top-4 right-4">
              <Select
                value={rangeOrderStats}
                onChange={(val) => setRangeOrderStats(val)}
                size="small"
                style={{ width: 96 }}
              >
                {rangeOptions.map((r) => (
                  <Option key={r.value} value={r.value}>
                    <span className="!text-[10px] font-medium text-gray-500 hover:text-gray-900 hover:scale-105">{r.label}</span>
                  </Option>
                ))}
              </Select>
            </div>

          <div className="flex flex-col xs:flex-row md:flex-col lg:flex-row mt-8">
                  <div className="flex  text-left  flex-col w-full">
                      <h3 className="text-gray-500">Total Orders</h3>
                      <p className="text-2xl font-bold">
                        <CountUp end={summaryCardStats?.totalOrders || 0} duration={1.5} separator="," />
                      </p>
                      {renderChange(summaryCardStats?.ordersChange, rangeOrderStats)}
              
                </div>
                <div className="flexCenter items-center w-full  lg:mt-0 mt-4  ">
                    <img src={ordersIcon} className="w-12 h-12 mb-2" alt="Orders" />
                  </div>
              </div>
          </div>
          
          {/* Total Customers */}
          <div className="relative border bg-slate-100 p-6 shadow rounded-xl">
            {/* Customers Range Select */}
            <div className="absolute top-4 right-4">
              <Select
                value={rangeCustomerStats}
                onChange={(val) => setRangeCustomerStats(val)}
                size="small"
                style={{ width: 96 }}
              >
                {rangeOptions.map((r) => (
                  <Option key={r.value} value={r.value}>
                    <span className="!text-[10px] font-medium text-gray-500 hover:text-gray-900 hover:scale-105">{r.label}</span>
                  </Option>
                ))}
              </Select>
            </div>
          <div className="flex flex-col xs:flex-row md:flex-col lg:flex-row mt-8">
                <div className="flex  text-left  flex-col w-full">
                      <h3 className="text-gray-500">Total Customers</h3>
                      <p className="text-2xl font-bold">
                        <CountUp end={summaryCardStats?.totalUsers || 0} duration={1.5} separator="," />
                      </p>
                      {renderChange(summaryCardStats?.usersChange, rangeCustomerStats)}
                  </div>
                <div className="flexCenter items-center w-full lg:mt-0 mt-4 ">
                  <img src={CustomerIcon} className="w-12 h-12 mb-2" alt="Customers" />
                </div>
            </div>
          </div>


        </div>

        {/* Area Chart  */}
        {/* Revenue of the last 12 months */}
        <div className="bg-slate-100 p-4 !pb-0 px-6  border shadow flex-col flex rounded-xl overflow-auto">
          <span className=" font-medium font-sans flex items-center"><FaDollarSign/>Revenue of the last 12 months ( <span className="text-sm text-gray-30 font-sans font-semibold p-2">
            Total: ${areaChartStats.resultrevenueData?.reduce((sum, r) => sum + r.totalRevenue, 0)} 
          </span>)</span>
          
          
          <ResponsiveContainer height={250} className="w-full my-4">
            <AreaChart data={areaChartStats.resultrevenueData}>
              <defs>
                <linearGradient id="revenueColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="totalRevenue" 
                stroke="#3b82f6" 
                fillOpacity={1} 
                fill="url(#revenueColor)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>


        {/* Pie Chats  */}
        <div className=" bg-indigo-100 p-4 border my-6 rounded-xl">
          <div className="flex xl:flex-row  xl:flex-nowrap flex-wrap justify-between gap-4">
            <ChartCard title="Product Status Distribution" data={pieChartStats?.productStatusChart} />
            <ChartCard title="Paid Products by SubCategory" data={pieChartStats?.paidSubCategoryChart} />
            <ChartCard title="Order Status Distribution" data={pieChartStats?.orderStatusChart} />
            <ChartCard title="Top 5 Most Sold Brands" data={pieChartStats?.topBrandChart} />
          </div>
        </div>


        {/* Tables */}
        <div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-0 gap-y-4 lg:gap-x-4 xl:gap-y-0 ">
          {/* 1-Recent Orders */}
          <div className="lg:col-span-2 col-span-1 w-full border bg-primary p-6 shadow rounded-xl overflow-auto  ">
            <h3 className="flex gap-x-2 items-center mb-4 font-semibold">
              <img src={orderIcon} alt="recentOrdersIcon" className="w-7 h-7 items-center" />
              Recent Orders
            </h3>
            <table className="min-w-full text-left text-sm">
              <thead className="border-b font-medium">
                <tr>
                  <th className="px-4 py-2">#</th>
                  <th className="px-4 py-2">Customer</th>
                  <th className="px-4 py-2">Amount</th>
                  <th className="px-4 py-2">Paid</th>
                  <th className="px-4 py-2 text-center">Status</th>
                  <th className="px-4 py-2  text-center">Action </th>
                </tr>
              </thead>
              <tbody>
                {tableStats?.recentOrders?.map((order, index) => (
                  <tr key={order._id} className="border-b hover:bg-slate-200 transform duration-200">
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2 font-serif text-gray-800" >{order.address?.firstName} {order.address?.lastName} </td>
                    <td className="px-4 py-2 text-red-500   font-medium">${order.amount.toFixed(2)}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1  w-max flex text-center rounded text-white text-xs ${
                          order?.payment ? "bg-blue-500" : "bg-red-500"
                        }`}
                      >
                        {order?.payment ? "Paid" : "Not Paid"}
                      </span>
                    </td>
                    <td className="p-2 w-48 text-left">
                      <div className="flex p-2 justify-start text-left">
                        <div 
                          className={`flexBetween gap-x-3 items-start text-sm ${
                            order.status === "Out for Delivery" ? "text-blue-400" :
                            order.status === "Delivered" ? "text-green-500" :
                            order.status === "Product Loading" ? "text-orange-500" : "text-gray-500"
                          }`}
                        >
                          <div >
                            {order.status === "Out for Delivery" && ( 
                              <FaTruck className="text-blue-400" />)
                            }
                            {order.status === "Delivered" && ( 
                              <FaCheck className="text-green-500" />
                            )}
                            {order.status === "Product Loading" && ( 
                              <Spin indicator={<LoadingOutlined className='text-orange-500' spin/>} size="default" />
                            )}
                          </div>
                          <b className="text-[12px]">{order.status}</b>
                        </div>
                      </div>
                    </td>
                  <td className="p-2 flex items-center justify-center">
                    <button
                      title={"View Order "+ order._id}
                      onClick={() =>{
                                      navigate(`/Orders/${order._id}`);
                                      setActiveButton('/Orders');
                                    }
                              }
                      className="rounded-full h-min text-blue-500 animation-btns hover:!text-blue-900 hover:!bg-gray-300 hover:!border-blue-900"
                    >
                      <ArrowRightOutlined className="text-xl p-1" />
                    </button>
                  </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* 2-New Customers */}
          <div className="xl:col-span-1 col-span-2 border bg-neutral-50 p-6 shadow rounded-xl overflow-auto ">
            <h3 className="flex gap-x-2 items-center mb-4 font-semibold">
              <img src={CustomerIcon2} alt="newCustomersIcon" className="w-7 h-7 items-center" />
              New Customers
            </h3>
            <table className="min-w-full text-left text-sm ">
              <tbody className="text-gray-700">
                {tableStats?.recentCustomers?.map((user) => (
                  <tr 
                    key={user._id}
                    className=" flex flex-row border-b   hover:bg-slate-200 transform duration-200" 
                    
                    >
                      <td className="p-2 flex justify-center items-center">
                          {user?.profileImage ? (
                                <div className="flex justify-center items-center">
                                    <img
                                      src={user?.profileImage}
                                      alt="Profile"
                                      className="w-9 h-9  rounded-full object-cover mt-1  border-black border"
                                    />
                                    </div>
                                  ) : (
                
                                  <FaCircleUser className="text-3xl  mt-1" />
                                  )}
                      </td>
                      <td className="p-2  flex flex-col items-start w-full gap-x-4">
                        <span className="text-sm font-serif "> {user.name} {user?.prename}</span>
                        <span className="text-sm font-serif ">{user.email}</span>
                          <p className="font-sans text-xs">Join Date: {dayjs(user.createdAt).fromNow()}</p>
                        <p className="font-sans text-xs py-1">
                            status :   
                              <span className={`px-1 ${user.ban ? "text-red-500" : "text-green-500"}`}>
                                {user.ban ? "Banned" : "Active" }
                            </span>
                        </p>
                       
                                  
                      </td>
                      <td className="p-2 flex items-center justify-center">
                        <button
                          title={"View Customer "+ user.name}
                          className="rounded-full h-min text-blue-500 animation-btns hover:!text-blue-900 hover:!bg-gray-300 hover:!border-blue-900"
                          onClick={() =>{
                                          navigate(`/ManageUsers/${user._id}`);
                                          setActiveButton('/ManageUsers');
                                  }}                        
                        >
                          <ArrowRightOutlined className="text-xl p-1" />
                        </button>
                      </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 h-full gap-4 my-4">
          {/* 3-Top Selling Products */}
          <div className="border bg-gray-100  p-6 shadow rounded-xl overflow-auto">
            <h3 className="flex items-center  mb-4 font-semibold">
              <img src={topIcon} alt="topIcon" className="w-10 h-10 items-center"></img>
              Top Selling Products</h3>
            <table className="min-w-full text-left text-sm ">
            <thead className="border-b font-medium">
                <tr>
                  <th className="px-4 py-2 text-left ">#</th>
                  <th className="px-4 py-2 text-left ">Image</th>
                  <th className="px-4 py-2 text-left ">Name</th>
                  <th className="px-4 py-2 text-left ">Price</th>
                  <th className="px-4 py-2 text-left ">Total Sold</th>
                  <th className="py-2 text-center ">Action</th>
                </tr>
              </thead>
              <tbody className=" divide-y divide-gray-200">
                {tableStats.topSellingItems.map((item, index) => (
                    <tr key={item._id} className="  border-b hover:bg-slate-200 transform duration-200">

                    <td className="p-4 items-center ">{index + 1}</td>
                    <td className="p-4 items-center ">
                      <img src={item.images?.[0]} alt="img" className="w-10 h-10 object-cover rounded" />
                    </td>
                    <td className="p-4 items-center text-gray-50 ">{item.name}</td>
                    <td className="p-4 items-center text-red-500   font-medium ">{item.price}$</td>
                    <td className="p-4 text-center  text-green-500 font-medium ">{item.totalSold}</td>
                    <td className="p-4 items-center justify-center">
                        <button
                          title={"View product "+ item._id}
                          className="rounded-full h-min text-blue-500 animation-btns hover:!text-blue-900 hover:!bg-gray-300 hover:!border-blue-900"
                          onClick={() =>{
                                          navigate(`/listProducts/${item._id}`);
                                          setActiveButton('/listProducts');
                                  }}     
                        >
                          <ArrowRightOutlined className="text-xl p-1" />
                        </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* 4-Top Favorite Products */}
          <div className="border bg-slate-100 p-6 shadow rounded-xl overflow-auto">
            <h3 className="flex gap-x-2 items-center   mb-4 font-semibold">
              <img src={favoriteIcon} alt="topIcon" className="w-8 h-8 items-center"></img>
              Top Favorite Products
              </h3>
              <table className="min-w-full text-left text-sm ">
                <thead className="border-b font-medium">
                  <tr>
                    <th className="px-4 py-2 ">#</th>
                    <th className="px-4 py-2 ">Image</th>
                    <th className="px-4 py-2 ">Name</th>
                    <th className="px-4 py-2 ">Price</th>
                    <th className="px-4 py-2 ">Favorite Count</th>
                    <th className="px-4 py-2 text-center ">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tableStats?.topFavoriteProducts?.map((product, index) => (
                    <tr key={product._id} className="border-b hover:bg-slate-200 transform duration-200">
                      <td className="px-4 py-2 items-center">{index + 1}</td>
                      <td className="px-4 py-2 items-center">
                        <img src={product.images[0]} alt={product.name} className="w-10 h-10 object-cover rounded" />
                      </td>
                    <td className="p-4 items-center text-gray-50 ">{product.name}</td>
                    <td className="p-4 items-center text-red-500   font-medium  ">{product.price}$</td>
                    <td className="p-4 text-center  text-green-500 font-medium">{product.favoriteCount}</td>
                      <td className="p-4 items-center justify-center">
                        <button
                          title={"View product "+ product._id}
                          className="rounded-full h-min text-blue-500 animation-btns hover:!text-blue-900 hover:!bg-gray-300 hover:!border-blue-900"
                          onClick={() =>{
                                          navigate(`/listProducts/${product._id}`);
                                          setActiveButton('/listProducts');
                                  }}                          
                            >
                          <ArrowRightOutlined className="text-xl p-1" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
          </div>
          </div>
        </div>
    
    </div>
  );
};

export default Dashboard;
