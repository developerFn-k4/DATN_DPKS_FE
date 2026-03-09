import React from 'react';
import { Table, Button, Space, Popconfirm } from 'antd';

interface Props {
  data: any[];
  loading: boolean;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const RoomTable: React.FC<Props> = ({ data, loading, onEdit, onDelete }) => {
  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Tên Phòng', dataIndex: 'tenPhong', key: 'tenPhong' },
    { title: 'Giá tiền', dataIndex: 'giaTien', key: 'giaTien', render: (val: number) => `${val}$` },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button type="link" onClick={() => onEdit(record.id)}>Sửa</Button>
          <Popconfirm
            title="Xác nhận xóa?"
            onConfirm={() => onDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="link" danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return <Table dataSource={data} columns={columns} loading={loading} rowKey="id" />;
};

export default RoomTable;