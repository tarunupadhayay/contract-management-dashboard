import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  HiOutlineDocumentText,
  HiOutlineCheckCircle,
  HiOutlinePencilAlt,
  HiOutlineClock,
  HiOutlinePlusCircle,
} from 'react-icons/hi';
import StatsCard from '../components/StatsCard';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import { contractApi } from '../api/contractApi';
import dayjs from 'dayjs';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    draft: 0,
    executed: 0,
    expired: 0,
  });
  const [recentContracts, setRecentContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch all contracts for stats   
      const [allRes, recentRes] = await Promise.all([
        contractApi.getContracts({ limit: 100 }),
        contractApi.getContracts({ limit: 5, sortBy: 'updatedAt', sortOrder: 'desc' }),
      ]);

      const allContracts = allRes.data.data;
      setStats({
        total: allRes.data.pagination.totalItems,
        active: allContracts.filter((c) => c.status === 'Active').length,
        draft: allContracts.filter((c) => c.status === 'Draft').length,
        executed: allContracts.filter((c) => c.status === 'Executed').length,
        expired: allContracts.filter((c) => c.status === 'Expired').length,
      });
      setRecentContracts(recentRes.data.data);
    } catch (err) {
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading dashboard..." />;

  return (
    <div className="dashboard-page" id="dashboard-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            Welcome back, {user?.name}! Here&apos;s your contract overview.
          </p>
        </div>
        <Link to="/contracts/new" className="btn btn-primary" id="dashboard-new-contract-btn">
          <HiOutlinePlusCircle size={18} />
          New Contract
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid stagger-children">
        <StatsCard
          title="Total Contracts"
          value={stats.total}
          icon={<HiOutlineDocumentText size={22} />}
          color="accent"
        />
        <StatsCard
          title="Active"
          value={stats.active}
          icon={<HiOutlineCheckCircle size={22} />}
          color="success"
        />
        <StatsCard
          title="Draft"
          value={stats.draft}
          icon={<HiOutlinePencilAlt size={22} />}
          color="warning"
        />
        <StatsCard
          title="Expired"
          value={stats.expired}
          icon={<HiOutlineClock size={22} />}
          color="error"
        />
      </div>

      {/* Status Distribution */}
      <div className="dashboard-section">
        <div className="dashboard-grid">
          {/* Status Distribution Bar */}
          <div className="glass-card dashboard-card">
            <h3 className="dashboard-card-title">Status Distribution</h3>
            <div className="status-bars">
              {[
                { label: 'Active', count: stats.active, color: 'var(--color-status-active)', total: stats.total },
                { label: 'Draft', count: stats.draft, color: 'var(--color-status-draft)', total: stats.total },
                { label: 'Executed', count: stats.executed, color: 'var(--color-status-executed)', total: stats.total },
                { label: 'Expired', count: stats.expired, color: 'var(--color-status-expired)', total: stats.total },
              ].map((item) => (
                <div className="status-bar-row" key={item.label}>
                  <div className="status-bar-label">
                    <span>{item.label}</span>
                    <span className="status-bar-count">{item.count}</span>
                  </div>
                  <div className="status-bar-track">
                    <div
                      className="status-bar-fill"
                      style={{
                        width: item.total > 0 ? `${(item.count / item.total) * 100}%` : '0%',
                        background: item.color,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Contracts */}
          <div className="glass-card dashboard-card">
            <div className="dashboard-card-header">
              <h3 className="dashboard-card-title">Recent Contracts</h3>
              <Link to="/contracts" className="btn btn-ghost btn-sm">View All</Link>
            </div>
            <div className="recent-contracts-list">
              {recentContracts.length === 0 ? (
                <div className="empty-state">
                  <p className="text-sm text-muted">No contracts yet</p>
                </div>
              ) : (
                recentContracts.map((contract) => (
                  <Link
                    to={`/contracts/${contract._id}`}
                    className="recent-contract-item"
                    key={contract._id}
                  >
                    <div className="recent-contract-info">
                      <span className="recent-contract-title">{contract.title}</span>
                      <span className="recent-contract-date">
                        {dayjs(contract.updatedAt).format('MMM D, YYYY')}
                      </span>
                    </div>
                    <StatusBadge status={contract.status} />
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
