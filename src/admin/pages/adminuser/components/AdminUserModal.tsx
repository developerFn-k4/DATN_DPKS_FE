import React, { useEffect } from "react";
import { Modal, Form, Input, Select } from "antd";
import toast from "react-hot-toast"; 
import { useAdminUsers } from "../hooks/AdminUserHook";

const { Option } = Select;

interface UserFormValues {
  name: string;
  email: string;
  role: "admin" | "user";
  status: "active" | "inactive";
}

interface AdminUserModalProps {
  visible: boolean;
  onClose: () => void;
  editingUser?: any;

}

const AdminUserModal: React.FC<AdminUserModalProps> = ({
  visible,
  onClose,
  editingUser,
}) => {
  const [form] = Form.useForm<UserFormValues>();
  const { handleCreate, handleUpdate } = useAdminUsers();

  useEffect(() => {
    if (visible) {
      if (editingUser) {
        form.setFieldsValue(editingUser);
      } else {
        form.resetFields();
      }
    }
  }, [visible, editingUser, form]);

  const onFinish = async (values: UserFormValues) => {
    try {
      let success = false;
      if (editingUser) {
        success = await handleUpdate(editingUser.id, values);
      } else {
        success = await handleCreate(values);
      }

      if (success) {
        toast.success(`Người dùng ${editingUser ? "cập nhật" : "tạo"} thành công!`);
        onClose();
        form.resetFields();
      }
    } catch (error) {
      console.error(error);
      toast.error("Đã có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  return (
    <Modal
      open={visible}
      title={editingUser ? "Chỉnh sửa người dùng" : "Thêm người dùng"}
      okText={editingUser ? "Cập nhật" : "Tạo"}
      cancelText="Hủy"
      onCancel={() => { onClose(); form.resetFields(); }}
      onOk={() => form.submit()}
      destroyOnHidden 
    >
      <Form
        form={form} 
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ status: "active", role: "user" }}
      >
        <Form.Item
          label="Tên"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
        >
          <Input placeholder="Tên người dùng" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập email!" },
            { type: "email", message: "Email không hợp lệ!" },
          ]}
        >
          <Input placeholder="Email" />
        </Form.Item>

        <Form.Item
          label="Vai trò"
          name="role"
          rules={[{ required: true, message: "Chọn vai trò!" }]}
        >
          <Select>
            <Option value="admin">Admin</Option>
            <Option value="user">User</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Trạng thái"
          name="status"
          rules={[{ required: true, message: "Chọn trạng thái!" }]}
        >
          <Select>
            <Option value="active">Hoạt động</Option>
            <Option value="inactive">Không hoạt động</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AdminUserModal;