export const sampleData = [
  {
    id: 1,
    initiatorName: "Dr. John Doe",
    email: "john.doe@email.com",
    respondentName: "Dr. Jane Smith",
    caseType: "Medical Malpractice",
    moderatorName: "Dr. Mike Johnson",
    jurorVote: "0 of 3",
    status: "Pending",
    submissionType: "Initial Submission",
    submittedDate: "2024-01-15",
    description:
      "Medical malpractice case regarding surgical procedure complications",
    juryFeedback: [],
    caseDetails: {
      patientInfo: "Patient Age: 45, Gender: Male",
      incidentDate: "2024-01-10",
      allegations: "Improper surgical procedure causing complications",
      evidence: "Medical records, surgical notes, witness statements",
    },
  },
  {
    id: 2,
    initiatorName: "Dr. Jane Smith",
    email: "jane.smith@email.com",
    respondentName: "Dr. Robert Brown",
    caseType: "Professional Conduct",
    moderatorName: "Dr. Sarah Wilson",
    jurorVote: "2 of 3",
    status: "Under Jury Review",
    submissionType: "Response Submission",
    submittedDate: "2024-02-01",
    description: "Response to allegations regarding patient care standards",
    juryFeedback: [
      {
        jurorId: 1,
        decision: "approve",
        reason: "Evidence supports the respondent's position",
      },
      {
        jurorId: 2,
        decision: "approve",
        reason: "Professional standards were maintained",
      },
    ],
    caseDetails: {
      incidentDate: "2024-01-25",
      allegations: "Unprofessional behavior with patient",
      evidence: "Patient complaints, staff testimonies",
    },
  },
  {
    id: 3,
    initiatorName: "Dr. Mike Johnson",
    email: "mike.johnson@email.com",
    respondentName: "Dr. Emily Davis",
    caseType: "Prescription Dispute",
    moderatorName: "Dr. David Miller",
    jurorVote: "3 of 3",
    status: "Final Review",
    submissionType: "Evidence Submission",
    submittedDate: "2024-01-20",
    description: "Additional evidence submission for ongoing case review",
    juryFeedback: [
      {
        jurorId: 1,
        decision: "approve",
        reason: "Clear evidence of proper prescription practices",
      },
      {
        jurorId: 2,
        decision: "approve",
        reason: "All medical protocols followed correctly",
      },
      {
        jurorId: 3,
        decision: "approve",
        reason: "No evidence of malpractice found",
      },
    ],
    caseDetails: {
      incidentDate: "2024-01-15",
      allegations: "Inappropriate prescription practices",
      evidence: "Prescription records, patient medical history",
    },
  },
];

// Utility function for status colors
export const getStatusColor = (status) => {
  switch (status) {
    case "Accepted":
    case "Running":
      return "#52c41a";
    case "Rejected":
      return "#f5222d";
    case "Pending":
      return "#fa8c16";
    case "Under Review":
    case "Under Jury Review":
      return "#1890ff";
    case "Sent to Jury":
      return "#722ed1";
    case "Final Review":
      return "#13c2c2";
    case "Completed":
      return "#389e0d";
    case "Finalized":
      return "#389e0d";
    default:
      return "#d9d9d9";
  }
};
