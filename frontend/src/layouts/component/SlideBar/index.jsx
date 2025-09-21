import { Layout, Menu } from "antd";
import { Link, useLocation } from "react-router-dom";
import checkCurrentUser from "../../../utils/checkCurrentUser";

const { Sider } = Layout;

function AppSlideBar() {
  const location = useLocation();

  // Function active cho menu item dựa trên đường dẫn hiện tại
  const getActiveMenuKey = () => {
    switch (location.pathname) {
      case "/":
        return "1";
      case "/manage-task":
        return "2";
      case "/messages":
        return "3";
      default:
        return "1";
    }
  };

  const getMenuItem = () => {
    const defaultItems = [
      { key: "2", label: <Link to={"/manage-task"}>Manage Task</Link> },
      { key: "3", label: <Link to={"/messages"}>Message</Link> },
    ];

    if (checkCurrentUser("owner")) {
      defaultItems.unshift({
        key: "1",
        label: <Link to={"/manage-employee"}>Manage Employees</Link>,
      });
    }
    return defaultItems;
  };

  const menuItems = getMenuItem();

  return (
    //Đưa menu sang sát phải
    <Sider width={300} className="">
      <Menu
        mode="inline"
        style={{ height: "100%", borderRight: 0 }}
        selectedKeys={[getActiveMenuKey()]}
        items={menuItems}
      />
    </Sider>
  );
}

export default AppSlideBar;
