import {
  ArrowLeftOutlined,
  BackwardOutlined,
  StepBackwardOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import { useEffect, useState } from "react";
import { getCurrentUser } from "../../../apis/commonAPI";
import { toast } from "react-toastify";
import { updateProfile } from "../../../apis/employeeAPI";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigate();

  const fetchCurrentUser = async () => {
    try {
      const response = await getCurrentUser();

      if (response.success) {
        setCurrentUser(response.data.data);
        form.setFieldsValue({
          name: response.data.data.name,
          email: response.data.data.email,
          address: response.data.data.address,
          phoneNumber: response.data.data.phoneNumber,
        });
      } else {
        console.error("Failed to fetch current user:", response.message);
      }
    } catch (error) {
      console.error("Failed to fetch current user:", error);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const [form] = Form.useForm();
  const handleUpdate = async (values) => {
    setLoading(true);
    try {
      const response = await updateProfile(values);
      if (response.success) {
        toast.success("Profile updated successfully");
        fetchCurrentUser();
      } else {
        toast.error(response?.error || "Something went wrong");
      }
    } catch (error) {
      toast.error("An error occurred while updating the profile");
      console.error("Update profile error:", error);
    }
  };

  return (
    <div className="w-2xl  p-8 bg-white shadow-md rounded">
      <Button
        onClick={() => {
          navigation(-1);
        }}
        icon={<ArrowLeftOutlined />}
      >
        Back
      </Button>
      <h2 className="text-2xl font-bold mb-6 text-center">Your Profile</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => {
          handleUpdate(values);
        }}
        initialValues={{
          name: currentUser?.name || "",
          email: currentUser?.email || "",
          address: currentUser?.address || "",
          phoneNumber: currentUser?.phoneNumber || "",
        }}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please input the name!" }]}
        >
          <Input
            size="large"
            type="text"
            className="w-full p-2 border border-gray-300 rounded"
            value={currentUser?.name}
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
            value={currentUser?.email}
          />
        </Form.Item>
        <Form.Item label="Address" name="address">
          <Input
            size="large"
            type="text"
            className="w-full p-2 border border-gray-300 rounded"
            value={currentUser?.address}
          />
        </Form.Item>
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
            value={currentUser?.phoneNumber}
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
        <Button
          className={"w-full"}
          size="large"
          type="primary"
          htmlType="submit"
          loading={loading}
        >
          Update
        </Button>
      </Form>
    </div>
  );
}

export default Profile;
