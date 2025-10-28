import { Form, Input, Select, Upload } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import { UploadOutlined } from "@ant-design/icons";
import Swal from "sweetalert2"; // ✅ import SweetAlert2

const { Option } = Select;

const ShopInfo = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    console.log("Form values:", values);

    // ✅ Show SweetAlert on form submit
    Swal.fire({
      title: "Your Profile is Under Review",
      text: "Your application is under review. Please wait for admin approval.",
      icon: "warning",
      confirmButtonText: "Done",
    }).then(() => {
      // Navigate after closing the alert
      navigate("/auth/login");
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="text-center mb-2">
        <h1 className="text-[25px] font-semibold mb-[10px] mt-[20px]">
          Enter your Shop Information
        </h1>
        <p className="mb-6">
          Provide your shop details to get started and make your store ready for
          customers.
        </p>
      </div>

      {/* Form */}
      <Form onFinish={onFinish} layout="vertical" className="mb-14">
        {/* Business Name */}
        <Form.Item
          name="businessName"
          rules={[{ required: true, message: "Please enter business name" }]}
        >
          <Input
            placeholder="Enter Business Name"
            style={{
              height: 40,
              border: "1px solid #3FAE6A",
              borderRadius: "200px",
            }}
          />
        </Form.Item>

        {/* Website URL */}
        <Form.Item
          name="website"
          rules={[{ required: true, message: "Please enter website URL" }]}
        >
          <Input
            placeholder="Enter Website URL"
            style={{
              height: 40,
              border: "1px solid #3FAE6A",
              borderRadius: "200px",
            }}
          />
        </Form.Item>

        {/* Country Dropdown */}
        <Form.Item
          name="country"
          rules={[{ required: true, message: "Please select your country" }]}
        >
          <Select
            placeholder="Select Your Country"
            className="custom-select"
            dropdownClassName="custom-dropdown"
            style={{
              height: 40,
            }}
          >
            <Option value="usa">United States</Option>
            <Option value="uk">United Kingdom</Option>
            <Option value="india">India</Option>
          </Select>
        </Form.Item>

        {/* City Dropdown */}
        <Form.Item
          name="city"
          rules={[{ required: true, message: "Please select your city" }]}
        >
          <Select
            placeholder="Select Your City"
            className="custom-select"
            dropdownClassName="custom-dropdown"
            style={{
              height: 40,
            }}
          >
            <Option value="newyork">New York</Option>
            <Option value="london">London</Option>
            <Option value="delhi">Delhi</Option>
          </Select>
        </Form.Item>

        {/* Services Dropdown */}
        <Form.Item
          name="services"
          rules={[{ required: true, message: "Please select your services" }]}
        >
          <Select
            placeholder="Select Your Services"
            className="custom-select"
            dropdownClassName="custom-dropdown"
            style={{
              height: 40,
            }}
          >
            <Option value="food">Food Delivery</Option>
            <Option value="grocery">Grocery</Option>
            <Option value="electronics">Electronics</Option>
          </Select>
        </Form.Item>

        {/* Upload Logo */}
        <Form.Item
          name="logo"
          rules={[{ required: true, message: "Please upload your logo" }]}
          style={{ marginBottom: 24 }}
        >
          <Upload
            beforeUpload={() => false}
            maxCount={1}
            className="w-full"
            accept=".jpg,.jpeg,.png" // ✅ Only allow JPG/PNG files
          >
            <button
              type="button"
              style={{
                width: "100%",
                height: 40,
                border: "1px solid #3FAE6A",
                borderRadius: "200px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "#fff",
                cursor: "pointer",
                padding: "0 16px",
              }}
            >
              <div className="flex items-center justify-between w-full gap-12">
                <span>Upload Logo</span>
                <UploadOutlined />
              </div>
            </button>
          </Upload>
        </Form.Item>

        {/* Shop Address */}
        <Form.Item
          name="address"
          rules={[
            { required: true, message: "Please enter your shop address" },
          ]}
          style={{ marginBottom: 24 }}
        >
          <Input.TextArea
            placeholder="Enter Your Shop Address"
            rows={4}
            style={{
              border: "1px solid #3FAE6A",
              borderRadius: "15px",
            }}
          />
        </Form.Item>

        {/* Submit button */}
        <Form.Item style={{ marginBottom: 0 }}>
          <button
            htmlType="submit"
            type="submit"
            style={{
              width: "100%",
              height: 45,
              color: "white",
              fontWeight: "400px",
              marginTop: 20,
              borderRadius: "200px",
            }}
            className="flex items-center justify-center bg-[#3FAE6A] rounded-lg"
          >
            Continue
          </button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ShopInfo;
