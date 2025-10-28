import React, { useState } from "react";
import { Table, DatePicker, Select, Card, Row, Col, Statistic, Tag } from "antd";
import { DollarOutlined, TrophyOutlined, UserOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import moment from "moment";

const { Option } = Select;
const { RangePicker } = DatePicker;

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

const TotalEarnings = () => {
  const [dateRange, setDateRange] = useState("February 2025");
  const [data] = useState([
    {
      id: 1,
      initiatorName: "Dr. John Doe",
      email: "example@email.com",
      respondentName: "Dr. John Doe",
      caseType: "Standard Case",
      moderatorName: "Dr. John Doe",
      jurorVote: "3 of 3",
      revenue: "$10.00",
      status: "Running",
    },
    {
      id: 2,
      initiatorName: "Dr. John Doe",
      email: "example@email.com",
      respondentName: "Dr. John Doe",
      caseType: "Standard Case",
      moderatorName: "Dr. John Doe",
      jurorVote: "3 of 3",
      revenue: "$10.00",
      status: "Running",
    },
    {
      id: 3,
      initiatorName: "Dr. John Doe",
      email: "example@email.com",
      respondentName: "Dr. John Doe",
      caseType: "Standard Case",
      moderatorName: "Dr. John Doe",
      jurorVote: "3 of 3",
      revenue: "$10.00",
      status: "Running",
    },
    {
      id: 4,
      initiatorName: "Dr. John Doe",
      email: "example@email.com",
      respondentName: "Dr. John Doe",
      caseType: "Standard Case",
      moderatorName: "Dr. John Doe",
      jurorVote: "3 of 3",
      revenue: "$10.00",
      status: "Running",
    },
    {
      id: 5,
      initiatorName: "Dr. John Doe",
      email: "example@email.com",
      respondentName: "Dr. John Doe",
      caseType: "Standard Case",
      moderatorName: "Dr. John Doe",
      jurorVote: "3 of 3",
      revenue: "$10.00",
      status: "Running",
    },
    {
      id: 6,
      initiatorName: "Dr. John Doe",
      email: "example@email.com",
      respondentName: "Dr. John Doe",
      caseType: "Standard Case",
      moderatorName: "Dr. John Doe",
      jurorVote: "3 of 3",
      revenue: "$10.00",
      status: "Running",
    },
    {
      id: 7,
      initiatorName: "Dr. John Doe",
      email: "example@email.com",
      respondentName: "Dr. John Doe",
      caseType: "Standard Case",
      moderatorName: "Dr. John Doe",
      jurorVote: "3 of 3",
      revenue: "$10.00",
      status: "Running",
    },
    {
      id: 8,
      initiatorName: "Dr. John Doe",
      email: "example@email.com",
      respondentName: "Dr. John Doe",
      caseType: "Standard Case",
      moderatorName: "Dr. John Doe",
      jurorVote: "3 of 3",
      revenue: "$10.00",
      status: "Running",
    },
  ]);

  // Calculate total revenue
  const totalRevenue = data.reduce((sum, item) => {
    const amount = parseFloat(item.revenue.replace('$', ''));
    return sum + amount;
  }, 0);

  const columns = [
    {
      title: "SL",
      dataIndex: "id",
      key: "id",
      align: "center",
      width: 60,
    },
    {
      title: "Initiator Name",
      dataIndex: "initiatorName",
      key: "initiatorName",
      align: "center",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      align: "center",
    },
    {
      title: "Respondent Name",
      dataIndex: "respondentName",
      key: "respondentName",
      align: "center",
    },
    {
      title: "Case Type",
      dataIndex: "caseType",
      key: "caseType",
      align: "center",
    },
    {
      title: "Moderator Name",
      dataIndex: "moderatorName",
      key: "moderatorName",
      align: "center",
    },
    {
      title: "Juror Vote",
      dataIndex: "jurorVote",
      key: "jurorVote",
      align: "center",
    },
    {
      title: "Revenue",
      dataIndex: "revenue",
      key: "revenue",
      align: "center",
      render: (revenue) => (
        <span style={{ fontWeight: "bold", color: "#1890ff" }}>{revenue}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status) => (
        <Tag color={status === "Running" ? "green" : "blue"}>{status}</Tag>
      ),
    },
  ];

  return (
    <div className="">
      {/* Header */}
      <div className="">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Total Earnings</h1>
        <p className="text-gray-600">Track and monitor your revenue and earnings</p>
      </div>

      {/* Statistics Cards */}
      {/* <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={totalRevenue}
              precision={2}
              valueStyle={{ color: '#3f8600' }}
              prefix={<DollarOutlined />}
              suffix="USD"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Cases"
              value={data.length}
              valueStyle={{ color: '#1890ff' }}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Active Cases"
              value={data.filter(item => item.status === "Running").length}
              valueStyle={{ color: '#52c41a' }}
              prefix={<TrophyOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Average Revenue"
              value={totalRevenue / data.length}
              precision={2}
              valueStyle={{ color: '#722ed1' }}
              prefix={<UserOutlined />}
              suffix="USD"
            />
          </Card>
        </Col>
      </Row> */}

      {/* Date Range Filter */}
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          {/* <span className="text-sm font-medium">Date Range:</span> */}
          <Select
            value={dateRange}
            onChange={setDateRange}
            style={{ width: 150 }}
          >
            <Option value="February 2025">February 2025</Option>
            <Option value="January 2025">January 2025</Option>
            <Option value="December 2024">December 2024</Option>
            <Option value="November 2024">November 2024</Option>
          </Select>
        </div>
        <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
          <span className="text-sm text-blue-600 font-medium">Total Revenue: </span>
          <span className="text-lg font-bold text-blue-700">${totalRevenue.toFixed(2)}</span>
        </div>
      </div>

      {/* Earnings Table */}
      <div style={{ overflowX: 'auto' }}>
        <Table
          components={components}
          columns={columns}
          dataSource={data}
          rowKey="id"
          pagination={{
            pageSize: 10,
            // showSizeChanger: true,
            // showQuickJumper: true,
            // showTotal: (total, range) =>
            //   `${range[0]}-${range[1]} of ${total} items`,
          }}
          scroll={{ x: 'max-content' }}
          // rowSelection={{
          //   type: 'checkbox',
          //   onChange: (selectedRowKeys, selectedRows) => {
          //     console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
          //   },
          // }}
          className="custom-table"

        />
      </div>
  
    </div>
  );
};

export default TotalEarnings;