import React, { useState } from "react";
import { Table, Select, Input, Button } from "antd";
import NewSell from "./NewSell";

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

const SalesRepsManagementTable = () => {
  const [data, setData] = useState([
    {
      id: 1,
      customerName: "Alice Johnson",
      cardId: "CARD001",
      totalAmount: "$120",
      pointRedeem: 20,
      pointEarned: 12,
      finalAmount: "$100",
      transactionStatus: "Completed",
      date: "2025-08-17",
    },
    {
      id: 2,
      customerName: "John Doe",
      cardId: "CARD002",
      totalAmount: "$80",
      pointRedeem: 10,
      pointEarned: 8,
      finalAmount: "$70",
      transactionStatus: "Pending",
      date: "2025-07-16",
    },
    {
      id: 3,
      customerName: "Michael Brown",
      cardId: "CARD003",
      totalAmount: "$200",
      pointRedeem: 50,
      pointEarned: 20,
      finalAmount: "$150",
      transactionStatus: "Completed",
      date: "2025-08-15",
    },
  ]);

  const [selectedMonth, setSelectedMonth] = useState("");
  const [searchText, setSearchText] = useState("");
  const [isNewSellPage, setIsNewSellPage] = useState(false);

  const handleMonthChange = (month) => setSelectedMonth(month);
  const handleSearchChange = (e) => setSearchText(e.target.value);

  const filteredData = data.filter((item) => {
    const matchesMonth = selectedMonth
      ? new Date(item.date).getMonth() + 1 === parseInt(selectedMonth)
      : true;
    const matchesSearch = searchText
      ? item.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.cardId.toLowerCase().includes(searchText.toLowerCase())
      : true;
    return matchesMonth && matchesSearch;
  });

  const columns = [
    { title: "SL", dataIndex: "id", key: "id", align: "center" },
    {
      title: "Customer Name",
      dataIndex: "customerName",
      key: "customerName",
      align: "center",
    },
    { title: "Card ID", dataIndex: "cardId", key: "cardId", align: "center" },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      align: "center",
    },
    {
      title: "Point Redeem",
      dataIndex: "pointRedeem",
      key: "pointRedeem",
      align: "center",
    },
    {
      title: "Point Earned",
      dataIndex: "pointEarned",
      key: "pointEarned",
      align: "center",
    },
    {
      title: "Final Amount",
      dataIndex: "finalAmount",
      key: "finalAmount",
      align: "center",
    },
    {
      title: "Transaction Status",
      dataIndex: "transactionStatus",
      key: "transactionStatus",
      align: "center",
    },
  ];

  const handleNewSellSubmit = (values) => {
    const newEntry = {
      id: data.length + 1,
      customerName: values.customerName,
      cardId: values.cardId,
      totalAmount: `$${values.totalAmount}`,
      pointRedeem: values.pointRedeem,
      pointEarned: values.pointEarned,
      finalAmount: `$${values.finalAmount}`,
      transactionStatus: values.transactionStatus,
      date: values.date.format("YYYY-MM-DD"),
    };
    setData([newEntry, ...data]);
    setIsNewSellPage(false);
  };

  if (isNewSellPage) {
    return (
      <NewSell
        onBack={() => setIsNewSellPage(false)}
        onSubmit={handleNewSellSubmit}
      />
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-[24px] font-bold">Today’s Sell</h1>
      </div>

      <div className="flex justify-between items-center gap-4 mb-4">
        <div className="flex gap-2">
          <Input
            placeholder="Search by Customer Name or Card ID"
            style={{ width: 300 }}
            value={searchText}
            onChange={handleSearchChange}
            allowClear
          />
          <Select
            placeholder="Filter by Month"
            style={{ width: 200 }}
            onChange={handleMonthChange}
            allowClear
          >
            {Array.from({ length: 12 }, (_, i) => (
              <Option key={i + 1} value={String(i + 1)}>
                {new Date(0, i).toLocaleString("default", { month: "long" })}
              </Option>
            ))}
          </Select>
        </div>
        <Button
          onClick={() => setIsNewSellPage(true)}
          className="bg-primary text-white hover:text-secondary font-bold"
        >
          New Sell
        </Button>
      </div>

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
  );
};

export default SalesRepsManagementTable;
