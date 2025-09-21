import { Button, Card, Form, Input } from "antd";
import Icon, { ArrowLeftOutlined, BackwardOutlined } from "@ant-design/icons";

const getValidationRules = (type) => {
  const rules = {
    phoneNumber: [
      { required: true, message: "Please enter your phone number" },
      {
        pattern: /^\+84[3-9][0-9]{8}$/,
        message:
          "Phone number must start with +84 and follow format +84xxxxxxxxx!",
      },
    ],
    email: [
      { required: true, message: "Please enter your email" },
      {
        type: "email",
        message: "Invalid email!",
      },
    ],
    code: [{ required: true, message: "Please enter your code" }],
  };
  return rules[type] || [];
};

const getFormConfig = (type) => {
  const configs = {
    phoneNumber: {
      title: "Sign In",
      description: "Please enter your phone number to sign in",
      label: "Phone Number",
      placeholder: "Your phone number, e.g., +84123456789",
      name: "phoneNumber",
      rules: getValidationRules("phoneNumber"),
      footerText: "Are you Employee? ",
    },
    email: {
      title: "Sign In",
      description: "Please enter your email to sign in",
      label: "Email",
      placeholder: "Enter Your email",
      name: "email",
      rules: getValidationRules("email"),
    },
    code: {
      title: "Enter Code",
      description: "Please enter the 6-digit code sent",
      label: "Verification Code",
      placeholder: "Enter 6-digit code",
      name: "code",
      rules: getValidationRules("code"),
    },
  };
  return configs[type] || {};
};

function AppForm({ formType, onSubmit, onBack, footerAction, loading }) {
  const [form] = Form.useForm();
  const config = getFormConfig(formType);

  const handleSubmit = (values) => {
    onSubmit(values, formType);
  };

  const handleBack = () => {
    onBack();
  };

  return (
    <Card style={{ width: 400, height: 300, margin: "0 auto", marginTop: 100 }}>
      {formType !== "phoneNumber" && (
        <span
          onClick={handleBack}
          className="flex gap-2 items-center mb-4 cursor-pointer"
        >
          <Icon component={ArrowLeftOutlined} style={{ fontSize: 15 }} />
          <p>Back</p>
        </span>
      )}
      <div className="mb-4 text-center">
        <h3 className="text-2xl font-bold mb-2 text-center">Sign In</h3>
        <span className="text-sm text-gray-500">{config.description}</span>
      </div>
      <Form form={form} onFinish={handleSubmit}>
        <Form.Item label={config.label} name={config.name} rules={config.rules}>
          <Input
            className="h-10"
            type={config.inputType || "text"}
            placeholder={config.placeholder}
          />
        </Form.Item>
        <Form.Item>
          <Button
            className="w-full"
            size="large"
            type="primary"
            htmlType="submit"
            loading={loading}
          >
            Login
          </Button>
        </Form.Item>
        <span>
          {config?.footerText}
          <span>
            {formType === "phoneNumber" && (
              <span
                className="text-blue-500 cursor-pointer"
                onClick={() => footerAction()}
              >
                Login as Employee
              </span>
            )}
          </span>
        </span>
      </Form>
    </Card>
  );
}

export default AppForm;
