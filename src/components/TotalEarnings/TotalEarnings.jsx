import { Alert, DatePicker, Spin, Table, Tag } from "antd";
import moment from "moment";
import { useMemo, useState } from "react";
import { useReportEarningsQuery } from "../../redux/apiSlices/earningSlice";
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
  // default to the current year (show full-year data on first load)
  // but keep the picker empty initially via `pickerRange`
  const [dateRange, setDateRange] = useState([
    moment().startOf("year"),
    moment().endOf("year"),
  ]);
  const [pickerRange, setPickerRange] = useState([null, null]);

  // query the report earnings endpoint
  const startDate =
    dateRange && dateRange[0]
      ? moment(dateRange[0]).format("YYYY-MM-DD")
      : null;
  const endDate =
    dateRange && dateRange[1]
      ? moment(dateRange[1]).format("YYYY-MM-DD")
      : null;

  const {
    data: earningsResp,
    isLoading: earningsLoading,
    isError: earningsError,
  } = useReportEarningsQuery(
    { startDate, endDate },
    { skip: !startDate || !endDate }
  );

  // Pull total earning from API response (API returns data.totalEarning)
  const totalEarnings = useMemo(() => {
    return earningsResp?.data?.totalEarning ?? 0;
  }, [earningsResp]);

  // map API paymentDetails to table rows
  const tableData = useMemo(() => {
    const details = earningsResp?.data?.paymentDetails || [];
    return details.map((p, idx) => {
      const submission = p.submissionId || {};
      const user = p.submissionId?.user || {};
      const caseId = submission.caseId;
      const respondentName = [
        submission.respondentFastName,
        submission.respondentMiddleName,
        submission.respondentLastName,
      ]
        .filter(Boolean)
        .join(" ");
      const decisions = Array.isArray(submission.jurorDecisions)
        ? submission.jurorDecisions
        : [];
      // If total jurors count is provided use it, otherwise assume equal to decisions length
      const totalJurors = submission.jurorCount ?? decisions.length;
      const jurorVote = `${decisions.length} of ${totalJurors}`;

      return {
        serial: idx + 1,
        id: p._id || idx + 1,
        initiatorName:
          user.firstName + " " + user.middleName + " " + user.lastName || "N/A",
        email: user.email || "N/A",
        respondentName: respondentName || "N/A",
        caseType: submission.submittionType || "N/A",
        caseId: caseId || "N/A",
        jurorVote,
        revenue: `$${p.price || 0}`,
        status: p.paymentStatus || submission.status || "N/A",
      };
    });
  }, [earningsResp]);

  // (totalRevenue computed from API rows via useMemo above)

  const columns = [
    {
      title: "SL",
      dataIndex: "serial",
      key: "serial",
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
      title: "Submission Type",
      dataIndex: "caseType",
      key: "caseType",
      align: "center",
    },
    {
      title: "Case ID",
      dataIndex: "caseId",
      key: "caseId",
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
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Total Earnings
        </h1>
        <p className="text-gray-600">
          Track and monitor your revenue and earnings
        </p>
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
      <div className="mb-2 flex justify-between items-center">
        <RangePicker
          className="min-w-[200px] sm:w-[250px]"
          placeholder={["Start Date", "End Date"]}
          value={pickerRange}
          onChange={(vals) => {
            if (!vals) {
              // clear picker and revert table/query to present year
              setPickerRange([null, null]);
              setDateRange([moment().startOf("year"), moment().endOf("year")]);
              return;
            }
            // show selected in picker and normalize to day bounds for API
            setPickerRange(vals);
            setDateRange([vals[0].startOf("day"), vals[1].endOf("day")]);
          }}
          format="YYYY-MM-DD"
          allowClear={true}
        />
        <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
          <span className="text-sm text-blue-600 font-medium">
            Total Revenue:{" "}
          </span>
          <span className="text-lg font-bold text-blue-700">
            ${totalEarnings}
          </span>
        </div>
      </div>

      {/* Earnings Table */}
      <div style={{ overflowX: "auto" }}>
        {earningsLoading ? (
          <div className="w-full flex justify-center py-8">
            <Spin size="large" />
          </div>
        ) : earningsError ? (
          <Alert
            message="Failed to load earnings"
            description={earningsResp?.message || undefined}
            type="error"
            showIcon
            className="my-4"
          />
        ) : (
          <Table
            components={components}
            columns={columns}
            dataSource={tableData}
            rowKey="id"
            pagination={{
              pageSize: 10,
            }}
            scroll={{ x: "max-content" }}
            className="custom-table"
          />
        )}
      </div>
    </div>
  );
};

export default TotalEarnings;
