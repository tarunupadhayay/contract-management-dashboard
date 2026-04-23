import React from 'react';
import dayjs from 'dayjs';
import { HiOutlineClock, HiOutlineUser, HiOutlinePencil, HiOutlineShieldCheck, HiOutlineTrash } from 'react-icons/hi';
import './ActivityLog.css';

const actionConfig = {
  CREATED: { icon: <HiOutlinePencil size={16} />, color: 'var(--color-success)', label: 'Created' },
  UPDATED: { icon: <HiOutlinePencil size={16} />, color: 'var(--color-info)', label: 'Updated' },
  STATUS_CHANGED: { icon: <HiOutlineShieldCheck size={16} />, color: 'var(--color-warning)', label: 'Status Changed' },
  DELETED: { icon: <HiOutlineTrash size={16} />, color: 'var(--color-error)', label: 'Deleted' },
  RESTORED: { icon: <HiOutlineShieldCheck size={16} />, color: 'var(--color-success)', label: 'Restored' },
};

const ActivityLog = ({ activities = [] }) => {
  if (!activities || activities.length === 0) {
    return (
      <div className="activity-empty">
        <HiOutlineClock size={24} />
        <p>No activity recorded yet</p>
      </div>
    );
  }

  // Reverse to show newest first
  const sortedActivities = [...activities].reverse();

  return (
    <div className="activity-timeline" id="activity-timeline">
      {sortedActivities.map((activity, index) => {
        const config = actionConfig[activity.action] || actionConfig.UPDATED;
        return (
          <div className="activity-item" key={activity._id || index}>
            <div className="activity-marker" style={{ borderColor: config.color }}>
              <span style={{ color: config.color }}>{config.icon}</span>
            </div>
            <div className="activity-content">
              <div className="activity-header">
                <span className="activity-label" style={{ color: config.color }}>
                  {config.label}
                </span>
                <span className="activity-time">
                  <HiOutlineClock size={12} />
                  {dayjs(activity.timestamp).format('MMM D, YYYY h:mm A')}
                </span>
              </div>
              {activity.details && (
                <p className="activity-details">{activity.details}</p>
              )}
              {activity.performedBy && (
                <span className="activity-user">
                  <HiOutlineUser size={12} />
                  {activity.performedBy.name || 'Unknown'}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ActivityLog;
