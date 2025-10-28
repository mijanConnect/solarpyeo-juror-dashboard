import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  DatePicker,
  InputNumber,
  Upload,
  Select,
  Checkbox,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;
const { Option } = Select;

const daysOptions = [
  { label: "Mon", value: "Monday" },
  { label: "Tue", value: "Tuesday" },
  { label: "Wed", value: "Wednesday" },
  { label: "Thu", value: "Thursday" },
  { label: "Fri", value: "Friday" },
  { label: "Sat", value: "Saturday" },
  { label: "Sun", value: "Sunday" },
];

const NewCampaign = ({ onSave, onCancel }) => {
  const [form] = Form.useForm();
  const [thumbnail, setThumbnail] = useState("");
  const [uploadedImage, setUploadedImage] = useState([]);

  const handleThumbnailChange = ({ file }) => {
    if (file.status === "done" || file.originFileObj) {
      const reader = new FileReader();
      reader.onload = (e) => setThumbnail(e.target.result);
      reader.readAsDataURL(file.originFileObj);
    }
  };

  const handleSubmit = (values) => {
    const [startDate, endDate] = values.dateRange || [];
    onSave({
      promotionName: values.promotionName,
      promotionType: values.promotionType,
      customerReach: values.customerReach,
      customerSegment: values.customerSegment,
      discountPercentage: values.discountPercentage,
      startDate: startDate ? startDate.format("YYYY-MM-DD") : null,
      endDate: endDate ? endDate.format("YYYY-MM-DD") : null,
      thumbnail,
      promotionDays: values.promotionDays || [],
    });
    form.resetFields();
    setThumbnail("");
  };

  // Image upload validation
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG files!");
    }
    return isJpgOrPng || Upload.LIST_IGNORE;
  };

  const handleUploadChange = ({ fileList }) => {
    setUploadedImage(fileList);
  };

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Add New Campaign</h2>
      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        <div className="flex flex-row justify-between gap-4">
          <div className="w-full">
            <Form.Item
              label="Promotion Name"
              name="promotionName"
              rules={[{ required: true }]}
            >
              <Input className="px-3" placeholder="Enter Promotion Name" />
            </Form.Item>

            <Form.Item
              label="Promotion Type"
              name="promotionType"
              rules={[{ required: true }]}
            >
              <Select placeholder="Select Promotion Type">
                <Option value="Seasonal">Seasonal</Option>
                <Option value="Referral">Referral</Option>
                <Option value="Flash Sale">Flash Sale</Option>
                <Option value="Loyalty">Loyalty</Option>
              </Select>
            </Form.Item>
          </div>

          <div className="w-full">
            <Form.Item
              label="Customer Reach"
              name="customerReach"
              rules={[{ required: true }]}
            >
              <InputNumber
                min={1}
                style={{ width: "100%" }}
                className="px-3"
                placeholder="Enter Customer Reach"
              />
            </Form.Item>

            <Form.Item
              name="customerSegment"
              label="Customer Segment"
              rules={[{ required: true, message: "Please select a segment" }]}
            >
              <Select placeholder="Select Customer Segment">
                <Select.Option value="New Customers">
                  New Customers
                </Select.Option>
                <Select.Option value="Returning Customers">
                  Returning Customers
                </Select.Option>
                <Select.Option value="Loyal Customers">
                  Loyal Customers
                </Select.Option>
                <Select.Option value="All Customers">
                  All Customers
                </Select.Option>
              </Select>
            </Form.Item>
          </div>

          <div className="w-full">
            <Form.Item
              label="Discount Percentage"
              name="discountPercentage"
              rules={[{ required: true }]}
            >
              <InputNumber
                min={1}
                max={100}
                style={{ width: "100%" }}
                className="px-3"
                placeholder="Enter Discount Percentage"
              />
            </Form.Item>

            <Form.Item
              label="Date Range"
              name="dateRange"
              rules={[{ required: true }]}
            >
              <RangePicker style={{ width: "100%" }} className="px-3" />
            </Form.Item>
          </div>
        </div>

        <div className="w-full mb-4">
          <Form.Item
            label="Select Promotion Days"
            name="promotionDays"
            rules={[
              { required: true, message: "Please select at least one day" },
            ]}
          >
            <Checkbox.Group options={daysOptions} className="flex gap-2" />
          </Form.Item>
        </div>

        <Form.Item name="image" label="Upload Image (JPG/PNG only)">
          <Upload
            listType="picture"
            fileList={uploadedImage}
            beforeUpload={(file) => {
              // Allow only JPG or PNG
              const isJpgOrPng =
                file.type === "image/jpeg" || file.type === "image/png";
              if (!isJpgOrPng) {
                message.error("You can only upload JPG/PNG files!");
              }

              // Limit file size to 2MB
              const isLt2M = file.size / 1024 / 1024 < 2;
              if (!isLt2M) {
                message.error("Image must be smaller than 2MB!");
              }

              // Only accept file if both conditions are true
              return isJpgOrPng && isLt2M;
            }}
            onChange={handleUploadChange}
            onRemove={(file) => {
              setUploadedImage((prev) =>
                prev.filter((f) => f.uid !== file.uid)
              );
            }}
            maxCount={1}
            accept=".jpg,.jpeg,.png" // Restrict file picker to JPG/PNG
          >
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
          <p className="text-sm text-gray-500 mt-1">
            Allowed file types: JPG, PNG. Maximum file size: 2MB.
          </p>
        </Form.Item>

        <div className="flex justify-end gap-2">
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="primary" htmlType="submit" className="bg-primary">
            Save
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default NewCampaign;
