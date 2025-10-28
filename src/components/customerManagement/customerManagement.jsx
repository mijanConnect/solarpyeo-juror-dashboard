import React, { useState } from "react";
import { Table, Button, Modal, Form, Input, Tooltip, Switch } from "antd";
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { IoEyeSharp } from "react-icons/io5";
import Swal from "sweetalert2";
import MarchantIcon from "../../assets/marchant.png";
import { Rate } from "antd";

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

const CustomerManagement = () => {
  const [data, setData] = useState([
    {
      id: 1,
      name: "Alice Johnson",
      image: "https://i.ibb.co/8gh3mqPR/Ellipse-48-1.jpg",
      email: "example@email.com",
      retailer: 5,
      sales: "$300",
      status: "Active",
      phone: "+1234567890",
      location: "New York",
      businessName: "Alice's Store",
      feedback: 5,
    },
    {
      id: 2,
      name: "John Doe",
      image: "https://i.ibb.co/8gh3mqPR/Ellipse-48-1.jpg",
      email: "john@email.com",
      retailer: 3,
      sales: "$500",
      status: "Inactive",
      phone: "+9876543210",
      location: "California",
      businessName: "John's Shop",
      feedback: 4,
    },
    {
      id: 3,
      name: "Sam Smith",
      image: "https://i.ibb.co/8gh3mqPR/Ellipse-48-1.jpg",
      email: "sam@email.com",
      retailer: 3,
      sales: "$500",
      status: "Active",
      phone: "+9876543210",
      location: "California",
      businessName: "Sam's Shop",
      feedback: 3,
    },
  ]);

  const [searchText, setSearchText] = useState(""); // Search text state
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isFeedbackModalVisible, setIsFeedbackModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const navigate = useNavigate();

  // Show view details modal
  const showViewModal = (record) => {
    setSelectedRecord(record);
    setIsViewModalVisible(true);
  };

  // Show feedback modal
  const showFeedbackModal = (record) => {
    setSelectedRecord(record);
    setIsFeedbackModalVisible(true);
  };

  // Close view modal
  const handleCloseViewModal = () => {
    setIsViewModalVisible(false);
    setSelectedRecord(null);
  };

  // Close feedback modal
  const handleCloseFeedbackModal = () => {
    setIsFeedbackModalVisible(false);
    setSelectedRecord(null);
  };

  // Columns for loyalty points / orders
  const columns2 = [
    {
      title: "SL",
      dataIndex: "orderId",
      key: "orderId",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Reward",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Points Used",
      dataIndex: "amount",
      key: "amount",
    },
  ];

  // Columns for feedback table
  const columnsFeedback = [
    { title: "Product Name", dataIndex: "product", key: "product" },
    { title: "Rating", dataIndex: "rating", key: "rating" },
    { title: "Feedback", dataIndex: "feedback", key: "feedback" },
    { title: "Date", dataIndex: "date", key: "date" },
  ];

  // Main table columns
  const columns = [
    { title: "SL", dataIndex: "id", key: "id", align: "center" },
    { title: "Customer ID", dataIndex: "id", key: "id", align: "center" },
    { title: "Customer Name", dataIndex: "name", key: "name", align: "center" },
    // {
    //   title: "Business Name",
    //   dataIndex: "businessName",
    //   key: "businessName",
    //   align: "center",
    // },
    {
      title: "Phone Number",
      dataIndex: "phone",
      key: "phone",
      align: "center",
    },
    { title: "Email", dataIndex: "email", key: "email", align: "center" },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      align: "center",
    },
    { title: "Sales Rep", dataIndex: "name", key: "salesRep", align: "center" },
    { title: "Total Sales", dataIndex: "sales", key: "sales", align: "center" },
    { title: "Status", dataIndex: "status", key: "status", align: "center" },
    {
      title: "Ratings",
      dataIndex: "feedback",
      key: "feedback",
      align: "center",
      render: (_, record) => (
        <Tooltip title="Customer Ratings">
          <Rate
            disabled
            value={record.feedback} // assuming rating is a number from 1 to 5
            style={{ fontSize: 16, color: "#FFD700" }} // optional styling
          />
        </Tooltip>
      ),
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) => (
        // <div className=" py-[12px] border border-primary rounded-md">
        <div className="flex- gap-2 ">
          <Tooltip title="View Details">
            <button
              onClick={() => showViewModal(record)}
              className="border border-primary px-4 py-1 rounded bg-[#D7F4DE] mr-5"
            >
              View Details
            </button>
          </Tooltip>
          {/* <Tooltip title="Customer Ratings">
              <Rate
                disabled
                value={record.rating} // assuming rating is a number from 1 to 5
                style={{ fontSize: 16, color: "#FFD700" }} // optional styling
              />
            </Tooltip> */}
        </div>
        // </div>
      ),
    },
  ];

  // Filtered data based on search input
  const filteredData = data.filter((item) => {
    const search = searchText.toLowerCase();
    return (
      item.id.toString().includes(search) ||
      item.name.toLowerCase().includes(search) ||
      item.phone.toLowerCase().includes(search) ||
      item.email.toLowerCase().includes(search)
    );
  });

  return (
    <div>
      <div className="flex justify-between items-end">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 ">
          <div>
            <h1 className="text-[24px] font-bold">Customer Management</h1>
            <p className="text-[16px] font-normal mt-2">
              Seamlessly manage customer profiles and interactions.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-4">
          <Input
            placeholder="Search by Customer ID, Name, Phone or Email"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-96"
          />
        </div>
      </div>

      {/* Customer Table */}
      <div className="">
        <Table
          dataSource={filteredData}
          columns={columns}
          pagination={{ pageSize: 10 }}
          bordered={false}
          size="small"
          rowClassName="custom-row"
          components={components}
          className="custom-table"
        />
      </div>

      {/* View Details Modal */}
      <Modal
        visible={isViewModalVisible}
        onCancel={handleCloseViewModal}
        width={700}
        footer={[]}
      >
        {selectedRecord && (
          <div>
            <div className="flex flex-row justify-between items-start gap-3 mt-8">
              <img
                src={MarchantIcon}
                alt={selectedRecord.name}
                className="w-214 h-214 rounded-full"
              />
              <div className="flex flex-col gap-2 border border-primary rounded-md p-4 w-full">
                <p className="text-[22px] font-bold text-primary">
                  Customer Profile
                </p>
                <p>
                  <strong>Name:</strong> {selectedRecord.name}
                </p>
                {/* <p>
                  <strong>Business Name:</strong> {selectedRecord.businessName}
                </p> */}
                <p>
                  <strong>Email:</strong> {selectedRecord.email}
                </p>
                <p>
                  <strong>Phone:</strong> {selectedRecord.phone}
                </p>
                <p>
                  <strong>Location:</strong> {selectedRecord.location}
                </p>
                <p>
                  <strong>Total Sales:</strong> {selectedRecord.sales}
                </p>
                <p>
                  <strong>Status:</strong> {selectedRecord.status}
                </p>
                <p className="text-[22px] font-bold text-primary">
                  Loyalty Points
                </p>
                <p>
                  <strong>Points Balance:</strong> {selectedRecord.sales}
                </p>
                <p>
                  <strong>Tier:</strong> Gold
                </p>
              </div>
            </div>
            <Table
              columns={columns2}
              dataSource={data}
              rowKey="orderId"
              pagination={{ pageSize: 5 }}
              className="mt-6"
            />
          </div>
        )}
      </Modal>

      {/* Feedback Modal */}
      <Modal
        visible={isFeedbackModalVisible}
        onCancel={handleCloseFeedbackModal}
        width={700}
        footer={[]}
      >
        {selectedRecord && (
          <div>
            <h2 className="text-[22px] font-bold text-primary mb-2">
              Feedback Details
            </h2>
            <p className="text-[16px] font-medium mb-4">
              Customer:{" "}
              <span className="font-semibold">{selectedRecord.name}</span>
            </p>

            <Table
              columns={columnsFeedback}
              dataSource={selectedRecord.feedback}
              rowKey="date"
              pagination={false}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CustomerManagement;
