import { Button, Modal } from "antd";
import { getImageUrl } from "../../common/imageUrl";

export default function InitialCustomPdfModal({
  visible,
  onCancel,
  selectedRecord,
}) {
  return (
    <Modal
      visible={!!visible}
      onCancel={onCancel}
      footer={
        <div className="flex justify-end gap-2">
          <Button onClick={onCancel}>Close</Button>
          <Button
            onClick={async () => {
              // generate PDF from the modal content with pagination + bleed
              const content = document.getElementById("custom-pdf-content");
              if (!content) {
                onCancel && onCancel();
                return;
              }

              // helper: copy computed styles from source -> target recursively
              const copyComputedStyles = (srcEl, tgtEl) => {
                try {
                  const computed = window.getComputedStyle(srcEl);
                  let cssText = "";
                  for (let i = 0; i < computed.length; i++) {
                    const prop = computed[i];
                    const val = computed.getPropertyValue(prop);
                    const prio = computed.getPropertyPriority(prop);
                    cssText += `${prop}: ${val}${prio ? " !important" : ""};`;
                  }
                  tgtEl.style.cssText = cssText;
                } catch (e) {
                  // ignore computed style errors
                }

                const srcChildren = srcEl.children || [];
                const tgtChildren = tgtEl.children || [];
                for (let i = 0; i < srcChildren.length; i++) {
                  if (tgtChildren[i])
                    copyComputedStyles(srcChildren[i], tgtChildren[i]);
                }
              };

              try {
                const html2canvas = await import("html2canvas");
                const { default: jsPDF } = await import("jspdf");

                // clone content to avoid changing visible UI and to apply print-safe styles
                const clone = content.cloneNode(true);
                clone.style.boxSizing = "border-box";
                clone.style.background = "#ffffff";
                clone.style.padding = "24px";
                clone.style.width = getComputedStyle(content).width;
                clone.style.maxHeight = "none";
                clone.style.height = "auto";
                clone.style.overflow = "visible";

                const wrapper = document.createElement("div");
                wrapper.style.position = "fixed";
                wrapper.style.left = "-9999px";
                wrapper.style.overflow = "visible";
                wrapper.appendChild(clone);
                document.body.appendChild(wrapper);

                // inline computed styles to ensure exact visual match
                copyComputedStyles(content, clone);

                // Remove overflow constraints from all elements
                clone.querySelectorAll("*").forEach((el) => {
                  const computed = window.getComputedStyle(el);
                  if (
                    computed.overflow === "hidden" ||
                    computed.overflow === "auto" ||
                    computed.maxHeight !== "none"
                  ) {
                    el.style.overflow = "visible";
                    el.style.maxHeight = "none";
                  }
                });

                // Inject a small print stylesheet into the clone so
                // ordered-list numbers and list text align correctly
                // in the PDF (doesn't change the on-screen modal).
                const printAlignStyle = document.createElement("style");
                printAlignStyle.type = "text/css";
                printAlignStyle.innerHTML = `
                  /* ensure list markers sit inline with text */
                  ol { list-style-position: inside !important; padding-left: 0 !important; margin-left: 0 !important; }
                  ol li { text-indent: 0 !important; margin-left: 0 !important; padding-left: 0 !important; }
                  /* ensure Tailwind list classes don't override this in capture */
                  .list-decimal { list-style-position: inside !important; }
                  /* avoid splitting list items across PDF page slices */
                  li { break-inside: avoid !important; page-break-inside: avoid !important; -webkit-column-break-inside: avoid !important; }
                `;
                clone.insertBefore(printAlignStyle, clone.firstChild);
                // add explicit numeric markers to ordered lists so numbers are captured reliably
                Array.from(clone.querySelectorAll("ol")).forEach((ol) => {
                  try {
                    ol.style.listStyle = "none";
                    const items = Array.from(ol.children).filter(
                      (c) => c.tagName === "LI"
                    );
                    items.forEach((li, i) => {
                      if (li.querySelector(".pdf-list-marker")) return;
                      const marker = document.createElement("span");
                      marker.className = "pdf-list-marker";
                      marker.textContent = i + 1 + ".\u00A0";
                      marker.style.display = "inline-block";
                      marker.style.width = "2em";
                      marker.style.textAlign = "right";
                      marker.style.paddingRight = "0.5em";
                      marker.style.flex = "none";
                      li.insertBefore(marker, li.firstChild);
                    });
                  } catch (e) {}
                });
                // add an invisible spacer at the bottom of the clone to provide bleed
                const bleedSpacer = document.createElement("div");
                bleedSpacer.style.width = "100%";
                bleedSpacer.style.height = "250px";
                bleedSpacer.style.background = "transparent";
                clone.appendChild(bleedSpacer);

                // Wait a moment for layout to settle
                await new Promise((resolve) => setTimeout(resolve, 100));

                const canvas = await html2canvas.default(clone, {
                  scale: 2,
                  useCORS: true,
                  backgroundColor: "#ffffff",
                  windowHeight: clone.scrollHeight,
                  height: clone.scrollHeight,
                });

                // cleanup clone
                document.body.removeChild(wrapper);

                const pdf = new jsPDF("p", "pt", "a4");
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = pdf.internal.pageSize.getHeight();
                // increase bleed/margin on the generated PDF
                const margin = 40; // pt

                const canvasWidth = canvas.width;
                const canvasHeight = canvas.height;

                // ratio to convert canvas px -> pdf pt
                const ratio = canvasWidth / (pdfWidth - margin * 2);
                // compute slice height in canvas-pixels for one PDF page (accounting for margins)
                const pageCanvasHeight = Math.round(
                  (pdfHeight - margin * 2) * ratio
                );
                // larger overlap to avoid cutting text/lines across pages
                const overlap = 48; // px overlap between slices to avoid cutting lines

                let y = 0;
                let pageIndex = 0;
                while (y < canvasHeight) {
                  const remaining = canvasHeight - y;
                  const sliceHeight = Math.min(pageCanvasHeight, remaining);
                  let sliceHeightRounded = Math.round(sliceHeight);
                  const yRounded = Math.round(y);
                  // clamp final slice to remaining pixels to avoid overshoot
                  if (yRounded + sliceHeightRounded > canvasHeight) {
                    sliceHeightRounded = canvasHeight - yRounded;
                  }

                  const pageCanvas = document.createElement("canvas");
                  pageCanvas.width = canvasWidth;
                  pageCanvas.height = sliceHeightRounded;
                  const ctx = pageCanvas.getContext("2d");
                  ctx.fillStyle = "#ffffff";
                  ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
                  ctx.drawImage(
                    canvas,
                    0,
                    yRounded,
                    canvasWidth,
                    sliceHeightRounded,
                    0,
                    0,
                    canvasWidth,
                    sliceHeightRounded
                  );

                  const imgData = pageCanvas.toDataURL("image/jpeg", 1.0);
                  const imgHeight = sliceHeightRounded / ratio;

                  if (pageIndex > 0) pdf.addPage();
                  pdf.addImage(
                    imgData,
                    "JPEG",
                    margin,
                    margin,
                    pdfWidth - margin * 2,
                    imgHeight
                  );

                  // advance y but keep a small overlap to prevent cutting content
                  if (y + sliceHeight >= canvasHeight) {
                    y += sliceHeight;
                  } else {
                    y += sliceHeight - overlap;
                  }
                  pageIndex += 1;
                }

                const filename =
                  (selectedRecord?.caseId || "submission") + ".pdf";
                pdf.save(filename);
              } catch (err) {
                // Fallback: print using an off-screen iframe so we don't open a new tab/window
                try {
                  const iframe = document.createElement("iframe");
                  iframe.style.position = "fixed";
                  iframe.style.width = "0";
                  iframe.style.height = "0";
                  iframe.style.left = "-9999px";
                  iframe.style.top = "0";
                  iframe.setAttribute("aria-hidden", "true");
                  document.body.appendChild(iframe);

                  const idoc = iframe.contentWindow || iframe.contentDocument;
                  const doc = idoc.document || idoc;

                  doc.open();
                  doc.write("<html><head><title>Print</title>");
                  // copy styles into iframe
                  Array.from(
                    document.querySelectorAll('link[rel="stylesheet"], style')
                  ).forEach((node) => {
                    doc.write(node.outerHTML);
                  });
                  doc.write("</head><body>");
                  doc.write(content.innerHTML);
                  doc.write("</body></html>");
                  doc.close();

                  // wait for iframe to render then call print on its window
                  const printAndCleanup = () => {
                    try {
                      (iframe.contentWindow || iframe).focus();
                      (iframe.contentWindow || iframe).print();
                    } catch (e) {
                      // ignore print errors
                    }
                    // remove iframe after a short delay to allow print to start
                    setTimeout(() => {
                      try {
                        document.body.removeChild(iframe);
                      } catch (e) {}
                    }, 1000);
                  };

                  // If iframe content may still be loading (images/fonts), wait a bit
                  const iframeLoadTimeout = setTimeout(printAndCleanup, 500);
                  iframe.onload = () => {
                    clearTimeout(iframeLoadTimeout);
                    printAndCleanup();
                  };
                } catch (e) {
                  // If even iframe printing fails, fall back to alerting the user
                  // eslint-disable-next-line no-alert
                  alert("Unable to print or generate PDF in this browser.");
                }
              }
            }}
          >
            Print PDF
          </Button>
        </div>
      }
      width={800}
      title={selectedRecord?.caseType || "Submission PDF"}
    >
      <div id="custom-pdf-content">
        {/* Case ID */}
        <h1 className="text-center font-bold text-lg border-b-2 pb-2 mt-4 mb-4 border-black">
          {selectedRecord?.caseId || "N/A"}
        </h1>
        <div className="flex justify-between border-b-2 pb-1 mb-2 border-black">
          {/* Initiator Details */}
          <div className="mb-4">
            <div>
              <h2 className="font-semibold uppercase text-lg mb-2">
                Initiator
              </h2>
              <p className="text-[16px]">
                <strong>Name:</strong> {selectedRecord?.user?.name || "N/A"}
              </p>
              <p className="text-[16px]">
                <strong>DOB:</strong>{" "}
                {selectedRecord?.user?.dob || "00/00/0000"}
              </p>
            </div>
          </div>

          {/* Respondent Details */}
          <div className="mb-4">
            <div>
              <h2 className="font-semibold uppercase text-lg mb-2">
                Respondent
              </h2>
              <p className="text-[16px]">
                <strong>Name:</strong> {selectedRecord?.user?.name || "N/A"}
              </p>
              <p className="text-[16px]">
                <strong>DOB:</strong>{" "}
                {selectedRecord?.user?.dob || "00/00/0000"}
              </p>
            </div>
          </div>
        </div>
        <h1 className="text-center text-lg font-semibold border-b-2 pb-3 mb-2 border-black">
          {selectedRecord?.createdAt
            ? new Date(selectedRecord.createdAt).toLocaleString("en-US", {
                month: "2-digit",
                day: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })
            : "10/12/2025 06:33 AM"}
        </h1>

        <p className="text-center font-bold text-xl mb-2">
          INITIAL SUBMISSION FORM
        </p>
        {/* Allegation Summary */}
        <div className="mb-4">
          <h3 className="text-center font-bold text-lg mb-2">
            ALLEGATION SUMMARY
          </h3>
          <ol className="list-decimal pl-6">
            {selectedRecord?.allegation &&
            selectedRecord.allegation.length > 0 ? (
              selectedRecord.allegation.map((item, index) => (
                <li key={index} className="mb-1">
                  {item}
                </li>
              ))
            ) : (
              <>
                <li className="mb-1">
                  While traveling for work in March, I found intimate photos of
                  RESPONDENT with RESPONDENT's ex-boyfriend, taken in our
                  bedroom. Metadata shows the images were created March 14th at
                  11:45 p.m., a night I was in Houston for business. Photos
                  attached as Photos.zip.
                </li>
                <li className="mb-1">
                  2.Texts between RESPONDENT and RESPONDENT's ex showed planning
                  for PARTY ONE to "come over after INITIATOR leaves."
                  Screenshots are uploaded as Exhibit 1.pdf.
                </li>
              </>
            )}
          </ol>
        </div>

        {/* Jury Panel Decisions: */}
        <div className="mb-4">
          <h3 className="text-center font-bold text-lg mb-2">
            JURY PANEL DECISIONS
          </h3>
          {selectedRecord?.jurorDecisions &&
          selectedRecord.jurorDecisions.length > 0 ? (
            <ul className="pl-6">
              {selectedRecord.jurorDecisions.map((decision, index) => (
                <li key={index} className="mb-2">
                  <p>
                    <strong>Juror:</strong> {decision.juror?.name || "N/A"}
                  </p>
                  <p>
                    <strong>Action:</strong> {decision.action || "N/A"}
                  </p>
                  <p>
                    <strong>Comment:</strong> {decision.comment || "N/A"}
                  </p>
                  <p>
                    <strong>Voted At:</strong>{" "}
                    {decision.votedAt
                      ? new Date(decision.votedAt).toLocaleString("en-US", {
                          month: "2-digit",
                          day: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })
                      : "N/A"}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500">No jury decisions yet</p>
          )}
        </div>
        {/* Admin Decision */}
        <div className="mb-4">
          <h3 className="text-center font-bold text-lg mb-2">ADMIN DECISION</h3>
          {selectedRecord?.adminDecisions &&
          selectedRecord.adminDecisions.length > 0 ? (
            <ol className="list-decimal pl-6">
              {selectedRecord.adminDecisions.map((decision, index) => (
                <li key={index} className="mb-1">
                  {decision}
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-center text-gray-500">No admin decision yet</p>
          )}
        </div>
        {/* PERJURY DECLARATION */}
        <div className="mb-4">
          <h3 className="text-center font-bold text-lg mb-2">
            PERJURY DECLARATION
          </h3>
          <p>
            I,{" "}
            <span className="font-semibold">{selectedRecord?.user?.name}</span>,
            the Initiator in this submission and associated case, hereby declare
            and affirm in accordance with the laws of the jurisdiction(s)
            involved,{" "}
            <span className="font-semibold">UNDER PENALTY OF PERJURY</span>,
            that the foregoing is true and accurate and a I have good-faith
            basis to the allegations to the best of my knowledge.
          </p>
        </div>

        {/* Initiator Signature */}
        <div className="flex justify-end mt-12">
          <div className="mr-12 flex flex-col items-center">
            <p className="border-b-2 pb-2 border-black inline-block">
              {selectedRecord?.user?.name}
            </p>
            <h3 className="font-bold text-lg">INITIATOR</h3>
          </div>
        </div>

        {/* EVIDENCE ATTACHMENTS */}
        <div className="mb-4 mt-4">
          <h3 className="text-center font-bold text-lg mb-2">
            EVIDENCE ATTACHMENTS
          </h3>
          <ol className="list-decimal pl-6">
            {selectedRecord?.evidence &&
              selectedRecord.evidence.length > 0 &&
              selectedRecord.evidence.map((file, index) => (
                <li key={index} className="mb-1">
                  <a
                    href={getImageUrl(file)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {file.split("/").pop()}
                  </a>
                </li>
              ))}
          </ol>
        </div>
        {/* {selectedRecord && (
          <div className="mb-4">
            <strong>Initiator:</strong>{" "}
            {selectedRecord.user?.name || selectedRecord.initiatorName || "N/A"}
            <br />
            <strong>Respondent:</strong>{" "}
            {selectedRecord.respondentFastName ||
              selectedRecord.respondentName ||
              "N/A"}
          </div>
        )} */}
      </div>
    </Modal>
  );
}
