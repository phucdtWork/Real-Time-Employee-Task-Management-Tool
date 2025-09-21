import { MessageOutlined } from "@ant-design/icons";
import { Button, Card, Modal } from "antd";
import { useState } from "react";
import { createConversation } from "../../../../apis/messageAPI";
import { toast } from "react-toastify";

function EmployeeChatList({ employees, onSelect, onCreateConversation }) {
  const [isOpenModalList, setIsOpenModalList] = useState(false);

  const handleShowModalList = () => {
    setIsOpenModalList(true);
  };

  const handleCreateConversation = async (employee) => {
    try {
      const response = await createConversation(employee.id);
      if (response.success) {
        toast.success("Conversation created successfully");
        setIsOpenModalList(false);
        onCreateConversation();
      }
    } catch (error) {
      toast.error("Error creating conversation");
      console.error("Error creating conversation:", error);
    }
  };

  return (
    <div>
      <Button
        type="primary"
        className="mb-4 w-full"
        onClick={handleShowModalList}
        icon={<MessageOutlined />}
      >
        New Chat
      </Button>
      <Modal
        open={isOpenModalList}
        title="Select Employee to Chat"
        onCancel={() => setIsOpenModalList(false)}
        footer={null}
      >
        {employees.length === 0 ? (
          <p>No employees available</p>
        ) : (
          employees.map((employee) => (
            <div
              className="flex justify-between items-center mb-2 p-2 border border-gray-300 rounded-2xl cursor-pointer hover:bg-gray-100"
              key={employee.id}
            >
              <div>
                <p className="font-bold">{employee.name}</p>
                <p className="text-sm text-gray-500">{employee.email}</p>
              </div>

              <Button
                type="primary"
                onClick={() => handleCreateConversation(employee)}
              >
                Start Chat
              </Button>
            </div>
          ))
        )}
      </Modal>
    </div>
  );
}

export default EmployeeChatList;
