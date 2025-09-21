import Logo from "../../../assets/logo.png";
import DefaultAvatar from "../../../assets/default_avatar.jfif";
import { Avatar, Dropdown, Form } from "antd";
import Icon, {
  BellOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function AppHeader() {
  const navigation = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("role");
    localStorage.removeItem("phoneNumber");
    toast.success("Logout successful");
    navigation("/login");
  };

  const items = [
    {
      key: "1",
      label: (
        <p
          onClick={() => handleLogout()}
          className="flex justify-start gap-2 cursor-pointer"
        >
          <LogoutOutlined style={{ marginLeft: 8 }} />
          <span>Logout</span>
        </p>
      ),
    },
    {
      key: "2",
      label: (
        <p
          className="flex justify-start gap-2 cursor-pointer"
          onClick={() => navigation("/profile")}
        >
          <UserOutlined style={{ marginLeft: 8 }} />
          <span>Profile</span>
        </p>
      ),
    },
  ];

  return (
    <div className="p-4 flex bg-white justify-between items-center border-b border-gray-300">
      <img src={Logo} alt="Logo" className="h-20 w-20" />
      <div className="flex items-center gap-10">
        <BellOutlined style={{ fontSize: "24px" }} />
        <Dropdown menu={{ items }} placement="bottomRight" arrow>
          <Avatar size={60} src={DefaultAvatar} alt="User Avatar" />
        </Dropdown>
      </div>
    </div>
  );
}

export default AppHeader;
