import { Modal, Avatar, Descriptions, Tag } from "antd";
import { UserOutlined } from "@ant-design/icons";

interface Props {
  open: boolean;
  onClose: () => void;
  profile: any;
}

export default function ProfileModal({ open, onClose, profile }: Props) {
  if (!profile) return null;

  const roleLabel =
    profile.role === "admin" ? "Admin" : "Người dùng";

  const roleColor =
    profile.role === "admin" ? "red" : "blue";

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title="Thông tin tài khoản"
      centered
    >
      <div className="flex flex-col items-center mb-6">
        <Avatar
          size={80}
          src={profile.avatar}
          icon={<UserOutlined />}
        />

        <h3 className="mt-3 text-lg font-semibold">
          {profile.name}
        </h3>

        <Tag color={roleColor}>{roleLabel}</Tag>
      </div>

      <Descriptions
        bordered
        column={1}
        size="middle"
      >
        <Descriptions.Item label="Email">
          {profile.email}
        </Descriptions.Item>

        <Descriptions.Item label="Vai trò">
          {roleLabel}
        </Descriptions.Item>

        <Descriptions.Item label="Ngày tạo">
          {new Date(profile.created_at).toLocaleString()}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
}