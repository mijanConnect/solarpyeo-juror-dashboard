import { Select } from "antd";
import { useState } from "react";
import InitialSubmission from "./initial/InitialSubmission";
import MisuseSubmission from "./misuse/MisuseSubmission";
import AppealSubmission from "./appeal/AppealSubmission";
import RespondentSubmission from "./respondent/RespondentSubmission";

export default function SubmmissionManagement() {
  const [selected, setSelected] = useState("initial");

  return (
    <div>
      {/* Dropdown to pick which submission component to show */}
      <div className="">
        <div className="flex items-center justify-end gap-2">
          <label
            htmlFor="submission-select"
            className="!text-[20px] font-bold "
          >
            Select Type:
          </label>

          <Select
            id="submission-select"
            value={selected}
            onChange={(value) => setSelected(value)}
            style={{ width: 300, height: 40 }}
            options={[
              { label: "Initial Submission", value: "initial" },
              { label: "Misuse Submission", value: "misuse" },
              { label: "Appeal Submission", value: "appeal" },
              { label: "Respondent Submission", value: "respondent" },
            ]}
          />
        </div>
      </div>

      {/* Render only the selected component */}
      {selected === "initial" && <InitialSubmission />}
      {selected === "misuse" && <MisuseSubmission />}
      {selected === "appeal" && <AppealSubmission />}
      {selected === "respondent" && <RespondentSubmission />}
    </div>
  );
}
