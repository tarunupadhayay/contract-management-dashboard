import React, { useEffect, useState } from 'react';
import { userApi } from '../api/contractApi';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import { HiOutlineUsers, HiOutlineShieldCheck } from 'react-icons/hi';
import './AdminUsers.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await userApi.getUsers({ limit: 50 });
      setUsers(response.data.data);
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await userApi.updateUserRole(userId, newRole);
      toast.success('User role updated successfully');
      loadUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update role');
    }
  };

  if (loading) return <LoadingSpinner text="Loading users..." />;

  return (
    <div className="admin-users-page" id="admin-users-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">User Management</h1>
          <p className="page-subtitle">
            <HiOutlineUsers size={14} style={{ verticalAlign: 'middle' }} />
            {' '}{users.length} registered users
          </p>
        </div>
      </div>

      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="data-table" id="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <span className={`navbar-user-role role-${u.role}`}>
                    {u.role}
                  </span>
                </td>
                <td>{dayjs(u.createdAt).format('MMM D, YYYY')}</td>
                <td style={{ textAlign: 'right' }}>
                  <select
                    className="form-input"
                    style={{ width: 'auto', padding: '6px 30px 6px 10px', fontSize: '0.8rem' }}
                    value={u.role}
                    onChange={(e) => handleRoleChange(u._id, e.target.value)}
                    id={`role-select-${u._id}`}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
