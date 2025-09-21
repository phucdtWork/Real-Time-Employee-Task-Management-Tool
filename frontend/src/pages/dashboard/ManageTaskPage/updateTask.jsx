import React, { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Button, DatePicker, Form, Modal, Input, Select } from "antd";
import { toast } from "react-toastify";
import { updateTask } from "../../../apis/taskAPI";
import moment from "moment";

function UpdateTask({ record, onUpdate, employeeList }) {
  const { TextArea } = Input;

  const [isOpen, setIsOpen] = useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      id: record?.id,
      taskName: record?.taskName,
      description: record?.description,
      dueDate: record?.dueDate ? moment(record.dueDate) : null,
      assignedTo: record?.assignedTo,
    });
  }, [record, form]);

  const showModal = () => {
    setIsOpen(true);
    if (record) {
      form.setFieldsValue({
        id: record?.id,
        taskName: record?.taskName,
        description: record?.description,
        dueDate: record?.dueDate ? moment(record.dueDate) : null,
        assignedTo: record?.assignedTo,
      });
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    form.resetFields();
  };

  const handleUpdate = async (values) => {
    try {
      await updateTask(record.id, values);
      form.resetFields();
      onUpdate();
      toast.success("Task updated successfully!");
      setIsOpen(false);
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task. Please try again.");
    }
  };

  return (
    <div className="">
      <Button type="primary" color="primary" onClick={showModal}>
        Update
      </Button>
      <Modal
        title="Update task"
        open={isOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => {
            handleUpdate(values);
          }}
          initialValues={{ record }}
          className="space-y-4"
        >
          <Form.Item
            label="Task Name"
            name="taskName"
            rules={[{ required: true, message: "Please input the name!" }]}
          >
            <Input
              size="large"
              type="text"
              value={record?.name}
              placeholder="Enter task name"
              className="w-full p-2 border border-gray-300 rounded"
            />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <TextArea
              size="large"
              value={record?.description}
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
            <Select
              value={record?.assignedTo}
              size="large"
              className="w-full"
              placeholder="Select a user"
            >
              {employeeList?.map((user) => (
                <Select.Option key={user.id} value={user.id}>
                  {user?.name}
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
              value={record?.dueDate ? moment(record.dueDate) : null}
              disabledDate={(current) => current && current < Date.now()}
              className="w-full"
              size="large"
            />
          </Form.Item>

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
    </div>
  );
}

export default UpdateTask;
