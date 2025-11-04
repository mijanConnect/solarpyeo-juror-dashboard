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
  message
} from "antd";
import { FaPlus, FaMinus, FaFilePdf } from "react-icons/fa";
import { getStatusColor } from "./sampleData";
import { MdGavel } from "react-icons/md";
// import { getStatusColor } from '../data/sampleData';

const { TextArea } = Input;

// PDF Content Generator
const generatePDFContent = (record) => {
  const caseTypeTemplates = {
    "Medical Malpractice": `
      <div style="font-family: Arial, sans-serif; padding: 40px; line-height: 1.6;">
        <div style="text-align: center; border-bottom: 3px solid #1890ff; padding-bottom: 20px; margin-bottom: 30px;">
          <h1 style="color: #1890ff; margin: 0;">MEDICAL MALPRACTICE CASE REPORT</h1>
          <p style="color: #666; margin: 5px 0;">Case ID: ${record.id} | Generated: ${new Date().toLocaleDateString()}</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
          <h2 style="color: #1890ff; border-bottom: 2px solid #e6f7ff; padding-bottom: 10px;">Case Overview</h2>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 15px;">
            <div><strong>Initiator:</strong> ${record.initiatorName}</div>
            <div><strong>Respondent:</strong> ${record.respondentName}</div>
            <div><strong>Email:</strong> ${record.email}</div>
            <div><strong>Moderator:</strong> ${record.moderatorName}</div>
            <div><strong>Submission Date:</strong> ${record.submittedDate}</div>
            <div><strong>Status:</strong> <span style="background: ${getStatusColor(record.status)}; color: white; padding: 4px 8px; border-radius: 4px;">${record.status}</span></div>
          </div>
        </div>

        <div style="margin-bottom: 25px;">
          <h3 style="color: #1890ff;">Medical Case Details</h3>
          <p><strong>Patient Information:</strong> ${record.caseDetails?.patientInfo || 'Not specified'}</p>
          <p><strong>Incident Date:</strong> ${record.caseDetails?.incidentDate || 'Not specified'}</p>
          <p><strong>Allegations:</strong> ${record.caseDetails?.allegations || 'Not specified'}</p>
          <p><strong>Evidence:</strong> ${record.caseDetails?.evidence || 'Not specified'}</p>
        </div>

        <div style="margin-bottom: 25px;">
          <h3 style="color: #1890ff;">Case Description</h3>
          <div style="background: white; padding: 15px; border: 1px solid #d9d9d9; border-radius: 6px;">
            ${record.description}
          </div>
        </div>

        ${record.juryFeedback && record.juryFeedback.length > 0 ? `
          <div style="margin-bottom: 25px;">
            <h3 style="color: #1890ff;">Jury Review (${record.jurorVote})</h3>
            ${record.juryFeedback.map((feedback, index) => `
              <div style="background: #f6ffed; border: 1px solid #b7eb8f; padding: 15px; border-radius: 6px; margin-bottom: 10px;">
                <h4 style="margin: 0 0 10px 0; color: #389e0d;">Juror ${feedback.jurorId} Decision: ${feedback.decision.toUpperCase()}</h4>
                <p style="margin: 0;"><strong>Reason:</strong> ${feedback.reason}</p>
              </div>
            `).join('')}
          </div>
        ` : ''}

        <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 2px solid #e6f7ff;">
          <p style="color: #666; font-size: 12px;">This document is confidential and for authorized personnel only</p>
        </div>
      </div>
    `,
    "Professional Conduct": `
      <div style="font-family: Arial, sans-serif; padding: 40px; line-height: 1.6;">
        <div style="text-align: center; border-bottom: 3px solid #722ed1; padding-bottom: 20px; margin-bottom: 30px;">
          <h1 style="color: #722ed1; margin: 0;">PROFESSIONAL CONDUCT CASE REPORT</h1>
          <p style="color: #666; margin: 5px 0;">Case ID: ${record.id} | Generated: ${new Date().toLocaleDateString()}</p>
        </div>
        
        <div style="background: #f9f0ff; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
          <h2 style="color: #722ed1; border-bottom: 2px solid #efdbff; padding-bottom: 10px;">Case Overview</h2>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 15px;">
            <div><strong>Initiator:</strong> ${record.initiatorName}</div>
            <div><strong>Respondent:</strong> ${record.respondentName}</div>
            <div><strong>Email:</strong> ${record.email}</div>
            <div><strong>Moderator:</strong> ${record.moderatorName}</div>
            <div><strong>Submission Date:</strong> ${record.submittedDate}</div>
            <div><strong>Status:</strong> <span style="background: ${getStatusColor(record.status)}; color: white; padding: 4px 8px; border-radius: 4px;">${record.status}</span></div>
          </div>
        </div>

        <div style="margin-bottom: 25px;">
          <h3 style="color: #722ed1;">Professional Conduct Details</h3>
          <p><strong>Incident Date:</strong> ${record.caseDetails?.incidentDate || 'Not specified'}</p>
          <p><strong>Allegations:</strong> ${record.caseDetails?.allegations || 'Not specified'}</p>
          <p><strong>Evidence:</strong> ${record.caseDetails?.evidence || 'Not specified'}</p>
        </div>

        <div style="margin-bottom: 25px;">
          <h3 style="color: #722ed1;">Case Description</h3>
          <div style="background: white; padding: 15px; border: 1px solid #d9d9d9; border-radius: 6px;">
            ${record.description}
          </div>
        </div>

        ${record.juryFeedback && record.juryFeedback.length > 0 ? `
          <div style="margin-bottom: 25px;">
            <h3 style="color: #722ed1;">Jury Review (${record.jurorVote})</h3>
            ${record.juryFeedback.map((feedback, index) => `
              <div style="background: #f6ffed; border: 1px solid #b7eb8f; padding: 15px; border-radius: 6px; margin-bottom: 10px;">
                <h4 style="margin: 0 0 10px 0; color: #389e0d;">Juror ${feedback.jurorId} Decision: ${feedback.decision.toUpperCase()}</h4>
                <p style="margin: 0;"><strong>Reason:</strong> ${feedback.reason}</p>
              </div>
            `).join('')}
          </div>
        ` : ''}

        <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 2px solid #efdbff;">
          <p style="color: #666; font-size: 12px;">This document is confidential and for authorized personnel only</p>
        </div>
      </div>
    `,
    "Prescription Dispute": `
      <div style="font-family: Arial, sans-serif; padding: 40px; line-height: 1.6;">
        <div style="text-align: center; border-bottom: 3px solid #13c2c2; padding-bottom: 20px; margin-bottom: 30px;">
          <h1 style="color: #13c2c2; margin: 0;">PRESCRIPTION DISPUTE CASE REPORT</h1>
          <p style="color: #666; margin: 5px 0;">Case ID: ${record.id} | Generated: ${new Date().toLocaleDateString()}</p>
        </div>
        
        <div style="background: #e6fffb; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
          <h2 style="color: #13c2c2; border-bottom: 2px solid #87e8de; padding-bottom: 10px;">Case Overview</h2>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 15px;">
            <div><strong>Initiator:</strong> ${record.initiatorName}</div>
            <div><strong>Respondent:</strong> ${record.respondentName}</div>
            <div><strong>Email:</strong> ${record.email}</div>
            <div><strong>Moderator:</strong> ${record.moderatorName}</div>
            <div><strong>Submission Date:</strong> ${record.submittedDate}</div>
            <div><strong>Status:</strong> <span style="background: ${getStatusColor(record.status)}; color: white; padding: 4px 8px; border-radius: 4px;">${record.status}</span></div>
          </div>
        </div>

        <div style="margin-bottom: 25px;">
          <h3 style="color: #13c2c2;">Prescription Case Details</h3>
          <p><strong>Incident Date:</strong> ${record.caseDetails?.incidentDate || 'Not specified'}</p>
          <p><strong>Allegations:</strong> ${record.caseDetails?.allegations || 'Not specified'}</p>
          <p><strong>Evidence:</strong> ${record.caseDetails?.evidence || 'Not specified'}</p>
        </div>

        <div style="margin-bottom: 25px;">
          <h3 style="color: #13c2c2;">Case Description</h3>
          <div style="background: white; padding: 15px; border: 1px solid #d9d9d9; border-radius: 6px;">
            ${record.description}
          </div>
        </div>

        ${record.juryFeedback && record.juryFeedback.length > 0 ? `
          <div style="margin-bottom: 25px;">
            <h3 style="color: #13c2c2;">Jury Review (${record.jurorVote})</h3>
            ${record.juryFeedback.map((feedback, index) => `
              <div style="background: #f6ffed; border: 1px solid #b7eb8f; padding: 15px; border-radius: 6px; margin-bottom: 10px;">
                <h4 style="margin: 0 0 10px 0; color: #389e0d;">Juror ${feedback.jurorId} Decision: ${feedback.decision.toUpperCase()}</h4>
                <p style="margin: 0;"><strong>Reason:</strong> ${feedback.reason}</p>
              </div>
            `).join('')}
          </div>
        ` : ''}

        <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 2px solid #87e8de;">
          <p style="color: #666; font-size: 12px;">This document is confidential and for authorized personnel only</p>
        </div>
      </div>
    `
  };

  return caseTypeTemplates[record.caseType] || caseTypeTemplates["Medical Malpractice"];
};

