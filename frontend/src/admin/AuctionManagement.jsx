import React, { useState } from 'react';
import './auctionManagement.css';
import mockHomestays from './mockHomestays.json';

const mockAuctions = [
  {
    id: 'AU000000000000000001',
    homestay: 'Homestay Đà Lạt',
    startDate: '2025-08-28',
    endDate: '2025-08-30',
    startPrice: 1000000,
    stepPrice: 100000,
    startTime: '2025-08-27 09:00',
    endTime: '2025-08-27 18:00',
    status: 'Open'
  }
];

const AuctionManagement = () => {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    homestay: '',
    startDate: '',
    endDate: '',
    startPrice: '',
    stepPrice: '',
    startTime: '',
    endTime: ''
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    // TODO: Gọi API tạo đấu giá
    alert('Đã tạo đấu giá (mock)!');
    setShowForm(false);
    setForm({ homestay: '', startDate: '', endDate: '', startPrice: '', stepPrice: '', startTime: '', endTime: '' });
  };

  return (
    <div className="auction-management">
      <h2>Quản lý đấu giá booking homestay</h2>
      <button className="create-auction-btn" onClick={() => setShowForm(true)}>Tạo đấu giá</button>
      {showForm && (
        <form className="auction-form" onSubmit={handleSubmit}>
          <h3>Tạo đấu giá mới</h3>
          <label>Chọn homestay:</label>
          <select name="homestay" value={form.homestay} onChange={handleChange} required>
            <option value="">-- Chọn homestay --</option>
            {mockHomestays.map(hs => (
              <option key={hs.id} value={hs.name}>{hs.name}</option>
            ))}
          </select>
          <label>Ngày bắt đầu:</label>
          <input type="date" name="startDate" value={form.startDate} onChange={handleChange} required />
          <label>Ngày kết thúc:</label>
          <input type="date" name="endDate" value={form.endDate} onChange={handleChange} required />
          <label>Giá khởi điểm:</label>
          <input type="number" name="startPrice" value={form.startPrice} onChange={handleChange} required min={0} />
          <label>Bước nhảy:</label>
          <input type="number" name="stepPrice" value={form.stepPrice} onChange={handleChange} required min={0} />
          <label>Thời gian bắt đầu đấu giá:</label>
          <input type="datetime-local" name="startTime" value={form.startTime} onChange={handleChange} required />
          <label>Thời gian kết thúc đấu giá:</label>
          <input type="datetime-local" name="endTime" value={form.endTime} onChange={handleChange} required />
          <button type="submit">Tạo đấu giá</button>
          <button type="button" onClick={() => setShowForm(false)}>Hủy</button>
        </form>
      )}
      <h3 style={{marginTop: '32px'}}>Danh sách homestay đang được đấu giá</h3>
      <div className="auction-table-wrapper">
        <table className="auction-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Homestay</th>
              <th>Ngày bắt đầu</th>
              <th>Ngày kết thúc</th>
              <th>Giá khởi điểm</th>
              <th>Bước nhảy</th>
              <th>Thời gian bắt đầu</th>
              <th>Thời gian kết thúc</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {mockAuctions.map(auction => (
              <tr key={auction.id}>
                <td>{auction.id}</td>
                <td>{auction.homestay}</td>
                <td>{auction.startDate}</td>
                <td>{auction.endDate}</td>
                <td>{auction.startPrice.toLocaleString()} đ</td>
                <td>{auction.stepPrice.toLocaleString()} đ</td>
                <td>{auction.startTime}</td>
                <td>{auction.endTime}</td>
                <td>{auction.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuctionManagement;
