import { Button, Form, Input, message } from "antd";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import keyIcon from "../../assets/key.png";
import { useForgotPasswordMutation } from "../../redux/apiSlices/authSlice";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [forgotPassword, { isLoading: isSending }] =
    useForgotPasswordMutation();

  const onFinish = async (values) => {
    try {
      const payload = { email: values?.email };
      const res = await forgotPassword(payload).unwrap();
      // Optionally, check res.success or server message
      message.success(res?.message || "OTP sent to your email");
      navigate(`/auth/otp-verification?email=${encodeURIComponent(values?.email)}`);
    } catch (err) {
      const errMsg =
        err?.data?.message ||
        err?.message ||
        "Failed to send reset instructions";
      message.error(errMsg);
    }
  };

  return (
    <div>
      <img src={keyIcon} alt="KeyIcon" className="mb-[24px] mx-auto" />
      <div className="text-center mb-8">
        <h1 className="text-[25px] font-semibold mb-6">Forgot password?</h1>
        <p className="w-[90%] mx-auto text-base">
          No worries, we’ll send you reset instructions.
        </p>
      </div>

      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          label={<p>Email</p>}
          name="email"
          id="email"
          rules={[
            {
              required: true,
              message: "Please input your email!",
            },
          ]}
        >
          <Input
            placeholder="Enter your email address"
            style={{
              height: 45,
              border: "1px solid #d9d9d9",
              outline: "none",
              boxShadow: "none",
              borderRadius: "200px",
              borderColor: "#b91c1c",
            }}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={isSending}
            style={{
              height: 45,
              fontWeight: 400,
              fontSize: 18,
              borderRadius: 200,
              marginTop: 20,
            }}
            className="flex items-center justify-center bg-primary rounded-lg"
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
      <div className="">
        <Link
          to="/auth/login"
          className="flex items-center justify-center gap-1 text-[#667085] hover:text-primary text-center mt-4"
        >
          <ArrowLeft size={20} />
          <p>Back to log in</p>
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
