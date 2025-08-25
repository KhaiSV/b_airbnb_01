import React from 'react';
import './admin.css';
import mockOrders from './mockOrders.json';

const AdminDashboard = () => {
  // Thống kê đơn hàng trong tháng
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const ordersThisMonth = mockOrders.filter(o => {
    const d = new Date(o.date);
    return d.getMonth() + 1 === currentMonth && d.getFullYear() === currentYear;
  });
  const totalOrders = ordersThisMonth.length;
  const totalRevenue = ordersThisMonth.reduce((sum, o) => sum + (o.status === 'Đã thanh toán' ? o.total : 0), 0);
  const paidOrders = ordersThisMonth.filter(o => o.status === 'Đã thanh toán').length;
  const pendingOrders = ordersThisMonth.filter(o => o.status === 'Chờ xác nhận').length;
  const cancelledOrders = ordersThisMonth.filter(o => o.status === 'Đã hủy').length;

  // Đơn hàng gần nhất (5 đơn mới nhất)
  const latestOrders = [...mockOrders].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <p>Chào mừng bạn đến trang quản trị!</p>
      <div className="dashboard-widgets">
        <div className="widget">
          <div className="widget-title">Tổng số đơn trong tháng</div>
          <div className="widget-value">{totalOrders}</div>
        </div>
        <div className="widget">
          <div className="widget-title">Tổng doanh thu</div>
          <div className="widget-value">{totalRevenue.toLocaleString()} đ</div>
        </div>
        <div className="widget">
          <div className="widget-title">Đã thanh toán</div>
          <div className="widget-value">{paidOrders}</div>
        </div>
        <div className="widget">
          <div className="widget-title">Chờ xác nhận</div>
          <div className="widget-value">{pendingOrders}</div>
        </div>
        <div className="widget">
          <div className="widget-title">Đã hủy</div>
          <div className="widget-value">{cancelledOrders}</div>
        </div>
      </div>

      <h2 style={{marginTop: '40px'}}>Đơn hàng gần nhất</h2>
      <table style={{width: '100%', marginTop: '16px', background: '#fafafa', borderRadius: '8px', overflow: 'hidden'}}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Người đặt</th>
            <th>Homestay</th>
            <th>Ngày đặt</th>
            <th>Tổng tiền</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {latestOrders.map(order => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.user}</td>
              <td>{order.homestay}</td>
              <td>{order.date}</td>
              <td>{order.total.toLocaleString()} đ</td>
              <td>{order.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
