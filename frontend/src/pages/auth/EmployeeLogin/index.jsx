import { Button, Card, Form, Input } from "antd";
import Icon, { ArrowLeftOutlined, BackwardOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { employeeLogin } from "../../../apis/commonAPI";
import checkCurrentUser from "../../../utils/checkCurrentUser";
import { useEffect } from "react";

function EmployeeLogin() {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleNavigateByRole = () => {
    if (checkCurrentUser("owner")) {
      navigate("/manage-employee");
    } else {
      navigate("/manage-tasks");
    }
  };

  const token = localStorage.getItem("access_token");

  useEffect(() => {
    if (token) {
      handleNavigateByRole();
    }
  }, [token]);

  const handleSubmit = async (values) => {
    try {
      const response = await employeeLogin(values);
      if (response?.success) {
        toast.success("Login successfully");
        localStorage.setItem("phoneNumber", response.phoneNumber);
        localStorage.setItem("role", response.role);
        localStorage.setItem("access_token", response.token);
        if (response.role === "owner") {
          navigate("/manage-employee");
        } else {
          navigate("/manage-task");
        }
      } else {
        toast.error(response?.data.error || "Something went wrong");
      }
    } catch (error) {
      toast.error(error.response.data.error || "Something went wrong");
    }
  };

  const handleBack = () => {
    navigate(-1);
  };
  return (
    <Card style={{ width: 400, height: 400, margin: "0 auto", marginTop: 100 }}>
      <span
        onClick={handleBack}
        className="flex gap-2 items-center mb-4 cursor-pointer"
      >
        <Icon component={ArrowLeftOutlined} style={{ fontSize: 15 }} />
        <p>Back</p>
      </span>
      <div className="mb-4 text-center">
        <h3 className="text-2xl font-bold mb-2 text-center">Sign In</h3>
        <span className="text-sm text-gray-500">
          Please enter your username and password to sign in
        </span>
      </div>
      <Form form={form} onFinish={handleSubmit}>
        <Form.Item
          label={"User name"}
          name={"username"}
          rules={[{ required: true, message: "Please enter your username" }]}
        >
          <Input className="h-10" placeholder={"Enter your username"} />
        </Form.Item>
        <Form.Item
          label={"Password"}
          name={"password"}
          rules={[{ required: true, message: "Please enter your password" }]}
        >
          <Input
            type="password"
            className="h-10"
            placeholder={"Enter your password"}
          />
        </Form.Item>
        <Form.Item>
          <Button
            className="w-full"
            size="large"
            type="primary"
            htmlType="submit"
          >
            Login
          </Button>
        </Form.Item>
        <span>
          Try another way to sign in.
          <span>
            <Link to="/employee-login-email">With email</Link>
          </span>
        </span>
      </Form>
    </Card>
  );
}

export default EmployeeLogin;
