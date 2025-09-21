import Icon, { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, Modal } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import { registerAccount } from "../../../apis/commonAPI";
import { toast } from "react-toastify";
import { useState } from "react";
import { useEffect } from "react";

function EmployeeRegister() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const urlParams = searchParams.get("token");
    setToken(urlParams);
  }, [searchParams]);

  const handleSubmit = async (values) => {
    if (!token) {
      toast.error("Invalid or missing token");
      return;
    }
    try {
      const response = await registerAccount(values, token);
      if (response?.success) {
        toast.success("Register successfully");
        navigate("/employee-login");
      } else {
        toast.error(response?.message || "Register failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Register failed");
    }
  };

  return (
    <>
      <Card
        style={{ width: 400, height: 400, margin: "0 auto", marginTop: 100 }}
      >
        <div className="mb-4 text-center">
          <h3 className="text-2xl font-bold mb-2 text-center">Sign In</h3>
          <span className="text-sm text-gray-500">
            Please enter register value to sign in
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
            rules={[
              { required: true, message: "Please enter your password" },
              { min: 6, message: "Password must be at least 6 characters" },
            ]}
            type="password"
          >
            <Input
              type="password"
              className="h-10"
              placeholder={"Enter your password"}
            />
          </Form.Item>
          <Form.Item
            label={"Confirm Password"}
            name={"confirmPassword"}
            rules={[
              { required: true, message: "Please enter your password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match"));
                },
              }),
            ]}
            type="password"
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
              Register
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Modal
        open={isOpen}
        onCancel={() => setIsOpen(false)}
        onOk={() => navigate("/employee-login")}
        centered
      >
        You can only register once with this email. Please proceed to the login
        page.
      </Modal>
    </>
  );
}

export default EmployeeRegister;
