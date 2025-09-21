import React, { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Button, DatePicker, Form, Modal, Input, Select } from "antd";
import { toast } from "react-toastify";
import { createTask } from "../../../apis/taskAPI";
import { getAllUsers } from "../../../apis/ownerAPI";

function CreateTask({ onCreate, employeeList }) {
  const { TextArea } = Input;

  const [isOpen, setIsOpen] = useState(false);

  const [form] = Form.useForm();

  const showModal = () => {
    setIsOpen(true);
  };

  const handleCancel = () => {
    setIsOpen(false);
    form.resetFields();
  };

  const handleCreate = async (values) => {
    try {
      await createTask(values);
      form.resetFields();
      onCreate();
      toast.success("Task created successfully!");
      setIsOpen(false);
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Failed to create task. Please try again.");
    }
  };

  return (
    <div className="">
      <Button
        color="primary"
        onClick={showModal}
        variant="outlined"
        icon={<PlusOutlined />}
      >
        Create Task
      </Button>
      <Modal
        title="Create Task"
        open={isOpen}
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
          <Form.Item
            label="Task Name"
            name="taskName"
            rules={[{ required: true, message: "Please input the name!" }]}
          >
            <Input
              size="large"
              type="text"
              placeholder="Enter task name"
              className="w-full p-2 border border-gray-300 rounded"
            />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <TextArea
              size="large"
              type="text"
              placeholder="Enter description"
              className="w-full p-2 border border-gray-300 rounded"
            />
          </Form.Item>
          <Form.Item
            label="Assigned To"
            name="assignedTo"
            rules={[{ required: true, message: "Please select a user!" }]}
          >
            <Select size="large" className="w-full" placeholder="Select a user">
              {employeeList.map((user) => (
                <Select.Option key={user.id} value={user.id}>
                  {user.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Due Date"
            name="dueDate"
            rules={[{ required: true, message: "Please select a due date!" }]}
          >
            <DatePicker
              disabledDate={(current) => current && current < Date.now()}
              className="w-full"
              size="large"
            />
          </Form.Item>

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
    </div>
  );
}

export default CreateTask;
