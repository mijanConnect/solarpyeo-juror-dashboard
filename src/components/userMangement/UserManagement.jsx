import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Select,
  Modal,
  Input,
  message,
  Tag,
  Space,
} from "antd";

const { Option } = Select;

// Add New User Modal Component
const AddUserModal = ({ visible, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: ''
  });

  const handleSave = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.role) {
      message.error("Please fill in all required fields");
      return;
    }
    
    onSave(formData);
    setFormData({ name: '', email: '', password: '', role: '' });
    message.success("User added successfully!");
    onClose();
  };

  const handleCancel = () => {
    setFormData({ name: '', email: '', password: '', role: '' });
    onClose();
  };

  return (
    <Modal
      title="Add New User"
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={500}
      centered
    >
      <div className="mt-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">User Name</label>
          <Input
            placeholder="Enter User name"
            size="large"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email*</label>
          <Input
            placeholder="Enter User email"
            size="large"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <Input.Password
            placeholder="Enter Password"
            size="large"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Assign Role*</label>
          <Select
            placeholder="Assign Role"
            size="large"
            className="w-full"
            value={formData.role}
            onChange={(value) => setFormData({ ...formData, role: value })}
          >
            <Option value="admin">Admin</Option>
            <Option value="user">User</Option>
            <Option value="moderator">Moderator</Option>
          </Select>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <Button
            size="large"
            onClick={handleCancel}
            className="px-8"
          >
            Cancel
          </Button>
          <Button
            type="primary"
            size="large"
            onClick={handleSave}
            className="bg-red-500 hover:bg-red-600 border-red-500 hover:border-red-600 px-8"
          >
            Save
          </Button>
        </div>
      </div>
    </Modal>
  );
};

