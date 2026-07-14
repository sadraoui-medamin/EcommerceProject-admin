// src/components/ManageAdmins.jsx
import React, { useState, useEffect } from 'react';
import { Button, Popconfirm, Input, Select, Tooltip, Table } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import apiBaseUrl from "../config/api";
import EditAdminModal from '../components/Admins/EditAdminModal';
import CreateAdminModal from '../components/Admins/CreateAdminModal';
import { MdWork } from 'react-icons/md';
import { RiEditBoxLine, RiUserLine } from 'react-icons/ri';
import { FaTrash, FaUserTie } from 'react-icons/fa6';
import { FaEdit, FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { BsFilterLeft } from 'react-icons/bs';

const { Search } = Input;
const { Option } = Select;

const ManageAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [filteredAdmins, setFilteredAdmins] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  const fetchAdmins = async () => {
    try {
      const res = await axios.get('/api/admins/list');
      setAdmins(res.data);
      setFilteredAdmins(res.data);
    } catch (err) {
      console.error('Error fetching admins:', err);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleSearch = (value) => {
    setSearchText(value);
    filterAdmins(value, roleFilter);
  };

  const handleRoleFilter = (value) => {
    setRoleFilter(value);
    filterAdmins(searchText, value);
  };

  const filterAdmins = (search, role) => {
    let filtered = admins;

    if (search) {
      filtered = filtered.filter(
        (admin) =>
          admin.name?.toLowerCase().includes(search.toLowerCase()) ||
          admin.lastname?.toLowerCase().includes(search.toLowerCase()) ||
          admin.email?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (role && role!='all') {
      filtered = filtered.filter((admin) => admin.role === role);
    }

    setFilteredAdmins(filtered);
  };

  const handleDeleteAdmin = async (id) => {
    try {
      await axios.delete(`${apiBaseUrl}/api/admins/delete/${id}`);
      toast.success("Deleted successfully!");
      fetchAdmins();
    } catch (err) {
      console.error('Error deleting admin:', err);
    }
  };

  const openEditModal = (admin) => {
    setSelectedAdmin(admin);
    setEditModalOpen(true);
  };

  const columns = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => <span className='font-serif'>{record.name} {record.lastName || ''}</span>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (email) => <span className='font-mono font-medium text-blue-900'>{email}</span>,

    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone) => <span className='font-medium text-green-700'>{phone}</span>,

    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => {
        const colorClass = role === 'master' 
          ? 'text-red-800' 
          : role === 'admin' 
            ? 'text-blue-600' 
            : 'text-red-600';

        return (
          <span className={`${colorClass} font-mono font-extrabold`}>
            {role?.charAt(0).toUpperCase() + role?.slice(1)}
          </span>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div className="flex gap-2">
          <Tooltip title={"Edit "+record.role} color="#061178">
            <Button
              onClick={() => openEditModal(record)}
              type="primary"
              className='px-2 py-1'
            >
              <RiEditBoxLine className='text-lg '/>
            </Button>
          </Tooltip>
          <Popconfirm
            title="Are you sure you want to delete this admin?"
            onConfirm={() => handleDeleteAdmin(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title={"Delete "+record.role} color="#820014">
              <Button
                danger
                className='px-2 py-1'
              >
                <FaTrash ></FaTrash>
              </Button>
            </Tooltip>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="px-12 pt-12">
      <h1 className="text-2xl font-bold mb-4">Manage Admin</h1>

      {/* Search & Filter */}
      <div className="flex flex-row gap-4 pt-2 pb-6">
        <Search
          placeholder="Search by name or email"
          enterButton="Search"
          prefix={<FaSearch className="text-gray-400 mr-1" />}
          value={searchText}
          onSearch={handleSearch}
          onChange={(e) => handleSearch(e.target.value)}
          allowClear
          className="w-full"
        />

        <Select
          placeholder="Filter by Role"
          prefix={!roleFilter && <MdWork  className=" text-gray-500 text-lg mr-1 " />}
          allowClear
          onChange={handleRoleFilter}
          className="w-full max-w-44 !ring-1 rounded-md hover:!ring-transparent hover:!duration-300 !ring-black "
        >
          <Option value="all">
            <span className="flex items-center gap-x-2 font-medium text-gray-700">
              <BsFilterLeft  className="text-xl"  />
              All
            </span>
          </Option>
          <Option value="master">
            <div className="flex items-center gap-2">
              <FaUserTie className="text-gray-700" /> Master
            </div>
          </Option>
          <Option value="admin">
            <div className="flex items-center gap-2">
              <RiUserLine className="text-gray-500" /> Admin
            </div>
          </Option>
        </Select>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setCreateModalOpen(true)}
        >
          Create New Admin
        </Button>
      </div>

      {/* Ant Design Table */}
      <Table
        dataSource={filteredAdmins}
        columns={columns}
        rowKey="_id"
        pagination={{ pageSize: 6 }}
      />

      {/* Create Admin Modal */}
      {createModalOpen && (
        <CreateAdminModal
          open={createModalOpen}
          onClose={() => {
            setCreateModalOpen(false);
            fetchAdmins();
          }}
        />
      )}

      {/* Edit Admin Modal */}
      {editModalOpen && selectedAdmin && (
        <EditAdminModal
          open={editModalOpen}
          adminData={selectedAdmin}
          onClose={() => {
            setEditModalOpen(false);
            fetchAdmins();
          }}
        />
      )}
    </div>
  );
};

export default ManageAdmins;
