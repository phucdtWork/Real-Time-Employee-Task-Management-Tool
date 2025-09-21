import { Button, Form, Input, Modal, Select } from "antd";
import { useEffect, useState } from "react";
import { updateEmployee } from "../../../apis/ownerAPI";
import { toast } from "react-toastify";

function UpdatePopup({ record, onUpdate, isOpen }) {
  const [isModalOpen, setIsModalOpen] = useState(isOpen);
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      id: record?.id,
      name: record?.name,
      email: record?.email,
      address: record?.address,
      phoneNumber: record?.phoneNumber,
      role: record?.role,
    });
  }, [record, form]);

  const showModal = () => {
    setIsModalOpen(true);
    if (record) {
      form.setFieldsValue({
        id: record?.id,
        name: record?.name,
        email: record?.email,
        address: record?.address,
        phoneNumber: record?.phoneNumber,
        role: record?.role,
      });
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleUpdate = async (values) => {
    try {
      await updateEmployee(record.id, values);
      setIsModalOpen(false);
      onUpdate();
      toast.success("Employee updated successfully");
    } catch (error) {
      console.error("Failed to update employee:", error);
      toast.error("Failed to update employee");
    }
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Edit
      </Button>
      <Modal
        title="Update Employee"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          preserve={false}
          onFinish={(values) => {
            handleUpdate(values);
          }}
          initialValues={{
            id: record?.id,
            name: record?.name,
            email: record?.email,
            address: record?.address,
            phoneNumber: record?.phoneNumber,
            role: record?.role,
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
                />
              </Form.Item>
              <Form.Item label="Address" name="address">
                <Input
                  size="large"
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </Form.Item>
            </div>
            <div>
              <Form.Item
                label="Phone Number"
                name="phoneNumber"
                rules={[
                  { required: true, message: "Please input the phone number!" },
                ]}
              >
                <Input
                  size="large"
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your phone number",
                    },
                    {
                      pattern: /^(\+84|0)[3-9][0-9]{8}$/,
                      message: "Invalid phone number!",
                    },
                  ]}
                />
              </Form.Item>
              <Form.Item
                label="Role"
                name="role"
                rules={[{ required: true, message: "Please select a role!" }]}
              >
                <Select size="large" className="w-full">
                  <Select.Option value="staff">Staff</Select.Option>
                  <Select.Option value="employee">Employee</Select.Option>
                </Select>
              </Form.Item>
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="primary" htmlType="submit">
              Update
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

export default UpdatePopup;
