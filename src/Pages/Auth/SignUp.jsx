import { Form, Input } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import FormItem from "../../components/common/FormItem";
import image4 from "../../assets/image4.png";

const SignUp = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    console.log("Form values:", values);
    navigate("/auth/otp-verification");
  };

  return (
    <div>
      {/* Header */}
      <div className="text-center mb-2">
        <img src={image4} alt="logo" className="h-20 w-20 mx-auto" />
        <h1 className="text-[25px] font-semibold mb-[10px] mt-[20px]">
          Merchants Dashboard
        </h1>
        <p>Create an account</p>
      </div>

      {/* Form */}
      <Form onFinish={onFinish} layout="vertical" className="mb-14">
        {/* Name */}
        <Form.Item
          name="name"
          label={<p>Name</p>}
          rules={[{ required: true, message: "Please enter your name" }]}
        >
          <Input
            placeholder="Enter your name"
            style={{
              height: 40,
              border: "1px solid #3FAE6A",
              borderRadius: "200px",
            }}
          />
        </Form.Item>

        {/* Email */}
        <FormItem name={"email"} label={"Email"} />

        {/* Phone Number */}
        <Form.Item
          name="phone"
          label={<p>Phone Number</p>}
          rules={[
            { required: true, message: "Please enter your phone number" },
          ]}
        >
          <Input
            placeholder="Enter your phone number"
            style={{
              height: 40,
              border: "1px solid #3FAE6A",
              borderRadius: "200px",
            }}
          />
        </Form.Item>

        {/* Password */}
        <Form.Item
          name="password"
          label={<p>Password</p>}
          rules={[{ required: true, message: "Please enter your password" }]}
        >
          <Input.Password
            placeholder="Enter your password"
            style={{
              height: 40,
              border: "1px solid #3FAE6A",
              borderRadius: "200px",
            }}
          />
        </Form.Item>

        {/* Confirm Password */}
        <Form.Item
          name="confirmPassword"
          label={<p>Confirm Password</p>}
          dependencies={["password"]}
          rules={[
            { required: true, message: "Please confirm your password" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Passwords do not match"));
              },
            }),
          ]}
        >
          <Input.Password
            placeholder="Confirm your password"
            style={{
              height: 40,
              border: "1px solid #3FAE6A",
              borderRadius: "200px",
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
              fontSize: "18px",
              marginTop: 20,
              borderRadius: "200px",
            }}
            className="flex items-center justify-center bg-[#3FAE6A] rounded-lg"
          >
            Sign Up
          </button>
        </Form.Item>
      </Form>

      {/* Footer */}
      <div className="mt-[20px]">
        <p className="text-center text-[#1E1E1E]">
          Already have an account?{" "}
          <a
            href="/auth/login"
            className="text-[#3FAE6A] hover:text-[#1E1E1E] font-semibold"
          >
            Log in
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
