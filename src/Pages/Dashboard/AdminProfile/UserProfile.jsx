import { UploadOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Form,
  Input,
  message,
  notification,
  Select,
  Upload,
} from "antd";
import { useEffect, useState } from "react";
import { getImageUrl } from "../../../components/common/imageUrl";
import CustomSpinner from "../../../components/spinner/CustomSpinner";
import {
  useProfileQuery,
  useUpdateProfileMutation,
} from "../../../redux/apiSlices/authSlice";

const { Option } = Select;
const { TextArea } = Input;

const UserProfile = () => {
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState(null);
  const [fileList, setFileList] = useState([]);

  // Fetch profile from API
  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
    refetch,
  } = useProfileQuery();

  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  // When profile arrives, populate the form and avatar
  useEffect(() => {
    if (!profile) return;

    const profileData = {
      // name may not be provided by the API; derive a display name from email if needed
      username:
        profile.name ||
        profile.username ||
        (profile.email ? profile.email.split("@")[0] : ""),
      email: profile.email || "",
      contact: profile.phone || profile.contact || "",
      address: profile.address || "",
      service: profile.service || "",
      aboutUs: profile.about || profile.aboutUs || "",
      // API uses `profile` for avatar URL
      profileImage:
        profile.profile || profile.profileImage || profile.avatar || "",
    };

    form.setFieldsValue(profileData);

    if (profileData.profileImage) {
      setImageUrl(profileData.profileImage);
      setFileList([
        {
          uid: "-1",
          name: "profile.jpg",
          status: "done",
          url: profileData.profileImage,
          originFileObj: null,
        },
      ]);
    }
  }, [profile, form]);

  // Clean up blob URLs when component unmounts
  useEffect(() => {
    return () => {
      if (imageUrl && imageUrl.startsWith("blob:")) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  if (profileLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <CustomSpinner />
      </div>
    );

  const onFinish = async (values) => {
    const imageFile = fileList.length > 0 ? fileList[0].originFileObj : null;

    const formData = new FormData();

    // Map form fields to backend expected keys
    if (values.username) formData.append("name", values.username);
    if (values.contact) formData.append("phone", values.contact);
    if (values.address) formData.append("address", values.address);
    if (values.service) formData.append("service", values.service);
    if (values.aboutUs) formData.append("about", values.aboutUs);

    // include other fields if present
    if (values.email) formData.append("email", values.email);

    if (imageFile) {
      // send file under 'profile' (api uses `profile` for avatar)
      formData.append("image", imageFile);
    }

    try {
      await updateProfile(formData).unwrap();
      message.success("Profile Updated Successfully!");
      if (refetch) refetch();
    } catch (err) {
      message.error(err?.data?.message || "Failed to update profile");
    }
  };

  const handleImageChange = ({ fileList: newFileList }) => {
    const limitedFileList = newFileList.slice(-1);
    setFileList(limitedFileList);

    if (limitedFileList.length > 0) {
      const f = limitedFileList[0];

      // revoke previous blob url if we created one
      if (
        imageUrl &&
        typeof imageUrl === "string" &&
        imageUrl.startsWith("blob:")
      ) {
        try {
          URL.revokeObjectURL(imageUrl);
        } catch (e) {
          // ignore
        }
      }

      // Prefer originFileObj for a local preview
      if (f.originFileObj) {
        const newImageUrl = URL.createObjectURL(f.originFileObj);
        setImageUrl(newImageUrl);
      } else if (f.url) {
        // already uploaded / has remote url
        setImageUrl(f.url);
      } else {
        setImageUrl(null);
      }
    } else {
      setImageUrl(null);
    }
  };

  const beforeUpload = (file) => {
    const isImage =
      file.type && file.type.startsWith && file.type.startsWith("image/");
    if (!isImage) {
      notification.error({
        message: "Invalid File Type",
        description: "Please upload an image file.",
      });
      // do not add to fileList
      return Upload.LIST_IGNORE;
    }

    const isLessThan2MB = file.size / 1024 / 1024 < 2;
    if (!isLessThan2MB) {
      notification.error({
        message: "File too large",
        description: "Image must be smaller than 2MB.",
      });
      return Upload.LIST_IGNORE;
    }

    // Prevent automatic upload; keep file in fileList so we can submit via form
    return false;
  };

  return (
    <div className="flex justify-center items-center shadow-xl rounded-lg pt-5 pb-4">
      <Form
        form={form}
        layout="vertical"
        style={{ width: "80%" }}
        onFinish={onFinish}
        encType="multipart/form-data"
      >
        <div className="flex flex-col">
          {/* Profile Image */}
          <div className="flex justify-start items-center gap-5 mb-5">
            <Form.Item style={{ marginBottom: 0 }}>
              <Upload
                name="avatar"
                showUploadList={false}
                onChange={handleImageChange}
                beforeUpload={beforeUpload}
                fileList={fileList}
                listType="picture-card"
                maxCount={1}
              >
                {imageUrl ? (
                  <Avatar
                    className="rounded-[8px]"
                    size={100}
                    src={getImageUrl(imageUrl)}
                  />
                ) : (
                  <Avatar size={100} icon={<UploadOutlined />} />
                )}
              </Upload>
            </Form.Item>
            <h2 className="text-[24px] font-bold">
              {profile?.name || form.getFieldValue("username") || ""}
            </h2>
          </div>

          {/* Form Fields in Grid 2 Columns */}
          <div className="">
            {/* Left Column */}
            <div className="w-full">
              {/* Username */}
              <Form.Item
                name="username"
                label="Full Name"
                rules={[{ required: true, message: "Please enter your name" }]}
              >
                <Input
                  placeholder="Enter your full name"
                  className="h-[45px]"
                />
              </Form.Item>

              {/* Email */}
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Please enter your email" },
                  { type: "email", message: "Please enter a valid email" },
                ]}
              >
                <Input
                  placeholder="Enter your email"
                  disabled
                  className="h-[45px]"
                />
              </Form.Item>

              {/* Contact */}
              {/* <Form.Item
                name="contact"
                label="Contact Number"
                rules={[
                  { required: true, message: "Please enter contact number" },
                ]}
              >
                <Input
                  placeholder="Enter your contact number"
                  className="h-[45px]"
                />
              </Form.Item> */}
            </div>
          </div>

          {/* Update Profile Button */}
          <div className="text-end mt-4 mb-10">
            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                block
                style={{ height: 45 }}
                loading={isUpdating}
              >
                Save Changes
              </Button>
            </Form.Item>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default UserProfile;
