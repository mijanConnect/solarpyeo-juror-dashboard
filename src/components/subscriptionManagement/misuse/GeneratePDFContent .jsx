import React, { useState } from "react";
import {
  Modal,
  Form,
  Input,
  Card,
  Radio,
  Space,
  Button,
  Tag,
  message,
} from "antd";
import { FaPlus, FaMinus } from "react-icons/fa";
import { getStatusColor } from "./sampleData";
// import { getStatusColor } from '../data/sampleData';

const { TextArea } = Input;

// PDF Content Generator
const generatePDFContent = (record) => {
  const caseTypeTemplates = {
    "Medical Malpractice": `
      <div style="font-family: Arial, sans-serif; padding: 40px; line-height: 1.6;">
        <div style="text-align: center; border-bottom: 3px solid #1890ff; padding-bottom: 20px; margin-bottom: 30px;">
          <h1 style="color: #1890ff; margin: 0;">MEDICAL MALPRACTICE CASE REPORT</h1>
          <p style="color: #666; margin: 5px 0;">Case ID: ${
            record.id
          } | Generated: ${new Date().toLocaleDateString()}</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
          <h2 style="color: #1890ff; border-bottom: 2px solid #e6f7ff; padding-bottom: 10px;">Case Overview</h2>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 15px;">
            <div><strong>Initiator:</strong> ${record.initiatorName}</div>
            <div><strong>Respondent:</strong> ${record.respondentName}</div>
            <div><strong>Email:</strong> ${record.email}</div>
            <div><strong>Moderator:</strong> ${record.moderatorName}</div>
            <div><strong>Submission Date:</strong> ${record.submittedDate}</div>
            <div><strong>Status:</strong> <span style="background: ${getStatusColor(
              record.status
            )}; color: white; padding: 4px 8px; border-radius: 4px;">${
      record.status
    }</span></div>
          </div>
        </div>

        <div style="margin-bottom: 25px;">
          <h3 style="color: #1890ff;">Medical Case Details</h3>
          <p><strong>Patient Information:</strong> ${
            record.caseDetails?.patientInfo || "Not specified"
          }</p>
          <p><strong>Incident Date:</strong> ${
            record.caseDetails?.incidentDate || "Not specified"
          }</p>
          <p><strong>Allegations:</strong> ${
            record.caseDetails?.allegations || "Not specified"
          }</p>
          <p><strong>Evidence:</strong> ${
            record.caseDetails?.evidence || "Not specified"
          }</p>
        </div>

        <div style="margin-bottom: 25px;">
          <h3 style="color: #1890ff;">Case Description</h3>
          <div style="background: white; padding: 15px; border: 1px solid #d9d9d9; border-radius: 6px;">
            ${record.description}
          </div>
        </div>

        ${
          record.juryFeedback && record.juryFeedback.length > 0
            ? `
          <div style="margin-bottom: 25px;">
            <h3 style="color: #1890ff;">Jury Review (${record.jurorVote})</h3>
            ${record.juryFeedback
              .map(
                (feedback, index) => `
              <div style="background: #f6ffed; border: 1px solid #b7eb8f; padding: 15px; border-radius: 6px; margin-bottom: 10px;">
                <h4 style="margin: 0 0 10px 0; color: #389e0d;">Juror ${
                  feedback.jurorId
                } Decision: ${feedback.decision.toUpperCase()}</h4>
                <p style="margin: 0;"><strong>Reason:</strong> ${
                  feedback.reason
                }</p>
              </div>
            `
              )
              .join("")}
          </div>
        `
            : ""
        }

        <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 2px solid #e6f7ff;">
          <p style="color: #666; font-size: 12px;">This document is confidential and for authorized personnel only</p>
        </div>
      </div>
    `,
    "Professional Conduct": `
      <div style="font-family: Arial, sans-serif; padding: 40px; line-height: 1.6;">
        <div style="text-align: center; border-bottom: 3px solid #722ed1; padding-bottom: 20px; margin-bottom: 30px;">
          <h1 style="color: #722ed1; margin: 0;">PROFESSIONAL CONDUCT CASE REPORT</h1>
          <p style="color: #666; margin: 5px 0;">Case ID: ${
            record.id
          } | Generated: ${new Date().toLocaleDateString()}</p>
        </div>
        
        <div style="background: #f9f0ff; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
          <h2 style="color: #722ed1; border-bottom: 2px solid #efdbff; padding-bottom: 10px;">Case Overview</h2>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 15px;">
            <div><strong>Initiator:</strong> ${record.initiatorName}</div>
            <div><strong>Respondent:</strong> ${record.respondentName}</div>
            <div><strong>Email:</strong> ${record.email}</div>
            <div><strong>Moderator:</strong> ${record.moderatorName}</div>
            <div><strong>Submission Date:</strong> ${record.submittedDate}</div>
            <div><strong>Status:</strong> <span style="background: ${getStatusColor(
              record.status
            )}; color: white; padding: 4px 8px; border-radius: 4px;">${
      record.status
    }</span></div>
          </div>
        </div>

        <div style="margin-bottom: 25px;">
          <h3 style="color: #722ed1;">Professional Conduct Details</h3>
          <p><strong>Incident Date:</strong> ${
            record.caseDetails?.incidentDate || "Not specified"
          }</p>
          <p><strong>Allegations:</strong> ${
            record.caseDetails?.allegations || "Not specified"
          }</p>
          <p><strong>Evidence:</strong> ${
            record.caseDetails?.evidence || "Not specified"
          }</p>
        </div>

        <div style="margin-bottom: 25px;">
          <h3 style="color: #722ed1;">Case Description</h3>
          <div style="background: white; padding: 15px; border: 1px solid #d9d9d9; border-radius: 6px;">
            ${record.description}
          </div>
        </div>

        ${
          record.juryFeedback && record.juryFeedback.length > 0
            ? `
          <div style="margin-bottom: 25px;">
            <h3 style="color: #722ed1;">Jury Review (${record.jurorVote})</h3>
            ${record.juryFeedback
              .map(
                (feedback, index) => `
              <div style="background: #f6ffed; border: 1px solid #b7eb8f; padding: 15px; border-radius: 6px; margin-bottom: 10px;">
                <h4 style="margin: 0 0 10px 0; color: #389e0d;">Juror ${
                  feedback.jurorId
                } Decision: ${feedback.decision.toUpperCase()}</h4>
                <p style="margin: 0;"><strong>Reason:</strong> ${
                  feedback.reason
                }</p>
              </div>
            `
              )
              .join("")}
          </div>
        `
            : ""
        }

        <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 2px solid #efdbff;">
          <p style="color: #666; font-size: 12px;">This document is confidential and for authorized personnel only</p>
        </div>
      </div>
    `,
    "Prescription Dispute": `
      <div style="font-family: Arial, sans-serif; padding: 40px; line-height: 1.6;">
        <div style="text-align: center; border-bottom: 3px solid #13c2c2; padding-bottom: 20px; margin-bottom: 30px;">
          <h1 style="color: #13c2c2; margin: 0;">PRESCRIPTION DISPUTE CASE REPORT</h1>
          <p style="color: #666; margin: 5px 0;">Case ID: ${
            record.id
          } | Generated: ${new Date().toLocaleDateString()}</p>
        </div>
        
        <div style="background: #e6fffb; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
          <h2 style="color: #13c2c2; border-bottom: 2px solid #87e8de; padding-bottom: 10px;">Case Overview</h2>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 15px;">
            <div><strong>Initiator:</strong> ${record.initiatorName}</div>
            <div><strong>Respondent:</strong> ${record.respondentName}</div>
            <div><strong>Email:</strong> ${record.email}</div>
            <div><strong>Moderator:</strong> ${record.moderatorName}</div>
            <div><strong>Submission Date:</strong> ${record.submittedDate}</div>
            <div><strong>Status:</strong> <span style="background: ${getStatusColor(
              record.status
            )}; color: white; padding: 4px 8px; border-radius: 4px;">${
      record.status
    }</span></div>
          </div>
        </div>

        <div style="margin-bottom: 25px;">
          <h3 style="color: #13c2c2;">Prescription Case Details</h3>
          <p><strong>Incident Date:</strong> ${
            record.caseDetails?.incidentDate || "Not specified"
          }</p>
          <p><strong>Allegations:</strong> ${
            record.caseDetails?.allegations || "Not specified"
          }</p>
          <p><strong>Evidence:</strong> ${
            record.caseDetails?.evidence || "Not specified"
          }</p>
        </div>

        <div style="margin-bottom: 25px;">
          <h3 style="color: #13c2c2;">Case Description</h3>
          <div style="background: white; padding: 15px; border: 1px solid #d9d9d9; border-radius: 6px;">
            ${record.description}
          </div>
        </div>

        ${
          record.juryFeedback && record.juryFeedback.length > 0
            ? `
          <div style="margin-bottom: 25px;">
            <h3 style="color: #13c2c2;">Jury Review (${record.jurorVote})</h3>
            ${record.juryFeedback
              .map(
                (feedback, index) => `
              <div style="background: #f6ffed; border: 1px solid #b7eb8f; padding: 15px; border-radius: 6px; margin-bottom: 10px;">
                <h4 style="margin: 0 0 10px 0; color: #389e0d;">Juror ${
                  feedback.jurorId
                } Decision: ${feedback.decision.toUpperCase()}</h4>
                <p style="margin: 0;"><strong>Reason:</strong> ${
                  feedback.reason
                }</p>
              </div>
            `
              )
              .join("")}
          </div>
        `
            : ""
        }

        <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 2px solid #87e8de;">
          <p style="color: #666; font-size: 12px;">This document is confidential and for authorized personnel only</p>
        </div>
      </div>
    `,
  };

  return (
    caseTypeTemplates[record.caseType] ||
    caseTypeTemplates["Medical Malpractice"]
  );
};

