import React from 'react';
import './homestayManagement.css';
import mockHomestays from './mockHomestays.json';

const HomestayManagement = () => {
  return (
    <div className="homestay-management">
      <h2>Quản lý Homestay</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên Homestay</th>
            <th>Host</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {mockHomestays.map(hs => (
            <tr key={hs.id}>
              <td>{hs.id}</td>
              <td>{hs.name}</td>
              <td>{hs.host}</td>
              <td>{hs.status}</td>
              <td>
                <button disabled={hs.status === 'Bị ban'}>Chặn</button>
                <button>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HomestayManagement;
