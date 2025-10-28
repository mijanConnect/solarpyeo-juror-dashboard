import React from "react";
import { Table } from "antd";

const dataSource = [
  {
    key: "1",
    orderId: "#123456",
    role: "Super Admin: Updated point system rules.",
    date: "2024-10-26 10:00:00",
  },
  {
    key: "2",
    orderId: "#123456",
    role: "Super Admin: Updated point system rules.",
    date: "2024-10-26 10:00:00",
  },
  {
    key: "3",
    orderId: "#123456",
    role: "Super Admin: Updated point system rules.",
    date: "2024-10-26 10:00:00",
  },
];

const getColumns = () => [
  {
    dataIndex: "role",
    key: "role",
    align: "center",
    render: (text) => (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <span>{text}</span>
      </div>
    ),
  },
  {
    dataIndex: "date",
    key: "date",
    render: (text) => (
      <div style={{ width: "100%", textAlign: "right", padding: 8 }}>
        {text}
      </div>
    ),
  },
];

const OrderTable = () => {
  const columns = getColumns();

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row justify-between mb-2 items-start sm:items-center gap-2 sm:gap-0">
        <h1 className="text-lg sm:text-xl md:text-xl font-bold text-secondary mb-2">
          Recent Activity
        </h1>
      </div>
      <div className="overflow-x-auto border rounded-lg pr-4 pl-4 pb-6 pt-3 shadow-md">
        <Table
          dataSource={dataSource}
          columns={columns}
          bordered={false}
          pagination={false}
          size="small"
          scroll={{ x: "max-content" }}
          showHeader={false} // hides <thead>
          rowKey="key"
          className="responsive-table"
        />
      </div>
    </div>
  );
};

export default OrderTable;