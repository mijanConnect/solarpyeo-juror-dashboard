import { Badge, Button, Dropdown, Menu, Modal } from "antd";
import { useState } from "react";
import { FaRegBell } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { getImageUrl } from "../../components/common/imageUrl";
import { useUser } from "../../provider/User";
import { imageUrl } from "../../redux/api/baseApi";

const Header = ({ toggleSidebar, toggleDrawer }) => {
  const { user } = useUser();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const navigate = useNavigate();

  const src = user?.image?.startsWith("https")
    ? user?.image
    : `${imageUrl}/${user?.image}`;

  const showLogoutConfirm = () => {
    setIsLogoutModalOpen(true); // Show the confirmation modal
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLogoutModalOpen(false); // Close the modal
    navigate("/auth/login");
  };

  const handleCancelLogout = () => {
    setIsLogoutModalOpen(false); // Close the confirmation modal
  };

  const menu = (
    <Menu>
      <Menu.Item key="settings">
        <Link to="/profile">Settings</Link>
      </Menu.Item>
      <Menu.Item
        key="logout"
        danger
        onClick={showLogoutConfirm}
        style={{ display: "flex", alignItems: "center" }}
      >
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="flex items-center justify-between gap-5 w-full px-6 rounded-md shadow-sm py-2 bg-white border-b border-gray-200">
      <div className="py-2">
        <h2 className="font-bold text-xl text-secondary">Admin Dashboard</h2>
        {/* <p className="text-[12px] font-normal text-secondary mt-1">
          36 East 8th Street, New York, NY 10003, United States.
        </p> */}
      </div>
      <div className="flex items-center gap-3">
        {/* Profile Icon with Dropdown Menu */}
        <Dropdown overlay={menu} trigger={["click"]} placement="bottomRight">
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="flex flex-row gap-1">
              <p>Hello,</p>{" "}
              <p className="text-[16px] font-semibold">
                {user?.firstName || ""}
              </p>
            </div>
            <img
              style={{
                clipPath: "circle()",
                width: 45,
                height: 45,
                objectFit: "cover",
              }}
              src={getImageUrl(user?.image)}
              alt="profile-pic"
              className="clip"
            />
          </div>
        </Dropdown>
        {/* Notification Icon */}
        <Link to="/notification" className="h-fit mt-[10px]">
          <Badge count={5} backgroundColor="#3FC7EE">
            <FaRegBell color="#b91c1c" size={24} />
          </Badge>
        </Link>
      </div>

      {/* Logout Confirmation Modal */}
      <Modal
        title="Confirm Logout"
        visible={isLogoutModalOpen}
        onCancel={handleCancelLogout}
        footer={[
          <Button key="cancel" onClick={handleCancelLogout}>
            Cancel
          </Button>,
          <Button key="logout" danger onClick={handleLogout}>
            Logout
          </Button>,
        ]}
      >
        <p>Are you sure you want to log out?</p>
      </Modal>
    </div>
  );
};

export default Header;
