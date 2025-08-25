import React from 'react';
import './hostManagement.css';

const HostManagement = () => {
  // TODO: Kết nối API lấy danh sách host
  return (
    <div className="host-management">
      <h2>Quản lý Host</h2>
      {/* Hiển thị danh sách host, nút ban/xóa/sửa */}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên Host</th>
            <th>Email</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {/* Dữ liệu mẫu */}
          <tr>
            <td>1</td>
            <td>Nguyễn Văn A</td>
            <td>host1@email.com</td>
            <td>Hoạt động</td>
            <td>
              <button>Chặn</button>
              <button>Xóa</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default HostManagement;
