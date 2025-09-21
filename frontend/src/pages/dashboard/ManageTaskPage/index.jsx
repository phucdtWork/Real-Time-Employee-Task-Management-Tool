import React, { useEffect, useState } from "react";
import checkCurrentUser from "../../../utils/checkCurrentUser";
import CreateTask from "./createTask";
import UpdateTask from "./updateTask";
import { toast } from "react-toastify";
import {
  getAllTasksForOwner,
  getEmployeeTasks,
  deleteTask,
  updateEmployeeTask,
} from "../../../apis/taskAPI";
import { Button, Modal, Table, Tag } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import { getAllUsers } from "../../../apis/ownerAPI";

function ManageTask() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [selectedTask, setSelectedTask] = useState(null);

  const [employee, setEmployee] = useState([]);

  const fetchTasks = async () => {
    setLoading(true);

    let response;

    try {
      if (!checkCurrentUser("owner")) {
        response = await getEmployeeTasks();
      } else {
        response = await getAllTasksForOwner();
      }
      setLoading(false);
      setTasks(response.data);
    } catch (error) {
      setLoading(false);

      console.log(error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await getAllUsers();
      setEmployee(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
      toast.error("Failed to fetch employees. Please try again.");
    }
  };

  useEffect(() => {
    checkCurrentUser("owner") && fetchEmployees();
    fetchTasks();
  }, []);

  const status = (data) => {
    switch (data) {
      case "pending":
        return <Tag color="orange">Pending</Tag>;
      case "in_progress":
        return <Tag color="blue">In Progress</Tag>;
      case "completed":
        return <Tag color="green">Completed</Tag>;
      default:
        return <Tag color="gray">Unknown</Tag>;
    }
  };

  const handleMarkAsCompleted = async (taskId) => {
    setLoading(true);
    try {
      await updateEmployeeTask(taskId);
      toast.success("Task marked as completed");
      fetchTasks();
    } catch (error) {
      console.error("Failed to update task:", error);
      toast.error("Failed to update task");
    } finally {
      setLoading(false);
    }
  };

  const renderAssignToName = (userId) => {
    const user = employee.find((em) => em.id === userId);
    return user ? user.name : "This employee has deleted ";
  };

  const handleDelete = (taskId) => {
    setSelectedTask(taskId);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setLoading(true);
    try {
      await deleteTask(selectedTask);
      toast.success("Task deleted successfully");
      setIsDeleteModalOpen(false);
      setSelectedTask(null);
      fetchTasks();
    } catch (error) {
      console.error("Failed to delete task:", error);
      toast.error("Failed to delete task");
    } finally {
      setLoading(false);
    }
  };

  // Dữ liệu mẫu cho bảng task

  const getColumn = () => {
    const defaultCol = [
      { title: "Task Name", dataIndex: "taskName", key: "name" },
      { title: "Description", dataIndex: "description", key: "description" },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: (text) => status(text),
      },
    ];

    if (checkCurrentUser("owner")) {
      defaultCol.push({
        title: "Assigned To",
        dataIndex: "assignedTo",
        key: "assignedTo",
        render: (text) => renderAssignToName(text),
      });
    }
    defaultCol.push(
      {
        title: "Due Date",
        dataIndex: "dueDate",
        key: "dueDate",
        render: (text) => new Date(text).toLocaleDateString(),
      },
      {
        title: "Action",
        key: "action",
        render: (_, record) => (
          <span className="flex gap-2 justify-center">
            {checkCurrentUser("owner") && (
              <>
                {record.status !== "completed" ? (
                  <UpdateTask
                    record={record}
                    onUpdate={() => fetchTasks()}
                    employeeList={employee}
                  />
                ) : null}
                <Button
                  type="primary"
                  danger
                  onClick={() => handleDelete(record.id)}
                >
                  Delete
                </Button>
              </>
            )}
            {!checkCurrentUser("owner") && record.status !== "completed" && (
              <Button
                type="primary"
                success
                onClick={() => handleMarkAsCompleted(record.id)}
                icon={<CheckOutlined />}
              >
                Mark as Completed
              </Button>
            )}
          </span>
        ),
      }
    );
    return defaultCol;
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Task</h1>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium mb-4">{tasks.length} tasks</h2>
        {checkCurrentUser("owner") && (
          <CreateTask onCreate={() => fetchTasks()} employeeList={employee} />
        )}
      </div>
      <Table columns={getColumn()} dataSource={tasks || []} loading={loading} />

      <Modal
        title="Delete Task"
        open={isDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(false)}
        onOk={handleConfirmDelete}
      >
        Are you sure you want to delete this task?
      </Modal>
    </div>
  );
}

export default ManageTask;
