import React, { useEffect, useState } from "react";
import axios from "axios";
import apiBaseUrl from "../config/api";
import { Table, Input, Button, Tag, Space, Select, Tooltip, Popconfirm } from "antd";
import { IoIosCheckmarkCircleOutline, IoIosCloseCircleOutline } from "react-icons/io";
import { LiaBanSolid } from "react-icons/lia";
import { MdAlignHorizontalLeft } from "react-icons/md";
import { IoFilterSharp } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";
import { toast } from 'react-toastify';
import { useNavigate, useParams } from "react-router-dom";
const { Search } = Input;
const { Option } = Select;

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [banFilter, setBanFilter] = useState("");
  const navigate =useNavigate();

  // take id from Url 
  const { id } = useParams();


  const getAllUsers = async () => {
    try {
      const { data } = await axios.get(`${apiBaseUrl}/api/user/getallusers`);
      setUsers(data.users||[]);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  
  // First: separate states for fetched base and filtered
  const [fetched, setFetched] = useState([]);
  
  // Step 1: Fetch/filter by param (like `id`) once
  useEffect(() => {
    let result = [...users];
  
    // filter by id in URL params
    if (id) {
      result = result.filter((u) => {
        const match = u._id === id;
        if (match) setSearchTerm(u?.name); // optional autofill
        console.log(match ,searchTerm)
        return match;
      });
    }
    
  setFetched(result); // Save base result
}, [users, id]);
  
// Step 2: Refine filters from search(name/lastname/email) ,ban .

  useEffect(() => {
    let result = [...fetched];

      if (searchTerm) {
        result = result.filter(
          (user) =>
            user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.lastname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (banFilter === "banned") {
        result = result.filter((user) => user.ban === true);
      } else if (banFilter === "notBanned") {
        result = result.filter((user) => user.ban === false);
      }

    setFilteredUsers(result);
  }, [searchTerm, banFilter, fetched]);

  const handleBanToggle = async (userId, currentStatus) => {
    const url = currentStatus ? "/api/user/unbanUser" : "/api/user/banUser";
    try {
      await axios.put(url, { userId });
      getAllUsers(); // Refresh
      {currentStatus ?  toast.success("User has been successfully banned."):  toast.success("User has been successfully unbaned.")}
    } catch (err) {
      console.error("Error banning/unbanning:", err);
      toast.error("something wrong try again !")
    }
  };

  
  const handleSearch = (value) => {
    setSearchTerm(value);
  };


  const columns = [
    {
      title: "#",
      dataIndex: "index",
      render: (_, __, i) => i + 1,
    },
    {
      title: "Name ",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Status",
      dataIndex: "ban",
      render: (ban) =>
        <Tag color={ban ? "red" : "green"} className=" p-1 px-2">
          {ban ? "Banned" : "Active"}
        </Tag>
    },
    {
      title: "Action",
      render: (_, user) => (
        <Popconfirm 
          disabled={user.ban}
          title="Are you sure to ban  this "
          onConfirm={() => handleBanToggle(user._id, user.ban)}
          >
          <Button
            type={"primary"}
            onClick={user.ban && (()=> handleBanToggle(user._id, user.ban))}
            className={`!px-2   gap-x-1 animation-btns ${user.ban ? '!bg-green-400 hover:!bg-green-400/50':'!bg-red-500 hover:!bg-red-500/50'}` }
            >
              {user.ban ?  <IoIosCheckmarkCircleOutline className="text-xl " />:<LiaBanSolid className="text-lg "/>}
              {user.ban ? "Unban" : "Ban"}
            </Button>
            </Popconfirm>
      ),
    },
  ];

  return (
    <div className="px-12 pt-12">
      <h2 className="text-2xl font-bold mb-4">Manage Users</h2>

      <div className='flex flex-row gap-4 pt-2  pb-6'>
        <Search
          placeholder="Search by name, lastname, email"
          prefix={<FaSearch className=" text-gray-400   mr-1"/>}
          enterButton="Search"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          suffix={
                    searchTerm && (
                        <button
                            title="Clear search bar"
                            onClick={() => {
                              setSearchTerm("");
                              setBanFilter("");      // optional: reset filter
                              navigate("/ManageUsers"); // clear route param
                            }}
                            className="text-red-500 text-xl cursor-pointer hover:!scale-125  animation-btn rounded-full  hover:bg-gray-50/10"
                          >    
                            <IoIosCloseCircleOutline className="text-lg"/>
                        </button>
                    )}
          className="w-full "
/>
        <Select
          prefix={!banFilter && <IoFilterSharp className=" text-gray-500 text-xl  mr-1"/>}
          allowClear
          placeholder="filter by status"
          onChange={(value) => {
            setBanFilter(value);
          }}
          className="min-w-48 !ring-1 rounded-md hover:!ring-transparent hover:!duration-300 !ring-black "
        >
        <Option value="all" > 
            <div className='flex items-center gap-2  text-gray-500'>
              <MdAlignHorizontalLeft  className="  text-xl  mr-1" />
              All
            </div>
         </Option>
          <Option value="banned" > 
            <div className='flex items-center gap-2 '>
              <LiaBanSolid  className=" text-red-500 text-xl  mr-1" />
               Banned
            </div>
         </Option>
         <Option value="Active"> 
            <div className='flex items-center gap-2'>
              <IoIosCheckmarkCircleOutline    className=" text-green-500 text-xl  mr-1" />
              Active
            </div>
         </Option>
        </Select>
      </div>
      <div >
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={filteredUsers}
          pagination={{ pageSize: 6 }}
          className="!overflow-x-auto"
        />
    </div>
    </div>
  );
};

export default ManageUsers;
