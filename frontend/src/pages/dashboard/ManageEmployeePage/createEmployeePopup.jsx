import { Button, Form, Input, Modal, Select } from "antd";
import { useState } from "react";
import { CreateEmployee } from "../../../apis/ownerAPI";
import { PlusOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";

function CreateEmployeePopup({ onCreate, isOpen }) {
  const [isModalOpen, setIsModalOpen] = useState(isOpen);
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleCreate = async (values) => {
    try {
      await CreateEmployee(values);
      setIsModalOpen(false);
      toast.success("Employee created successfully");
      onCreate();
      form.resetFields();
    } catch (error) {
      console.error("Failed to create employee:", error);
      toast.error(error?.response?.data?.error || "Failed to create employee");
    }
  };

  return (
    <>
      <Button
        color="primary"
        onClick={showModal}
        variant="outlined"
        icon={<PlusOutlined />}
      >
        Create Employee
      </Button>
      <Modal
        title="Create Employee"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => {
            handleCreate(values);
          }}
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: "Please input the name!" }]}
              >
                <Input
                  size="large"
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Enter full name"
                />
              </Form.Item>
              <Form.Item
                label="Email Address"
                name="email"
                rules={[
                  { required: true, message: "Please input the email!" },
                  { type: "email", message: "Please enter a valid email!" },
                ]}
              >
                <Input
                  size="large"
                  type="email"
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Enter email address"
                />
              </Form.Item>
              <Form.Item label="Address" name="address">
                <Input
                  size="large"
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Enter address (optional)"
                />
              </Form.Item>
            </div>
            <div>
              <Form.Item
                label="Phone Number"
                name="phoneNumber"
                rules={[
                  {
                    required: true,
                    message: "Please enter your phone number",
                  },
                  {
                    pattern: /^\+84[3-9][0-9]{8}$/,
                    message:
                      "Phone number must start with +84 and follow format +84xxxxxxxxx!",
                  },
                ]}
              >
                <Input
                  size="large"
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Enter phone number in format +84xxxxxxxxx"
                />
              </Form.Item>
              <Form.Item
                label="Role"
                name="role"
                rules={[{ required: true, message: "Please select a role!" }]}
              >
                <Select
                  size="large"
                  className="w-full"
                  placeholder="Select a role"
                >
                  <Select.Option value="staff">Staff</Select.Option>
                  <Select.Option value="employee">Employee</Select.Option>
                </Select>
              </Form.Item>
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="primary" htmlType="submit">
              Create
            </Button>
            <Button onClick={handleCancel} className="ml-2">
              Cancel
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
}

export default CreateEmployeePopup;
