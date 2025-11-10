import React, { useMemo, useState } from "react";
import {
  Table,
  Button,
  Input,
  Select,
  Tag,
  Tooltip,
  message,
  Modal,
} from "antd";
import { FaFilePdf, FaEdit } from "react-icons/fa";
import { MdGavel } from "react-icons/md";
import { sampleData } from "./sampleData";
import { TableColumns } from "./CulomsTable";
import {
  AcceptModal,
  EditModal,
  JuryModal,
  PDFModal,
} from "./GeneratePDFContent ";
import { useGetInitialSubmissionsQuery } from "../../../redux/apiSlices/initialSubmission";

const { Option } = Select;

const InitialSubmission = () => {
  const [data, setData] = useState(sampleData);
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [submissionType, setSubmissionType] = useState("All");
  const [isPDFModalVisible, setIsPDFModalVisible] = useState(false);
  const [isAcceptModalVisible, setIsAcceptModalVisible] = useState(false);
  const [isJuryModalVisible, setIsJuryModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const queryParams = [
    { name: "page", value: page },
    { name: "limit", value: limit },
  ];
  if (searchText.trim()) {
    queryParams.push({ name: "fastName", value: searchText.trim() });
  }

  // Filter data
  const filteredData = data.filter((item) => {
    const matchesSearch =
      item.initiatorName.toLowerCase().includes(searchText.toLowerCase()) ||
      item.email.toLowerCase().includes(searchText.toLowerCase()) ||
      item.caseType.toLowerCase().includes(searchText.toLowerCase()) ||
      item.submissionType.toLowerCase().includes(searchText.toLowerCase());

    const matchesType =
      submissionType === "All" || item.status === submissionType;

    return matchesSearch && matchesType;
  });

  // Fetch from server using RTK Query
  const {
    data: resp,
    isLoading,
    isFetching,
    error,
  } = useGetInitialSubmissionsQuery(queryParams);

  console.log(resp);

  // Map server response to table-friendly shape
  const tableData = useMemo(() => {
    const items = resp?.data || [];
    return items.map((item, index) => {
      const initiatorName = item.user?.name || "N/A";
      const email = item.user?.email || "N/A";
      const respondentName =
        [
          item.respondentFastName,
          item.respondentMiddleName,
          item.respondentLastName,
        ]
          .filter(Boolean)
          .join(" ") || "N/A";
      const caseType = item.typeOfFiling || item.caseId || "N/A";
      const jurorVote = (item.jurorDecisions?.length || 0) + " of 3";
      const humanStatus = (item.status || "")
        .toLowerCase()
        .replace(/_/g, " ")
        .split(" ")
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join(" ");

      return {
        key: item._id,
        id: (page - 1) * limit + index + 1,
        initiatorName,
        email,
        respondentName,
        caseType,
        moderatorName: item.moderatorName || "N/A",
        jurorVote,
        status: humanStatus,
        // keep original machine status for control logic (e.g., PENDING/APPROVED/REJECTED)
        machineStatus: (item.status || "").toString(),
        jurorCount: item.jurorDecisions?.length || 0,
        raw: item,
      };
    });
  }, [resp, page, limit]);

  // Modal handlers
  const showPDFModal = (record) => {
    setSelectedRecord(record);
    setIsPDFModalVisible(true);
  };

  const showAcceptModal = (record) => {
    setSelectedRecord(record);
    setIsAcceptModalVisible(true);
  };

  const showJuryModal = (record) => {
    setSelectedRecord(record);
    setIsJuryModalVisible(true);
  };

  const showEditModal = (record) => {
    setSelectedRecord(record);
    setIsEditModalVisible(true);
  };

  // Action handlers
  const handleAcceptSubmit = (explanation) => {
    const updatedData = data.map((item) =>
      item.id === selectedRecord.id
        ? {
            ...item,
            status: "Proven",
            provenReason: explanation,
            provenDate: new Date().toISOString(),
          }
        : item
    );
    setData(updatedData);
    setIsAcceptModalVisible(false);
    message.success("Case marked as proven!");
  };

  const handleJurySubmit = (decision, explanation) => {
    if (!explanation.trim()) {
      message.error("Please provide an explanation!");
      return false;
    }

    const updatedData = data.map((item) => {
      if (item.id === selectedRecord.id) {
        return {
          ...item,
          status: "Unable to Decide",
          unableToDecideReason: explanation,
          unableToDecideDate: new Date().toISOString(),
          history: [
            ...(item.history || []),
            {
              date: new Date().toISOString(),
              action: "Unable to Decide",
              explanation: explanation,
            },
          ],
        };
      }
      return item;
    });

    setData(updatedData);
    message.success("Case marked as Unable to Decide!");
    return true;
  };

  const handleFinalEdit = (decisions, formValues) => {
    const updatedData = data.map((item) => {
      if (item.id === selectedRecord.id) {
        return {
          ...item,
          status: "Finalized",
          finalDecisions: decisions,
          adminComments: formValues.adminComments,
          finalResult: formValues.finalResult,
        };
      }
      return item;
    });

    setData(updatedData);
    message.success("Final decision submitted successfully!");
    return true;
  };

  const handleReject = (record) => {
    let explanation = "";

    Modal.confirm({
      title: "Mark as Disproven",
      content: (
        <div>
          <p>
            You are marking this case as <strong>Disproven</strong>.
          </p>
          <div style={{ marginTop: "16px" }}>
            <label>Explanation (Required):</label>
            <Input.TextArea
              rows={4}
              placeholder="Please explain why this case is disproven. This explanation will be included in the case history."
              onChange={(e) => (explanation = e.target.value)}
              maxLength={500}
            />
          </div>
        </div>
      ),
      okText: "Confirm Disproven",
      cancelText: "Cancel",
      width: 600,
      onOk() {
        if (!explanation.trim()) {
          message.error(
            "Please provide an explanation for why this case is disproven."
          );
          return Promise.reject();
        }

        const updatedData = data.map((item) =>
          item.id === record.id
            ? {
                ...item,
                status: "Disproven",
                disproveReason: explanation,
                disproveDate: new Date().toISOString(),
              }
            : item
        );

        setData(updatedData);
        message.success("Case marked as disproven!");
        return Promise.resolve();
      },
    });
  };

  const actionHandlers = {
    showPDFModal,
    showAcceptModal,
    showJuryModal,
    showEditModal,
    handleReject,
  };

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

  const columns = TableColumns(actionHandlers);

  return (
    <div className="">
      {/* Filters */}
      <div className="flex justify-between items-end bg-red-300 p-3 rounded-lg mb-4 mt-4">
        <p className="text-[25px] font-semibold ml-1">Initial Submissions</p>
        <div className="flex gap-2">
          <Input
            placeholder="Search by name, email, case type, or submission type"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 350, height: 40 }}
          />

          <Select
            value={submissionType}
            onChange={setSubmissionType}
            style={{ width: 200, height: 40 }}
          >
            <Option value="All">All Status</Option>
            <Option value="Pending">Pending</Option>
            <Option value="Under Jury Review">Under Jury Review</Option>
            <Option value="Final Review">Final Review</Option>
            <Option value="Rejected">Rejected</Option>
            <Option value="Completed">Completed</Option>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="responsive-table">
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
      </div>

      {/* Modals */}
      <PDFModal
        visible={isPDFModalVisible}
        onCancel={() => setIsPDFModalVisible(false)}
        selectedRecord={selectedRecord}
      />

      <AcceptModal
        visible={isAcceptModalVisible}
        onCancel={() => setIsAcceptModalVisible(false)}
        onOk={handleAcceptSubmit}
        selectedRecord={selectedRecord}
      />

      <JuryModal
        visible={isJuryModalVisible}
        onCancel={() => setIsJuryModalVisible(false)}
        onSubmit={handleJurySubmit}
        selectedRecord={selectedRecord}
      />

      <EditModal
        visible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        onSubmit={handleFinalEdit}
        selectedRecord={selectedRecord}
      />
    </div>
  );
};

export default InitialSubmission;
