import { Form, Input, message } from "antd";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import keyIcon from "../../assets/key.png";
import { useResetPasswordMutation } from "../../redux/apiSlices/authSlice";

const SetPassword = () => {
  const email = new URLSearchParams(location.search).get("email");
  const navigate = useNavigate();

  const [resetPassword, { isLoading: isResetting }] =
    useResetPasswordMutation();

  const onFinish = async (values) => {
    const verifyToken = localStorage.getItem("verifyToken");
    const payload = {
      newPassword: values.newPassword,
      confirmPassword: values.confirmPassword,
    };

    try {
      const res = await resetPassword({
        body: payload,
        headers: { Authorization: `${verifyToken}` },
      }).unwrap();
      message.success(res?.message || "Password reset successful");
      localStorage.removeItem("verifyToken");
      navigate(`/auth/login`);
    } catch (err) {
      const errMsg =
        err?.data?.message || err?.message || "Failed to reset password";
      message.error(errMsg);
    }
  };

  return (
    <div>
      <img src={keyIcon} alt="KeyIcon" className="mb-[24px] mx-auto" />
      <div className="text-center mb-8">
        <h1 className="text-[25px] font-semibold mb-6">Set new password</h1>
        <p className="w-[90%] mx-auto text-base">
          Your new password must be different to previously used passwords.
        </p>
      </div>

      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="newPassword"
          label={
            <p
              style={{
                display: "block",
                color: "#5C5C5C",
              }}
              htmlFor="email"
              className="font-semibold "
            >
              New Password
            </p>
          }
          rules={[
            {
              required: true,
              message: "Please input your new Password!",
            },
          ]}
          style={{ marginBottom: 0 }}
        >
          <Input.Password
            type="password"
            placeholder="Enter New password"
            style={{
              border: "1px solid #E0E4EC",
              height: "52px",
              background: "white",
              borderRadius: "200px",
              outline: "none",
            }}
            className="mb-6"
          />
        </Form.Item>

        <Form.Item
          style={{ marginBottom: 0 }}
          label={
            <p
              style={{
                display: "block",
                color: "#5C5C5C",
              }}
              htmlFor="email"
              className="font-semibold"
            >
              Confirm Password
            </p>
          }
          name="confirmPassword"
          dependencies={["newPassword"]}
          hasFeedback
          rules={[
            {
              required: true,
              message: "Please confirm your password!",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The new password that you entered do not match!")
                );
              },
            }),
          ]}
        >
          <Input.Password
            type="password"
            placeholder="Enter Confirm password"
            style={{
              border: "1px solid #E0E4EC",
              height: "52px",
              background: "white",
              borderRadius: "200px",
              outline: "none",
            }}
            className="mb-6"
          />
        </Form.Item>

        <Form.Item>
          <button
            htmlType="submit"
            type="submit"
            style={{
              width: "100%",
              height: 45,
              color: "white",
              fontWeight: "400px",
              fontSize: "18px",
              borderRadius: "200px",
              marginTop: 20,
            }}
            className="flex items-center justify-center bg-primary rounded-lg"
          >
            Submit
          </button>
        </Form.Item>
      </Form>
      <div className="">
        <a
          href="/auth/login"
          className="flex items-center justify-center gap-1 text-[#667085] hover:text-primary text-center mt-4"
        >
          <ArrowLeft size={20} />
          <p>Back to log in</p>
        </a>
      </div>
    </div>
  );
};

export default SetPassword;
