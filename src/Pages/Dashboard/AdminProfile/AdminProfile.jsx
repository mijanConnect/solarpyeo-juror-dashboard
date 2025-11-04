import { Tabs } from "antd";
import ChangePassword from "./ChangePassword";
import UserProfile from "./UserProfile";

const AdminProfile = () => {
  const items = [
    {
      key: "1",
      label: "Edit Profile",
      children: <UserProfile />,
    },
    {
      key: "2",
      label: "Change Password ",
      children: <ChangePassword />,
    },
  ];

  return (
    <div>
      <div className="bg-white mt-10 rounded-xl w-full lg:max-w-[1000px] mx-auto px-4 sm:px-6">
        <Tabs defaultActiveKey="1" items={items} />
      </div>
    </div>
  );
};

export default AdminProfile;
