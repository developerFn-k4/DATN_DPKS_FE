import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select } from 'antd';

interface Props {
  open: boolean;
  editingData: any | null;
  onCancel: () => void;
  onSave: (values: any) => void;
}

const RoomModal: React.FC<Props> = ({ open, editingData, onCancel, onSave }) => {
  const [form] = Form.useForm();

  // Reset form khi đóng/mở hoặc khi đổi dữ liệu edit
  useEffect(() => {
    if (open) {
      form.setFieldsValue(editingData || { name: '', price: 0, status: 'available' });
    }
  }, [open, editingData, form]);

  return (
    <Modal
      title={editingData ? "Chỉnh sửa phòng" : "Thêm phòng mới"}
      open={open}
      onOk={() => form.submit()}
      onCancel={onCancel}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={onSave}>
        <Form.Item name="name" label="Tên phòng" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="price" label="Giá phòng (đêm)">
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="status" label="Trạng thái">
          <Select options={[
            { value: 'available', label: 'Trống' },
            { value: 'occupied', label: 'Đã đặt' }
          ]} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RoomModal;