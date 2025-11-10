import React from "react";
import { Button, Tag, Tooltip, Modal, message } from "antd";
import { FaFilePdf, FaEdit } from "react-icons/fa";
import { MdGavel } from "react-icons/md";
import { getStatusColor } from "./sampleData";
// import { getStatusColor } from "./sampleData";
// import { getStatusColor } from "./sampleData";
// import { getStatusColor } from '../data/sampleData';

export const TableColumns = (actionHandlers) => {
  const {
    showPDFModal,
    showAcceptModal,
    showJuryModal,
    showEditModal,
    handleReject,
  } = actionHandlers;

  //   const handleRejectConfirm = (record) => {
  //     Modal.confirm({
  //       title: 'Are you sure?',
  //       content: 'Do you want to reject this submission?',
  //       okText: 'Yes, Reject',
  //       cancelText: 'Cancel',
  //       onOk() {
  //         handleReject(record);
  //       }
  //     });
  //   };

  return [
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
      title: "Jury Vote",
      dataIndex: "jurorVote",
      key: "jurorVote",
      align: "center",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>,
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) => (
        <div className="flex justify-center gap-2">
          {/* Details Button - Always visible */}
          <Tooltip title="View Details">
            <Button
              type="primary"
              onClick={() => showPDFModal(record)}
              size="medium"
            >
              Details
            </Button>
          </Tooltip>

          {/* Proven Button - For all non-finalized cases */}
          {!["Rejected", "Finalized"].includes(record.status) && (
            <Tooltip title="Mark as Proven">
              <Button
                onClick={() => showAcceptModal(record)}
                size="medium"
                style={{
                  backgroundColor: "#52c41a",
                  borderColor: "#52c41a",
                  color: "white",
                }}
              >
                Proven
              </Button>
            </Tooltip>
          )}

          {/* Unable to Decide Button - For all non-finalized cases */}
          {!["Rejected", "Finalized"].includes(record.status) && (
            <Tooltip title="Unable to Decide">
              <Button
                onClick={() => showJuryModal(record)}
                size="medium"
                style={{
                  backgroundColor: "#faad14",
                  borderColor: "#faad14",
                  color: "white",
                }}
              >
                Unable to Decide
              </Button>
            </Tooltip>
          )}

          {/* Disproven Button - For all non-finalized cases */}
          {!["Rejected", "Finalized"].includes(record.status) && (
            <Tooltip title="Mark as Disproven">
              <Button
                onClick={() => handleReject(record)}
                size="medium"
                style={{
                  backgroundColor: "#f5222d",
                  borderColor: "#f5222d",
                  color: "white",
                }}
              >
                Disproven
              </Button>
            </Tooltip>
          )}
        </div>
      ),
    },
  ];
};
