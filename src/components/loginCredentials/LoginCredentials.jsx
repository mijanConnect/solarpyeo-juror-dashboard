import React, { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Tooltip,
  Switch,
  Select,
} from "antd";
import { FaTrash } from "react-icons/fa";
import { EditOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";

const { Option } = Select;

const components = {
  header: {
    row: (props) => (
      <tr
        {...props}
        style={{
          backgroundColor: "#f0f5f9",
          height: "50px",
          color: "secondary",
          fontSize: "18px",
          textAlign: "center",
          padding: "12px",
        }}
      />
    ),
    cell: (props) => (
      <th
        {...props}
        style={{
          color: "secondary",
          fontWeight: "bold",
          fontSize: "18px",
          textAlign: "center",
          padding: "12px",
        }}
      />
    ),
  },
};

const LoginCredentials = () => {
  const [data, setData] = useState([
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice@email.com",
      password: "123456",
      phone: "+1234567890",
      role: "Admin",
      createdAt: "2025-08-01",
      status: "Active",
    },
    {
      id: 2,
      name: "John Doe",
      email: "john@email.com",
      password: "123456",
      phone: "+9876543210",
      role: "User",
      createdAt: "2025-08-05",
      status: "Inactive",
    },
  ]);

  const [roles, setRoles] = useState(["Admin", "User"]); // Default roles

  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [viewForm] = Form.useForm();

  const [isRoleModalVisible, setIsRoleModalVisible] = useState(false);
  const [roleForm] = Form.useForm();

  const [isUserModalVisible, setIsUserModalVisible] = useState(false);
  const [userForm] = Form.useForm();

  // View/Edit User Modal
  const showViewModal = (record) => {
    setSelectedRecord(record);
    viewForm.setFieldsValue(record);
    setIsViewModalVisible(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalVisible(false);
    setSelectedRecord(null);
  };

  const handleUpdateRecord = () => {
    viewForm.validateFields().then((values) => {
      setData((prev) =>
        prev.map((item) =>
          item.id === selectedRecord.id ? { ...item, ...values } : item
        )
      );
      Swal.fire({
        title: "Updated!",
        text: "User details have been updated successfully.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      setIsViewModalVisible(false);
    });
  };

  // Add Role
  const handleAddRole = () => {
    roleForm.validateFields().then((values) => {
      setRoles((prev) => [...prev, values.roleName]);
      Swal.fire({
        title: "Role Added!",
        text: `Role "${values.roleName}" has been successfully added.`,
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      roleForm.resetFields();
      setIsRoleModalVisible(false);
    });
  };

  // Add New User
  const handleAddUser = () => {
    userForm.validateFields().then((values) => {
      const newUser = {
        id: data.length + 1,
        status: "Active",
        createdAt: new Date().toISOString().split("T")[0],
        ...values,
      };
      setData((prev) => [...prev, newUser]);
      Swal.fire({
        title: "User Added!",
        text: `${values.name} has been added successfully.`,
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      userForm.resetFields();
      setIsUserModalVisible(false);
    });
  };

  const columns = [
    { title: "SL", dataIndex: "id", key: "id", align: "center" },
    { title: "User Name", dataIndex: "name", key: "name", align: "center" },
    { title: "Email", dataIndex: "email", key: "email", align: "center" },
    {
      title: "Password",
      dataIndex: "password",
      key: "password",
      align: "center",
    },
    {
      title: "Phone Number",
      dataIndex: "phone",
      key: "phone",
      align: "center",
    },
    { title: "Role", dataIndex: "role", key: "role", align: "center" },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
    },
    { title: "Status", dataIndex: "status", key: "status", align: "center" },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) => (
        <div
          className="flex gap-0 justify-between align-middle py-[7px] px-[15px] border border-primary rounded-md"
          style={{ alignItems: "center" }}
        >
          <Tooltip title="View & Update Details">
            <button
              onClick={() => showViewModal(record)}
              className="text-primary hover:text-green-700 text-xl"
            >
              <EditOutlined />
            </button>
          </Tooltip>

          <Tooltip title="Delete">
            <button
              onClick={() => {
                Swal.fire({
                  title: "Are you sure?",
                  text: "You won't be able to revert this!",
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonColor: "#3085d6",
                  cancelButtonColor: "#d33",
                  confirmButtonText: "Yes, delete it!",
                }).then((result) => {
                  if (result.isConfirmed) {
                    setData(data.filter((item) => item.id !== record.id));
                    Swal.fire({
                      title: "Deleted!",
                      text: "Your record has been deleted.",
                      icon: "success",
                    });
                  }
                });
              }}
              className="text-red-500 hover:text-red-700 text-md"
            >
              <FaTrash />
            </button>
          </Tooltip>

          <Switch
            size="small"
            checked={record.status === "Active"}
            style={{
              backgroundColor: record.status === "Active" ? "#3fae6a" : "gray",
            }}
            onChange={(checked) => {
              Swal.fire({
                title: "Are you sure?",
                text: `You are about to change status to ${
                  checked ? "Active" : "Inactive"
                }.`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, change it!",
              }).then((result) => {
                if (result.isConfirmed) {
                  setData((prev) =>
                    prev.map((item) =>
                      item.id === record.id
                        ? { ...item, status: checked ? "Active" : "Inactive" }
                        : item
                    )
                  );
                  Swal.fire({
                    title: "Updated!",
                    text: `Status has been changed to ${
                      checked ? "Active" : "Inactive"
                    }.`,
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false,
                  });
                }
              });
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-[24px] font-bold">User Management</h1>
          <p className="text-[16px] font-normal mt-2">
            Access your account securely with your login credentials.
          </p>
        </div>
        <div className="flex gap-5">
          <Button
            type="primary"
            onClick={() => setIsUserModalVisible(true)}
            className="bg-primary !text-white hover:!text-secondary hover:!bg-white hover:!border-primary px-[30px] py-[25px] rounded-full text-[18px] font-bold"
          >
            Add New User
          </Button>
          <Button
            type="primary"
            onClick={() => setIsRoleModalVisible(true)}
            className="bg-primary !text-white hover:!text-secondary hover:!bg-white hover:!border-primary px-[30px] py-[25px] rounded-full text-[18px] font-bold"
          >
            Add New Role
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table
          dataSource={data}
          columns={columns}
          pagination={{ pageSize: 10 }}
          bordered={false}
          size="small"
          rowClassName="custom-row"
          components={components}
          className="custom-table"
          scroll={{ x: 'max-content' }}
        />
      </div>

      {/* View/Edit User Modal */}
      <Modal
        visible={isViewModalVisible}
        onCancel={handleCloseViewModal}
        width={700}
        onOk={handleUpdateRecord}
        okText="Save Changes"
      >
        {selectedRecord && (
          <div className="flex flex-col gap-2 w-full border border-primary rounded-md p-4 mt-8 mb-8">
            <p className="text-[22px] font-bold text-primary">
              User Management
            </p>
            <Form form={viewForm} layout="vertical">
              <Form.Item name="name" label="User Name">
                <Input />
              </Form.Item>
              <Form.Item name="email" label="Email">
                <Input />
              </Form.Item>
              <Form.Item name="password" label="Password">
                <Input />
              </Form.Item>
              <Form.Item name="phone" label="Phone Number">
                <Input />
              </Form.Item>
              <Form.Item name="role" label="Role">
                <Select>
                  {roles.map((role) => (
                    <Option key={role} value={role}>
                      {role}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="status" label="Select Page Access Control">
                <Select>
                  <Option value="Active">Full</Option>
                  <Option value="Inactive">Dashboard</Option>
                </Select>
              </Form.Item>
            </Form>
          </div>
        )}
      </Modal>

      {/* Add New Role Modal */}
      <Modal
        title="Add New Role"
        visible={isRoleModalVisible}
        onCancel={() => setIsRoleModalVisible(false)}
        onOk={handleAddRole}
        okText="Add Role"
      >
        <Form form={roleForm} layout="vertical">
          <Form.Item
            name="roleName"
            label="Role Name"
            rules={[{ required: true, message: "Please enter role name" }]}
          >
            <Input placeholder="Enter role name" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Add New User Modal */}
      <Modal
        title="Add New User"
        visible={isUserModalVisible}
        onCancel={() => setIsUserModalVisible(false)}
        onOk={handleAddUser}
        okText="Add User"
        width={700}
      >
        <Form form={userForm} layout="vertical">
          <Form.Item
            name="name"
            label="User Name"
            rules={[{ required: true, message: "Please enter name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Please enter email" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please enter password" }]}
          >
            <Input type="password" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone Number"
            rules={[{ required: true, message: "Please enter phone number" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: "Please select a role" }]}
          >
            <Select placeholder="Select role">
              {roles.map((role) => (
                <Option key={role} value={role}>
                  {role}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="status" label="Select Page Access Control">
            <Select>
              <Option value="Active">Full</Option>
              <Option value="Inactive">Dashboard</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default LoginCredentials;
