import { Button, Modal, Table, Tag } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { getAllUsers, DeleteEmployee } from "../../../apis/ownerAPI";
import { useEffect, useState } from "react";
import UpdatePopup from "./updatePopup";
import CreateEmployeePopup from "./createEmployeePopup";
import { toast } from "react-toastify";
import checkCurrentUser from "../../../utils/checkCurrentUser";
import { useNavigate } from "react-router-dom";

function ManageEmployeePage() {
  const [employeeData, setEmployeeData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  //setup delete modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingEmployee, setDeletingEmployee] = useState(null);

  const handleDelete = (employee) => {
    setDeletingEmployee(employee);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await DeleteEmployee(deletingEmployee.id);
      toast.success("Employee deleted successfully");
      setIsDeleteModalOpen(false);
      setDeletingEmployee(null);
      fetchData();
    } catch (error) {
      console.error("Failed to delete employee:", error);
      toast.error("Failed to delete employee");
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    const response = await getAllUsers();
    if (response.success === true) {
      setEmployeeData(response.data);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkCurrentUser("owner") && fetchData();
    !checkCurrentUser("owner") && navigate("/login");
  }, []);

  //Define tag color based on status
  const getStatusTagColor = (status) => {
    switch (status) {
      case "active":
        return "green";
      case "inactive":
        return "red";
      case "pending":
        return "orange";
      default:
        return "default";
    }
  };

  const tableColumns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={getStatusTagColor(status)} key={status}>
          {status}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <span className="flex gap-2">
          <UpdatePopup
            record={record}
            setEmployeeData={setEmployeeData}
            onUpdate={() => fetchData()}
            isOpen={false}
          />
          <Button type="primary" danger onClick={() => handleDelete(record)}>
            Delete
          </Button>
        </span>
      ),
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Employee</h1>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium mb-4">
          {employeeData.length} employees
        </h2>
        <div className="flex justify-between gap-2 mb-4">
          <CreateEmployeePopup onCreate={() => fetchData()} />
          <div>
            <Button type="default" icon={<SearchOutlined />}>
              Filter
            </Button>
          </div>
        </div>
      </div>
      <Table
        columns={tableColumns}
        dataSource={employeeData}
        rowKey="id"
        loading={isLoading}
        pagination={{ pageSize: 5 }}
      />
      <Modal
        title="Delete Employee"
        open={isDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(!isDeleteModalOpen)}
        onOk={handleDeleteConfirm}
      >
        Are you sure you want to delete this employee?
      </Modal>
    </div>
  );
}

export default ManageEmployeePage;
