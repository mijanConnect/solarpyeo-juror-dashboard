import { Button, Tooltip } from "antd";
// import { getStatusColor } from "./sampleData";
// import { getStatusColor } from "./sampleData";
// import { getStatusColor } from '../data/sampleData';

export const TableColumns = (actionHandlers, user) => {
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
    // {
    //   title: "Moderator Name",
    //   dataIndex: "moderatorName",
    //   key: "moderatorName",
    //   align: "center",
    // },
    {
      title: "Jury Vote",
      dataIndex: "jurorVote",
      key: "jurorVote",
      align: "center",
    },
    // {
    //   title: "Status",
    //   dataIndex: "status",
    //   key: "status",
    //   align: "center",
    //   render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>,
    // },
    {
      title: "Action",
      key: "action",
      align: "center",
      width: 100,
      render: (_, record) => {
        // Determine if the current logged-in user has already voted on this record
        const jurorDecisions =
          record.raw?.jurorDecisions || record.raw?.juryFeedback || [];

        let hasVoted = false;
        try {
          const userId = user?.raw?._id || user?.raw?.id || null;
          const userEmail = user?.email || null;
          if (userId || userEmail) {
            hasVoted = jurorDecisions.some((d) => {
              // Check if juror object exists with nested _id or if jurorId field exists
              return (
                (d.juror?._id && String(d.juror._id) === String(userId)) ||
                (d.juror?.email && d.juror.email === userEmail) ||
                (d.jurorId && String(d.jurorId) === String(userId)) ||
                (d.jurorEmail && d.jurorEmail === userEmail)
              );
            });
          }
        } catch (e) {
          hasVoted = false;
        }

        // If the current user already voted, only show Details
        if (hasVoted) {
          return (
            <div className="flex justify-start gap-2">
              <Tooltip title="View Details">
                <Button
                  type="primary"
                  onClick={() => showPDFModal(record)}
                  size="medium"
                >
                  Details
                </Button>
              </Tooltip>
            </div>
          );
        }

        // Otherwise show all available actions (subject to status)
        return (
          <div className="flex justify-start gap-2">
            <Tooltip title="View Details">
              <Button
                type="primary"
                onClick={() => showPDFModal(record)}
                size="medium"
              >
                Details
              </Button>
            </Tooltip>

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
        );
      },
    },
  ];
};
