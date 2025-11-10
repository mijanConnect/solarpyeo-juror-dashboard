import { Form, Input } from "antd";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import image4 from "../../assets/image4.png";
import FormItem from "../../components/common/FormItem";
import { useLoginMutation } from "../../redux/apiSlices/authSlice";

const Login = () => {
  const navigate = useNavigate();

  const [login, { isLoading, isSuccess, error, data }] = useLoginMutation();

  const onFinish = async (values) => {
    try {
      // Call the login mutation with email and password
      const response = await login({
        email: values.email,
        password: values.password,
      }).unwrap();

      if (response.success) {
        const token = response.data.accessToken;
        const refreshToken = response.data.refreshToken;

        localStorage.setItem("token", token);
        if (refreshToken) {
          localStorage.setItem("refreshToken", refreshToken);
        }

        // Dispatch custom event to notify UserProvider of token change
        // Use setTimeout to ensure localStorage is updated first
        setTimeout(() => {
          window.dispatchEvent(new Event("tokenChange"));
        }, 0);

        if (response.data.accessToken) {
          navigate("/");
        }
      }
    } catch (err) {
      console.error("Login failed:", err);
      toast.error(err);
      // Error handling could be improved with user feedback
    }
  };

  return (
    <div>
      <div className="text-center mb-8">
        <img src={image4} alt="logo" className="h-40 w-40 mx-auto" />
        <h1 className="text-[25px] font-semibold mb-[10px] mt-[20px]">
          Admin Dashboard
        </h1>
        <p>Welcome back! Please enter your details.</p>
      </div>
      <Form onFinish={onFinish} layout="vertical">
        <FormItem
          name={"email"}
          label={"Email"}
          inputStyle={{ border: "1px solid #b91c1c" }}
        />

        <Form.Item
          name="password"
          label={<p>Password</p>}
          rules={[
            {
              required: true,
              message: "Please input your Password!",
            },
          ]}
        >
          <Input.Password
            type="password"
            placeholder="Enter your password"
            style={{
              height: 40,
              border: "1px solid #B91C1C",
              outline: "none",
              boxShadow: "none",
              borderRadius: "200px",
            }}
          />
        </Form.Item>

        <div className="flex items-center justify-between">
          <Form.Item
            style={{ marginBottom: 0 }}
            name="remember"
            valuePropName="checked"
          >
            {/* <Checkbox>Remember me</Checkbox> */}
          </Form.Item>

          <a
            className="login-form-forgot text-[#1E1E1E] hover:text-[#B91C1C] rounded-md font-semibold"
            href="/auth/forgot-password"
          >
            Forgot password
          </a>
        </div>

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
            className="flex items-center justify-center bg-[#B91C1C] rounded-lg"
          >
            Sign in
          </button>
        </Form.Item>
      </Form>
      {/* <Form.Item style={{ marginBottom: 0 }}>
          <button
            htmlType="submit"
            type="submit"
            style={{
              width: "100%",
              height: 45,
              color: "#1E1E1E",
              fontWeight: "400px",
              fontSize: "18px",
              marginTop: 20,
              borderRadius: "200px",
              border: "1px solid #B91C1C",
            }}
            className="flex items-center justify-center rounded-lg"
          >
            <img src={googleIcon} alt="Google logo" className="mr-[12px]" />
            Sign in with Google
          </button>
        </Form.Item> */}
      {/* <div className="mt-[20px]">
        <p className="text-center text-[#1E1E1E]">
          Don't have an account?{" "}
          <a
            href="/auth/signup"
            className="text-[#B91C1C] hover:text-[#1E1E1E] font-semibold"
          >
            Sign Up
          </a>
        </p>
      </div> */}
    </div>
  );
};

export default Login;