// Details Modal Component
export const PDFModal = ({ visible, onCancel, selectedRecord }) => (
  <Modal
    title={`Case Details - ${selectedRecord?.caseType}`}
    visible={visible}
    onCancel={onCancel}
    footer={[
      <Button key="close" onClick={onCancel}>
        Close
      </Button>,
      <Button key="print" type="primary" onClick={() => window.print()}>
        Print Details
      </Button>,
    ]}
    width={900}
    style={{ top: 20 }}
  >
    {selectedRecord && (
      <div className="space-y-6">
        {/* Case Overview */}
        <Card title="Case Overview" className="shadow-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <strong>Case ID:</strong> {selectedRecord.id}
            </div>
            <div>
              <strong>Status:</strong>{" "}
              <Tag color={getStatusColor(selectedRecord.status)}>
                {selectedRecord.status}
              </Tag>
            </div>
            <div>
              <strong>Initiator:</strong> {selectedRecord.initiatorName}
            </div>
            <div>
              <strong>Respondent:</strong> {selectedRecord.respondentName}
            </div>
            <div>
              <strong>Email:</strong> {selectedRecord.email}
            </div>
            <div>
              <strong>Moderator:</strong> {selectedRecord.moderatorName}
            </div>
            <div>
              <strong>Case Type:</strong> {selectedRecord.caseType}
            </div>
            <div>
              <strong>Submission Type:</strong> {selectedRecord.submissionType}
            </div>
          </div>
        </Card>

        {/* Case Details */}
        <Card title="Case Details" className="shadow-sm">
          <div className="space-y-4">
            {selectedRecord.caseDetails && (
              <>
                {selectedRecord.caseDetails.patientInfo && (
                  <div>
                    <strong>Patient Information:</strong>{" "}
                    {selectedRecord.caseDetails.patientInfo}
                  </div>
                )}
                {selectedRecord.caseDetails.incidentDate && (
                  <div>
                    <strong>Incident Date:</strong>{" "}
                    {selectedRecord.caseDetails.incidentDate}
                  </div>
                )}
                {selectedRecord.caseDetails.allegations && (
                  <div>
                    <strong>Allegations:</strong>{" "}
                    {selectedRecord.caseDetails.allegations}
                  </div>
                )}
                {selectedRecord.caseDetails.evidence && (
                  <div>
                    <strong>Evidence:</strong>{" "}
                    {selectedRecord.caseDetails.evidence}
                  </div>
                )}
              </>
            )}
            <div>
              <strong>Description:</strong>
              <div className="mt-2 p-4 bg-gray-50 rounded-md">
                {selectedRecord.description}
              </div>
            </div>
          </div>
        </Card>

        {/* Case History */}
        <Card title="Case History" className="shadow-sm">
          {/* Proven Status */}
          {selectedRecord.status === "Proven" &&
            selectedRecord.provenReason && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
                <h4 className="text-green-700 font-medium mb-2">Proven</h4>
                <div>
                  <strong>Date:</strong>{" "}
                  {new Date(selectedRecord.provenDate).toLocaleString()}
                </div>
                <div className="mt-2">
                  <strong>Explanation:</strong> {selectedRecord.provenReason}
                </div>
              </div>
            )}

          {/* Unable to Decide Status */}
          {selectedRecord.status === "Unable to Decide" &&
            selectedRecord.unableToDecideReason && (
              <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                <h4 className="text-yellow-700 font-medium mb-2">
                  Unable to Decide
                </h4>
                <div>
                  <strong>Date:</strong>{" "}
                  {new Date(selectedRecord.unableToDecideDate).toLocaleString()}
                </div>
                <div className="mt-2">
                  <strong>Explanation:</strong>{" "}
                  {selectedRecord.unableToDecideReason}
                </div>
              </div>
            )}

          {/* Disproven Status */}
          {selectedRecord.status === "Disproven" &&
            selectedRecord.disproveReason && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <h4 className="text-red-700 font-medium mb-2">Disproven</h4>
                <div>
                  <strong>Date:</strong>{" "}
                  {new Date(selectedRecord.disproveDate).toLocaleString()}
                </div>
                <div className="mt-2">
                  <strong>Explanation:</strong> {selectedRecord.disproveReason}
                </div>
              </div>
            )}

          {/* History Records */}
          {selectedRecord.history && selectedRecord.history.length > 0 ? (
            <div className="mt-4">
              <h4 className="font-medium mb-2">Previous Actions</h4>
              {selectedRecord.history.map((item, index) => (
                <div
                  key={index}
                  className="mb-3 p-3 bg-gray-50 border border-gray-200 rounded-md"
                >
                  <div>
                    <strong>Action:</strong> {item.action}
                  </div>
                  <div>
                    <strong>Date:</strong>{" "}
                    {new Date(item.date).toLocaleString()}
                  </div>
                  {item.explanation && (
                    <div>
                      <strong>Details:</strong> {item.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500">No history records available.</div>
          )}
        </Card>
      </div>
    )}
  </Modal>
);

// Proven Modal Component
export const AcceptModal = ({ visible, onCancel, onOk, selectedRecord }) => {
  const [explanation, setExplanation] = useState("");

  const handleSubmit = () => {
    if (!explanation.trim()) {
      message.error(
        "Please provide an explanation for why this case is proven."
      );
      return;
    }
    onOk(explanation);
  };

  const handleCancel = () => {
    setExplanation("");
    onCancel();
  };

  return (
    <Modal
      title="Mark as Proven"
      visible={visible}
      onCancel={handleCancel}
      onOk={handleSubmit}
      width={600}
      okText="Confirm Proven"
      cancelText="Cancel"
    >
      {selectedRecord && (
        <div className="space-y-4">
          <Card>
            <p className="text-lg mb-4">
              You are marking this case as <strong>Proven</strong>.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <strong>Case Type:</strong> {selectedRecord.caseType}
                </div>
                <div>
                  <strong>Initiator:</strong> {selectedRecord.initiatorName}
                </div>
                <div>
                  <strong>Respondent:</strong> {selectedRecord.respondentName}
                </div>
                <div>
                  <strong>Submission Type:</strong>{" "}
                  {selectedRecord.submissionType}
                </div>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium mb-2">
                Explanation (Required):
              </label>
              <TextArea
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                placeholder="Please explain why this case is proven. This explanation will be included in the case history."
                rows={4}
                maxLength={500}
                showCount
              />
            </div>

            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 text-sm">
                <strong>Note:</strong> This decision will be recorded in the
                case history and cannot be undone.
              </p>
            </div>
          </Card>
        </div>
      )}
    </Modal>
  );
};

// Unable to Decide Modal Component
export const JuryModal = ({ visible, onCancel, onSubmit, selectedRecord }) => {
  const [explanation, setExplanation] = useState("");

  const handleSubmit = () => {
    if (!explanation.trim()) {
      message.error(
        "Please provide an explanation for why you are unable to decide."
      );
      return;
    }
    const success = onSubmit("unable_to_decide", explanation);
    if (success) {
      setExplanation("");
    }
  };

  const handleCancel = () => {
    setExplanation("");
    onCancel();
  };

  return (
    <Modal
      title="Unable to Decide"
      visible={visible}
      onCancel={handleCancel}
      onOk={handleSubmit}
      width={700}
      okText="Confirm"
      cancelText="Cancel"
    >
      {selectedRecord && (
        <div className="space-y-4">
          <Card title="Case Information">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <strong>Case Type:</strong> {selectedRecord.caseType}
              </div>
              <div>
                <strong>Initiator:</strong> {selectedRecord.initiatorName}
              </div>
              <div>
                <strong>Respondent:</strong> {selectedRecord.respondentName}
              </div>
              <div>
                <strong>Status:</strong> {selectedRecord.status}
              </div>
            </div>
          </Card>

          <Card title="Unable to Decide Explanation">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Please explain why you are unable to decide on this case
                  (Required):
                </label>
                <TextArea
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  placeholder="Explain why you cannot make a decision at this time. For example: insufficient evidence, conflicting information, need for additional expert opinion, etc."
                  rows={4}
                  maxLength={500}
                  showCount
                />
              </div>
            </div>
          </Card>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-yellow-700 text-sm">
              <strong>Important:</strong> Your explanation will be permanently
              recorded in the case history. This status can be updated later if
              more information becomes available.
            </p>
          </div>
        </div>
      )}
    </Modal>
  );
};

// Edit Modal Component
export const EditModal = ({ visible, onCancel, onSubmit, selectedRecord }) => {
  const [inputFields, setInputFields] = useState([{ id: 1, value: "" }]);
  const [editForm] = Form.useForm();

  // Reset form when modal opens
  React.useEffect(() => {
    if (visible) {
      setInputFields([{ id: 1, value: "" }]);
      editForm.setFieldsValue({
        adminComments: "",
        finalResult: "",
      });
    }
  }, [visible, editForm]);

  const addInputField = () => {
    const newId = Math.max(...inputFields.map((field) => field.id)) + 1;
    setInputFields([...inputFields, { id: newId, value: "" }]);
  };

  const removeInputField = (id) => {
    if (inputFields.length > 1) {
      setInputFields(inputFields.filter((field) => field.id !== id));
    }
  };

  const updateInputField = (id, value) => {
    setInputFields(
      inputFields.map((field) =>
        field.id === id ? { ...field, value } : field
      )
    );
  };

  const handleSubmit = () => {
    editForm.validateFields().then((values) => {
      const hasValidDecision = inputFields.some(
        (field) => field.value.trim() !== ""
      );

      if (!hasValidDecision) {
        message.error("Please provide at least one decision!");
        return;
      }

      const decisions = inputFields
        .filter((field) => field.value.trim() !== "")
        .map((field) => field.value.trim());

      const success = onSubmit(decisions, values);
      if (success) {
        // Reset form
        setInputFields([{ id: 1, value: "" }]);
        editForm.resetFields();
      }
    });
  };

  return (
    <Modal
      title="Final Case Review & Decision"
      visible={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      width={800}
      okText="Submit Final Decision"
      cancelText="Cancel"
    >
      {selectedRecord && (
        <div className="space-y-4">
          <Card title="Case Summary">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <strong>Case Type:</strong> {selectedRecord.caseType}
              </div>
              <div>
                <strong>Jury Votes:</strong> {selectedRecord.jurorVote}
              </div>
              <div>
                <strong>Initiator:</strong> {selectedRecord.initiatorName}
              </div>
              <div>
                <strong>Respondent:</strong> {selectedRecord.respondentName}
              </div>
            </div>

            {selectedRecord.juryFeedback &&
              selectedRecord.juryFeedback.length > 0 && (
                <div>
                  <h4 style={{ marginBottom: 12 }}>Jury Decisions:</h4>
                  {selectedRecord.juryFeedback.map((feedback, index) => (
                    <div key={index} className="mb-2 p-3 bg-gray-50 rounded">
                      <strong>Juror {feedback.jurorId}:</strong>
                      <Tag
                        color={
                          feedback.decision === "approve" ? "green" : "red"
                        }
                        style={{ marginLeft: 8 }}
                      >
                        {feedback.decision.toUpperCase()}
                      </Tag>
                      <p className="mt-1 text-sm text-gray-600">
                        {feedback.reason}
                      </p>
                    </div>
                  ))}
                </div>
              )}
          </Card>

          <Card title="Final Administrative Decision">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-3">
                  Administrative Decisions:
                </label>
                {inputFields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-2 mb-3">
                    <Input
                      placeholder={`Enter decision ${index + 1}`}
                      value={field.value}
                      onChange={(e) =>
                        updateInputField(field.id, e.target.value)
                      }
                      style={{ flex: 1 }}
                      className="h-12"
                    />
                    <div className="flex gap-1">
                      {index === 0 ? (
                        <Button
                          type="primary"
                          icon={<FaPlus />}
                          size="large"
                          onClick={addInputField}
                          style={{ minWidth: "32px" }}
                        />
                      ) : (
                        <>
                          <Button
                            type="primary"
                            icon={<FaPlus />}
                            size="large"
                            onClick={addInputField}
                            style={{ minWidth: "32px" }}
                          />
                          <Button
                            type="primary"
                            danger
                            icon={<FaMinus />}
                            size="large"
                            onClick={() => removeInputField(field.id)}
                            style={{ minWidth: "32px" }}
                          />
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* <Form form={editForm} layout="vertical">
            <Form.Item
              name="adminComments"
              label="Administrative Comments"
              rules={[{ required: true, message: 'Please provide administrative comments' }]}
            >
              <TextArea
                placeholder="Provide detailed administrative comments based on jury feedback and case evidence..."
                rows={4}
                maxLength={1000}
                showCount
              />
            </Form.Item>

            <Form.Item
              name="finalResult"
              label="Final Result & Actions"
              rules={[{ required: true, message: 'Please specify final result and actions' }]}
            >
              <TextArea
                placeholder="Specify any actions to be taken, penalties, recommendations, or case closure details..."
                rows={3}
                maxLength={800}
                showCount
              />
            </Form.Item>
          </Form> */}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-blue-700 text-sm">
              <strong>Note:</strong> This final decision will be permanently
              recorded and the case will be marked as finalized. All parties
              will be notified of the outcome.
            </p>
          </div>
        </div>
      )}
    </Modal>
  );
};
