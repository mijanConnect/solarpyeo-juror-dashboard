import { Button, Modal } from "antd";
import html2pdf from "html2pdf.js";
import { useState } from "react";
import { FaFilePdf } from "react-icons/fa";
import { getImageUrl } from "../../common/imageUrl";
import { getStatusColor } from "./sampleData";

// Utility: Format ISO date/time into a readable local string
const formatDateTime = (value) => {
  if (!value) return "N/A";
  try {
    return new Date(value).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (e) {
    return value;
  }
};

// PDF Content Generator
const generatePDFContent = (record) => {
  const caseTypeTemplates = {
    "Medical Malpractice": `
      <div style="font-family: Arial, sans-serif; padding: 40px; line-height: 1.6;">
        <div style="text-align: center; border-bottom: 3px solid #1890ff; padding-bottom: 10px; margin-bottom: 15px;">
          <h1 style="color: #1890ff; margin: 0;">CASE REPORT</h1>
          <p style="color: #666; margin: 5px 0;">Case ID: ${
            record.caseId
          } | Generated: ${new Date().toLocaleDateString()}</p>
        </div>

        <div style="background: #f8f9fa; border-radius: 8px; padding: 10px; margin-bottom: 25px;">
          <h2 style="color: #1890ff; border-bottom: 2px solid #e6f7ff; padding-bottom: 10px;">Case Overview</h2>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px;">
            <div><strong>Initiator:</strong> ${record?.user?.name}</div>
            <div><strong>Respondent:</strong> ${
              record?.respondentFastName
            }</div>
            <div><strong>Email:</strong> ${record?.user?.email}</div>

            <div><strong>Submission Date:</strong> ${formatDateTime(
              record?.createdAt || record?.submittedDate
            )}</div>
            <div><strong>Status:</strong> <span style="background: ${
              record.status
            }; color: black; padding: 4px 8px; border-radius: 4px; font-size: 14px;">${
      record?.status
    }</span></div>
          </div>
        </div>

        <div style="margin-bottom: 25px;">
          <h3 style="color: #1890ff; margin-bottom: 5px;">Case Details</h3>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <p><strong>Incident Date:</strong> ${
              record?.evidence || "Not specified"
            }</p>
            <p><strong>Allegations:</strong> ${
              record?.allegation || "Not specified"
            }</p>
            <div><strong>Evidence:</strong><br />
              ${
                Array.isArray(record?.evidence)
                  ? record.evidence
                      .map(
                        (img) => `
                <div style="margin-right:8px; margin-top:8px; display:inline-block;vertical-align:top;">
                  <div style="width:180px;height:180px;border:1px solid #d9d9d9;border-radius:4px;overflow:hidden;cursor:pointer;transition:transform 0.2s;background:#f5f5f5;display:flex;align-items:center;justify-content:center;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                    <img src="${getImageUrl(
                      img
                    )}" alt="evidence" style="max-width:100%;max-height:100%;width:auto;height:auto;object-fit:contain;" />
                  </div>
                </div>`
                      )
                      .join("")
                  : record?.image
                  ? `<div style="margin-right:8px; margin-top:8px; display:inline-block;">
                      <div style="width:180px;height:180px;border:1px solid #d9d9d9;border-radius:4px;overflow:hidden;cursor:pointer;transition:transform 0.2s;background:#f5f5f5;display:flex;align-items:center;justify-content:center;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                        <img src="${getImageUrl(
                          record.image
                        )}" alt="evidence" style="max-width:100%;max-height:100%;width:auto;height:auto;object-fit:contain;" />
                      </div>
                    </div>`
                  : " <span style='color:#999'>Not specified</span>"
              }
            </div>
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
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 15px;">
            <div><strong>Initiator:</strong> ${record.initiatorName}</div>
            <div><strong>Respondent:</strong> ${record.respondentName}</div>
            <div><strong>Email:</strong> ${record.email}</div>
            <div><strong>Moderator:</strong> ${record.moderatorName}</div>
            <div><strong>Submission Date:</strong> ${formatDateTime(
              record.createdAt || record.submittedDate
            )}</div>
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
          <div><strong>Evidence:</strong><br />
            ${
              Array.isArray(record?.caseDetails?.evidence)
                ? record.caseDetails.evidence
                    .map(
                      (img) => `
              <div style="margin:8px;display:inline-block;vertical-align:top;">
                <div style="width:180px;height:180px;border:1px solid #d9d9d9;border-radius:4px;overflow:hidden;cursor:pointer;transition:transform 0.2s;background:#f5f5f5;display:flex;align-items:center;justify-content:center;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                  <img src="${getImageUrl(
                    img
                  )}" alt="evidence" style="max-width:100%;max-height:100%;width:auto;height:auto;object-fit:contain;" />
                </div>
              </div>`
                    )
                    .join("")
                : record.caseDetails?.evidence
                ? `<div style="margin:8px;display:inline-block;">
                    <div style="width:180px;height:180px;border:1px solid #d9d9d9;border-radius:4px;overflow:hidden;cursor:pointer;transition:transform 0.2s;background:#f5f5f5;display:flex;align-items:center;justify-content:center;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                      <img src="${getImageUrl(
                        record.caseDetails.evidence
                      )}" alt="evidence" style="max-width:100%;max-height:100%;width:auto;height:auto;object-fit:contain;" />
                    </div>
                  </div>`
                : " <span style='color:#999'>Not specified</span>"
            }
          </div>
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
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 15px;">
            <div><strong>Initiator:</strong> ${record.initiatorName}</div>
            <div><strong>Respondent:</strong> ${record.respondentName}</div>
            <div><strong>Email:</strong> ${record.email}</div>
            <div><strong>Moderator:</strong> ${record.moderatorName}</div>
            <div><strong>Submission Date:</strong> ${formatDateTime(
              record.createdAt || record.submittedDate
            )}</div>
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
          <div><strong>Evidence:</strong><br />
            ${
              Array.isArray(record?.caseDetails?.evidence)
                ? record.caseDetails.evidence
                    .map(
                      (img) => `
              <div style="margin:8px;display:inline-block;vertical-align:top;">
                <div style="width:180px;height:180px;border:1px solid #d9d9d9;border-radius:4px;overflow:hidden;cursor:pointer;transition:transform 0.2s;background:#f5f5f5;display:flex;align-items:center;justify-content:center;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                  <img src="${getImageUrl(
                    img
                  )}" alt="evidence" style="max-width:100%;max-height:100%;width:auto;height:auto;object-fit:contain;" />
                </div>
              </div>`
                    )
                    .join("")
                : record.caseDetails?.evidence
                ? `<div style="margin:8px;display:inline-block;">
                    <div style="width:180px;height:180px;border:1px solid #d9d9d9;border-radius:4px;overflow:hidden;cursor:pointer;transition:transform 0.2s;background:#f5f5f5;display:flex;align-items:center;justify-content:center;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                      <img src="${getImageUrl(
                        record.caseDetails.evidence
                      )}" alt="evidence" style="max-width:100%;max-height:100%;width:auto;height:auto;object-fit:contain;" />
                    </div>
                  </div>`
                : " <span style='color:#999'>Not specified</span>"
            }
          </div>
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

export const PDFModal = ({ visible, onCancel, selectedRecord }) => {
  const [previewImage, setPreviewImage] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);

  const handleImageClick = (imgUrl) => {
    setPreviewImage(imgUrl);
    setPreviewVisible(true);
  };

  const handleDownloadPDF = () => {
    if (!selectedRecord) return;
    // Create temporary container for html2pdf
    const container = document.createElement("div");
    container.style.padding = "24px";
    container.style.background = "#ffffff";
    container.style.fontFamily = "Arial, sans-serif";
    container.innerHTML = generatePDFContent(selectedRecord);
    document.body.appendChild(container);

    const fileName = `Case-${(selectedRecord.caseType || "Report").replace(
      /\s+/g,
      "_"
    )}-${selectedRecord.caseId || selectedRecord.id || Date.now()}.pdf`;

    html2pdf()
      .set({
        margin: 0.1,
        filename: fileName,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
          allowTaint: true,
          letterRendering: true,
          imageTimeout: 15000,
        },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
        pagebreak: { mode: ["css", "legacy"] },
      })
      .from(container)
      .save()
      .finally(() => {
        document.body.removeChild(container);
      });
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <FaFilePdf className="text-red-500" />
          <span>Case Details & Documentation</span>
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
            border: "none",
          }}
        >
          📄 Download PDF
        </Button>,
      ]}
      width={1000}
      style={{ top: 20 }}
      className="pdf-modal"
    >
      {selectedRecord && (
        <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
          <div
            dangerouslySetInnerHTML={{
              __html: generatePDFContent(selectedRecord),
            }}
            onClick={(e) => {
              // Check if clicked element is an image
              if (e.target.tagName === "IMG" && e.target.alt === "evidence") {
                handleImageClick(e.target.src);
              }
            }}
            style={{ cursor: "default" }}
          />
        </div>
      )}

      {/* Image Preview Modal */}
      <Modal
        visible={previewVisible}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        width="auto"
        centered
        bodyStyle={{ padding: 0 }}
      >
        <img
          src={previewImage}
          alt="Preview"
          style={{ width: "100%", maxHeight: "80vh", objectFit: "contain" }}
        />
      </Modal>
    </Modal>
  );
};

export default PDFModal;