// User Details Modal Component
const UserDetailsModal = ({ visible, onClose, user }) => {
  return (
    <Modal
      title="User Details"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
      centered
    >
      {user && (
        <div className="space-y-4 mt-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-gray-600 text-sm">User Name:</label>
              <p className="font-medium">{user.name}</p>
            </div>
            <div>
              <label className="text-gray-600 text-sm">Email:</label>
              <p className="font-medium">{user.email}</p>
            </div>
            <div>
              <label className="text-gray-600 text-sm">Phone:</label>
              <p className="font-medium">{user.phone}</p>
            </div>
            <div>
              <label className="text-gray-600 text-sm">Submissions:</label>
              <p className="font-medium">{user.submission}</p>
            </div>
            <div>
              <label className="text-gray-600 text-sm">Investment:</label>
              <p className="font-medium text-blue-600">{user.invest}</p>
            </div>
            <div>
              <label className="text-gray-600 text-sm">Status:</label>
              <Tag color="green" className="mt-1">{user.status}</Tag>
            </div>
          </div>
          <div>
            <label className="text-gray-600 text-sm">Address:</label>
            <p className="font-medium">{user.address}</p>
          </div>
          
          <div className="flex justify-end mt-8">
            <Button
              size="large"
              onClick={onClose}
              className="px-8"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

// Main User Management Component
const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All User");
  const [loading, setLoading] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = () => {
    setLoading(true);

    const names = [
      "Dr. John Doe", "Sarah Johnson", "Michael Brown", "Emily Davis", 
      "David Wilson", "Jessica Miller", "Robert Garcia", "Ashley Martinez"
    ];

    const mockUsers = Array(8)
      .fill()
      .map((_, index) => ({
        id: index + 1,
        name: names[index] || "Dr. John Doe",
        email: "example@email.com",
        phone: `+1 ${Math.floor(100000000 + Math.random() * 900000000)}`,
        address: `${index + 100} Main Street, City ${index % 10}, Country`,
        submission: 5,
        invest: "$50.00",
        status: "Active",
        isBlocked: false,
      }));

    setUsers(mockUsers);
    setPagination({
      ...pagination,
      total: mockUsers.length,
    });
    setLoading(false);
  };

  const handleAddUser = (userData) => {
    const newUser = {
      id: users.length + 1,
      name: userData.name,
      email: userData.email,
      phone: `+1 ${Math.floor(100000000 + Math.random() * 900000000)}`,
      address: "New Address",
      submission: 0,
      invest: "$0.00",
      status: "Active",
      isBlocked: false,
    };
    
    setUsers([...users, newUser]);
    setAddModalVisible(false);
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setDetailsModalVisible(true);
  };

  const handleTurnOff = (userId) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === "Active" ? "Inactive" : "Active" }
        : user
    ));
    message.success("User status updated successfully");
  };

  const columns = [
    {
      title: "SL",
      dataIndex: "id",
      key: "id",
      width: 60,
      align: "center",
      render: (text, record, index) => {
        return (pagination.current - 1) * pagination.pageSize + index + 1;
      },
    },
    {
      title: "User Name",
      dataIndex: "name",
      key: "name",
      align: "left",
      render: (name) => (
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ 
            width: "32px", 
            height: "32px", 
            backgroundColor: "#f0f0f0", 
            borderRadius: "50%", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center" 
          }}>
            👤
          </div>
          <span style={{ fontWeight: "500" }}>{name}</span>
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      align: "center",
    },
    {
      title: "Submission",
      dataIndex: "submission",
      key: "submission",
      align: "center",
    },
    {
      title: "Invest",
      dataIndex: "invest",
      key: "invest",
      align: "center",
      render: (invest) => (
        <span style={{ fontWeight: "500" }}>{invest}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status) => (
        <Tag color={status === "Active" ? "green" : "red"} style={{ padding: "4px 12px" }}>
          {status}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <Space size="small">
          <Button
            size="small"
            onClick={() => handleViewDetails(record)}
            style={{ 
              borderColor: "#d9d9d9", 
              color: "#666",
              fontSize: "12px"
            }}
          >
            View Details
          </Button>
          <Button
            size="small"
            danger
            onClick={() => handleTurnOff(record.id)}
            style={{ 
              backgroundColor: "#ff4d4f", 
              borderColor: "#ff4d4f",
              color: "white",
              fontSize: "12px"
            }}
          >
            Turn Off
          </Button>
        </Space>
      ),
    },
  ];

  const getFilteredUsers = () => {
    if (statusFilter === "All User") {
      return users;
    }
    return users.filter(user => user.status === statusFilter);
  };

  return (
    <div style={{ 
      width: "100%", 
      padding: "24px", 
      backgroundColor: "#f5f5f5", 
      minHeight: "100vh" 
    }}>
      {/* Header */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginBottom: "24px" 
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: "200px" }}
            size="large"
          >
            <Option value="All User"> All User</Option>
            <Option value="Active">Active </Option>
            <Option value="Inactive">Inactive </Option>
          </Select>
        </div>
        
        <Button 
          type="primary" 
          size="large"
          onClick={() => setAddModalVisible(true)}
          style={{ 
            backgroundColor: "#B91C1C", 
            borderColor: "primary",
            padding: "0 32px",
            borderRadius: "6px"
          }}
        >
          Add New User
        </Button>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <Table
          columns={columns}
          dataSource={getFilteredUsers()}
          rowKey="id"
          pagination={{
            ...pagination,
            size: "default",
            // showSizeChanger: false,
            // showQuickJumper: true,
            // showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          }}
          loading={loading}
          size="large"
          scroll={{ x: "max-content" }}
          // style={{ borderRadius: "8px" }}
          className="custom-table"
  //  scroll={{ x: 'max-content' }}
        />
      </div>

      {/* Modals */}
      <AddUserModal
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
        onSave={handleAddUser}
      />

      <UserDetailsModal
        visible={detailsModalVisible}
        onClose={() => setDetailsModalVisible(false)}
        user={selectedUser}
      />
    </div>
  );
};

export default UserManagement;