// PDF Modal Component
export const PDFModal = ({ visible, onCancel, selectedRecord }) => {
  const handleDownloadPDF = () => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Case Report - ${selectedRecord?.caseType}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .section { margin-bottom: 20px; }
            .label { font-weight: bold; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          ${generatePDFContent(selectedRecord)}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <FaFilePdf className="text-red-500" />
          <span>Case Details & Documentation - {selectedRecord?.caseType}</span>
        </div>
      }
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="close" onClick={onCancel} size="large">
          Close
        </Button>,
        <Button 
          key="download" 
          type="primary" 
          onClick={handleDownloadPDF}
          size="large"
          style={{
            background: "linear-gradient(135deg, #f5222d 0%, #cf1322 100%)",
            border: "none"
          }}
        >
          📄 Download PDF
        </Button>
      ]}
      width={1000}
      // height={800}

      style={{ top: 20 }}
      className="pdf-modal"
    >
      {selectedRecord && (
        <div className="max-h-[calc(100vh-200px)] overflow-y-auto">

          <div 
            dangerouslySetInnerHTML={{ 
              __html: generatePDFContent(selectedRecord) 
            }}
          />
        </div>
      )}
    </Modal>
  );
};

// Accept Modal Component


// Accept Modal Component
export const AcceptModal = ({ visible, onCancel, onOk, selectedRecord }) => {
  const [confirmationChecked, setConfirmationChecked] = useState(false);
  
  const handleOk = () => {
    if (!confirmationChecked) {
      message.warning('Please confirm that you have reviewed all case details.');
      return;
    }
    onOk();
    setConfirmationChecked(false);
  };

  const handleCancel = () => {
    setConfirmationChecked(false);
    onCancel();
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <span className="text-green-600">✓</span>
          <span>Approve & Send to Jury Panel</span>
        </div>
      }
      visible={visible}
      onCancel={handleCancel}
      width={700}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button
          key="approve"
          type="primary"
          onClick={handleOk}
          disabled={!confirmationChecked}
          style={{
            background: confirmationChecked 
              ? "linear-gradient(135deg, #52c41a 0%, #389e0d 100%)"
              : undefined,
            border: "none",
            borderRadius: "6px",
            fontWeight: "500",
          }}
        >
          Approve & Send to Jury
        </Button>,
      ]}
    >
      {selectedRecord && (
        <div className="space-y-4">
          <Card 
            title={
              <div className="flex items-center gap-2">
                <span className="text-green-600 text-lg">✅</span>
                <span>Case Approved for Jury Review</span>
              </div>
            }
            className="border-green-200"
          >
            <div className="bg-green-50 p-4 rounded-lg mb-4">
              <h4 className="font-semibold text-green-800 mb-3">📋 Case Summary</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><strong>Case Type:</strong> <span className="text-blue-700">{selectedRecord.caseType}</span></div>
                <div><strong>Initiator:</strong> <span className="text-blue-700">{selectedRecord.initiatorName}</span></div>
                <div><strong>Respondent:</strong> <span className="text-blue-700">{selectedRecord.respondentName}</span></div>
                <div><strong>Email:</strong> <span className="text-blue-700">{selectedRecord.email}</span></div>
                <div><strong>Moderator:</strong> <span className="text-blue-700">{selectedRecord.moderatorName}</span></div>
                <div><strong>Current Status:</strong> <span className="text-blue-700">{selectedRecord.status}</span></div>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">📋 Jury Review Process</h4>
              <ul className="text-green-700 text-sm space-y-1">
                <li>• 3 qualified jurors will independently review this case</li>
                <li>• Each juror will provide a detailed decision with reasoning</li>
                <li>• All jury feedback will be compiled for final administrative review</li>
                <li>• The case status will be updated to "Sent to Jury" immediately</li>
              </ul>
            </div>
            
            <div className="mt-4 flex items-center gap-2">
              <input 
                type="checkbox" 
                id="confirmation" 
                checked={confirmationChecked}
                onChange={(e) => setConfirmationChecked(e.target.checked)}
                className="w-4 h-4 text-green-600"
              />
              <label htmlFor="confirmation" className="text-sm text-gray-700">
                I confirm that I have thoroughly reviewed all case details and supporting documents
              </label>
            </div>
          </Card>
        </div>
      )}
    </Modal>
  );
};

// Jury Modal Component
export const JuryModal = ({ visible, onCancel, onSubmit, selectedRecord }) => {
  const [juryDecision, setJuryDecision] = useState("");
  const [juryReason, setJuryReason] = useState("");
  const [confidenceLevel, setConfidenceLevel] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");

  const handleSubmit = () => {
    if (!juryDecision || !juryReason.trim() || !confidenceLevel) {
      message.error('Please provide decision, detailed reasoning, and confidence level!');
      return;
    }
    
    const success = onSubmit(juryDecision, juryReason, confidenceLevel, additionalNotes);
    if (success) {
      setJuryDecision("");
      setJuryReason("");
      setConfidenceLevel("");
      setAdditionalNotes("");
    }
  };

  const handleCancel = () => {
    setJuryDecision("");
    setJuryReason("");
    setConfidenceLevel("");
    setAdditionalNotes("");
    onCancel();
  };

  const currentVoteCount = selectedRecord?.juryFeedback?.length || 0;
  const remainingVotes = 3 - currentVoteCount;

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <MdGavel className="text-purple-600 text-xl" />
          <span>Jury Decision Panel - Vote {currentVoteCount + 1} of 3</span>
        </div>
      }
      visible={visible}
      onCancel={handleCancel}
      onOk={handleSubmit}
      width={800}
      okText="⚖️ Submit Jury Decision"
      cancelText="Cancel"
      okButtonProps={{
        style: {
          background: "linear-gradient(135deg, #722ed1 0%, #531dab 100%)",
          border: "none",
          fontSize: "16px",
          height: "40px"
        },
        disabled: !juryDecision || !juryReason.trim() || !confidenceLevel
      }}
      cancelButtonProps={{
        style: {
          fontSize: "16px",
          height: "40px"
        }
      }}
    >
      {selectedRecord && (
        <div className="space-y-4">
          <Card className="border-l-4 border-l-purple-500">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-purple-700 mb-2">Case Under Jury Review</h3>
              <div className="flex items-center gap-4 text-sm">
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">Votes Cast: {currentVoteCount}/3</span>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">Remaining: {remainingVotes}</span>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-4 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-3">Case Information</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><strong>Case Type:</strong> <span className="text-gray-700">{selectedRecord.caseType}</span></div>
                <div><strong>Initiator:</strong> <span className="text-gray-700">{selectedRecord.initiatorName}</span></div>
                <div><strong>Respondent:</strong> <span className="text-gray-700">{selectedRecord.respondentName}</span></div>
                <div><strong>Moderator:</strong> <span className="text-gray-700">{selectedRecord.moderatorName}</span></div>
                <div><strong>Email:</strong> <span className="text-gray-700">{selectedRecord.email}</span></div>
                <div><strong>Current Status:</strong> <span className="text-gray-700">{selectedRecord.status}</span></div>
              </div>
            </div>
            
            {/* Previous Jury Decisions */}
            {selectedRecord.juryFeedback && selectedRecord.juryFeedback.length > 0 && (
              <div className="mt-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg">
                <h4 className="font-semibold text-indigo-800 mb-3">Previous Jury Decisions</h4>
                {selectedRecord.juryFeedback.map((feedback, index) => (
                  <div key={index} className="mb-3 p-3 bg-white rounded border border-indigo-100">
                    <div className="flex items-center gap-2 mb-2">
                      <strong>Juror {feedback.jurorId}:</strong> 
                      <Tag color={feedback.decision === 'approve' ? 'green' : 'red'}>
                        {feedback.decision.toUpperCase()}
                      </Tag>
                    </div>
                    <p className="text-sm text-gray-600">{feedback.reason}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <h3 className="text-lg font-semibold text-blue-700 mb-4">Your Jury Decision</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Verdict Decision:</label>
                <Radio.Group 
                  value={juryDecision} 
                  onChange={(e) => setJuryDecision(e.target.value)}
                  className="w-full"
                >
                  <Space direction="vertical" className="w-full">
                    <Radio value="approve" className="p-3 border border-green-200 rounded-lg hover:bg-green-50">
                      <div>
                        <strong className="text-green-700">✓ APPROVE</strong>
                        <p className="text-sm text-gray-600 ml-6">Support the case/claim - Evidence is sufficient</p>
                      </div>
                    </Radio>
                    <Radio value="reject" className="p-3 border border-red-200 rounded-lg hover:bg-red-50">
                      <div>
                        <strong className="text-red-700">✗ REJECT</strong>
                        <p className="text-sm text-gray-600 ml-6">Do not support the case/claim - Evidence is insufficient</p>
                      </div>
                    </Radio>
                  </Space>
                </Radio.Group>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Confidence Level:</label>
                <Radio.Group 
                  value={confidenceLevel} 
                  onChange={(e) => setConfidenceLevel(e.target.value)}
                  className="w-full"
                >
                  <Space direction="horizontal" className="flex flex-wrap gap-2">
                    <Radio value="high" className="border border-green-200 rounded px-2 py-1">High Confidence</Radio>
                    <Radio value="medium" className="border border-yellow-200 rounded px-2 py-1">Medium Confidence</Radio>
                    <Radio value="low" className="border border-red-200 rounded px-2 py-1">Low Confidence</Radio>
                  </Space>
                </Radio.Group>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Detailed Reasoning (Required):
                </label>
                <TextArea
                  value={juryReason}
                  onChange={(e) => setJuryReason(e.target.value)}
                  placeholder="Provide detailed explanation for your decision. Include analysis of evidence, legal considerations, and reasoning behind your verdict..."
                  rows={4}
                  maxLength={1000}
                  showCount
                  className="border-2 border-gray-200 focus:border-blue-400"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Additional Notes (Optional):
                </label>
                <TextArea
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  placeholder="Any additional observations, recommendations, or concerns..."
                  rows={2}
                  maxLength={500}
                  showCount
                  className="border-2 border-gray-200 focus:border-blue-400"
                />
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-yellow-800 text-sm">
                  <strong>⚠️ Important:</strong> Your decision will be recorded permanently and cannot be changed. 
                  Please ensure you have thoroughly reviewed all case materials before submitting.
                </p>
              </div>
            </div>
          </Card>
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
        adminComments: '',
        finalResult: ''
      });
    }
  }, [visible, editForm]);

  const addInputField = () => {
    const newId = Math.max(...inputFields.map(field => field.id)) + 1;
    setInputFields([...inputFields, { id: newId, value: "" }]);
  };

  const removeInputField = (id) => {
    if (inputFields.length > 1) {
      setInputFields(inputFields.filter(field => field.id !== id));
    }
  };

  const updateInputField = (id, value) => {
    setInputFields(inputFields.map(field => 
      field.id === id ? { ...field, value } : field
    ));
  };

  const handleSubmit = () => {
    editForm.validateFields().then(values => {
      const hasValidDecision = inputFields.some(field => field.value.trim() !== "");
      
      if (!hasValidDecision) {
        message.error("Please provide at least one decision!");
        return;
      }

      const decisions = inputFields
        .filter(field => field.value.trim() !== "")
        .map(field => field.value.trim());

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
              <div><strong>Case Type:</strong> {selectedRecord.caseType}</div>
              <div><strong>Jury Votes:</strong> {selectedRecord.jurorVote}</div>
              <div><strong>Initiator:</strong> {selectedRecord.initiatorName}</div>
              <div><strong>Respondent:</strong> {selectedRecord.respondentName}</div>
            </div>
            
            {selectedRecord.juryFeedback && selectedRecord.juryFeedback.length > 0 && (
              <div>
                <h4 style={{ marginBottom: 12 }}>Jury Panel Decisions:</h4>
                {selectedRecord.juryFeedback.map((feedback, index) => (
                  <div key={index} className="mb-3 p-4 bg-gray-50 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <strong>Juror {feedback.jurorId}:</strong> 
                        <Tag color={feedback.decision === 'approve' ? 'green' : 'red'}>
                          {feedback.decision.toUpperCase()}
                        </Tag>
                        {feedback.confidenceLevel && (
                          <Tag color={feedback.confidenceLevel === 'high' ? 'blue' : feedback.confidenceLevel === 'medium' ? 'orange' : 'red'}>
                            {feedback.confidenceLevel.toUpperCase()} CONFIDENCE
                          </Tag>
                        )}
                      </div>
                      {feedback.timestamp && (
                        <span className="text-xs text-gray-500">
                          {new Date(feedback.timestamp).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-700">
                      <p className="mb-1"><strong>Reasoning:</strong> {feedback.reason}</p>
                      {feedback.additionalNotes && (
                        <p className="text-gray-600"><strong>Additional Notes:</strong> {feedback.additionalNotes}</p>
                      )}
                    </div>
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
                      onChange={(e) => updateInputField(field.id, e.target.value)}
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
                          style={{ minWidth: '32px' }}
                        />
                      ) : (
                        <>
                          <Button
                            type="primary"
                            icon={<FaPlus />}
                            size="large"

                            onClick={addInputField}
                            style={{ minWidth: '32px' }}
                          />
                          <Button
                            type="primary"
                            danger
                            icon={<FaMinus />}
                            size="large"
                            onClick={() => removeInputField(field.id)}
                            style={{ minWidth: '32px' }}
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
              <strong>Note:</strong> This final decision will be permanently recorded and the case will be marked as finalized. All parties will be notified of the outcome.
            </p>
          </div>
        </div>
      )}
    </Modal>
  );
};