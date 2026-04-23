import React, { useState } from 'react';
import dayjs from 'dayjs';
import { HiOutlineClock, HiOutlineUser, HiOutlineEye } from 'react-icons/hi';
import Modal from './Modal';
import './VersionTimeline.css';

const VersionTimeline = ({ versions = [], currentContract = null }) => {
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [showDiff, setShowDiff] = useState(false);

  if (!versions || versions.length === 0) {
    return (
      <div className="version-empty">
        <HiOutlineClock size={24} />
        <p>No version history available</p>
        <span className="text-xs text-muted">Versions are created when a contract is updated</span>
      </div>
    );
  }

  const getDiffFields = (version) => {
    if (!currentContract) return [];
    const fields = ['title', 'description', 'status', 'startDate', 'endDate'];
    const diffs = [];

    for (const field of fields) {
      let oldVal = version[field];
      let newVal = currentContract[field];

      if (field === 'startDate' || field === 'endDate') {
        oldVal = oldVal ? dayjs(oldVal).format('YYYY-MM-DD') : '';
        newVal = newVal ? dayjs(newVal).format('YYYY-MM-DD') : '';
      }

      if (String(oldVal) !== String(newVal)) {
        diffs.push({ field, oldVal: String(oldVal), newVal: String(newVal) });
      }
    }

    // Parties comparison
    const oldParties = (version.parties || []).join(', ');
    const newParties = (currentContract.parties || []).join(', ');
    if (oldParties !== newParties) {
      diffs.push({ field: 'parties', oldVal: oldParties, newVal: newParties });
    }

    return diffs;
  };

  return (
    <>
      <div className="version-timeline" id="version-timeline">
        {versions.map((version, index) => (
          <div className="version-item" key={version._id || index}>
            <div className="version-marker">
              <span className="version-number">v{version.versionNumber}</span>
            </div>
            <div className="version-content glass-card">
              <div className="version-header">
                <div>
                  <span className="version-title">Version {version.versionNumber}</span>
                  {version.changeNote && (
                    <p className="version-note">{version.changeNote}</p>
                  )}
                </div>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => { setSelectedVersion(version); setShowDiff(true); }}
                >
                  <HiOutlineEye size={14} />
                  View
                </button>
              </div>
              <div className="version-meta">
                <span className="version-meta-item">
                  <HiOutlineClock size={12} />
                  {dayjs(version.modifiedAt).format('MMM D, YYYY h:mm A')}
                </span>
                {version.modifiedBy && (
                  <span className="version-meta-item">
                    <HiOutlineUser size={12} />
                    {version.modifiedBy.name || 'Unknown'}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={showDiff}
        onClose={() => setShowDiff(false)}
        title={`Version ${selectedVersion?.versionNumber} Details`}
        size="lg"
      >
        {selectedVersion && (
          <div className="version-diff" id="version-diff">
            <div className="version-detail-grid">
              <div className="version-detail-item">
                <span className="version-detail-label">Title</span>
                <span className="version-detail-value">{selectedVersion.title}</span>
              </div>
              <div className="version-detail-item">
                <span className="version-detail-label">Status</span>
                <span className="version-detail-value">{selectedVersion.status}</span>
              </div>
              <div className="version-detail-item">
                <span className="version-detail-label">Start Date</span>
                <span className="version-detail-value">
                  {dayjs(selectedVersion.startDate).format('MMM D, YYYY')}
                </span>
              </div>
              <div className="version-detail-item">
                <span className="version-detail-label">End Date</span>
                <span className="version-detail-value">
                  {dayjs(selectedVersion.endDate).format('MMM D, YYYY')}
                </span>
              </div>
              <div className="version-detail-item version-detail-full">
                <span className="version-detail-label">Description</span>
                <span className="version-detail-value">{selectedVersion.description}</span>
              </div>
              <div className="version-detail-item version-detail-full">
                <span className="version-detail-label">Parties</span>
                <span className="version-detail-value">
                  {selectedVersion.parties?.join(', ')}
                </span>
              </div>
            </div>

            {currentContract && (
              <>
                <h4 style={{ marginTop: 'var(--space-lg)', marginBottom: 'var(--space-md)' }}>
                  Changes from this version to current
                </h4>
                {getDiffFields(selectedVersion).length === 0 ? (
                  <p className="text-sm text-muted">No differences from current version</p>
                ) : (
                  <div className="diff-table">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Field</th>
                          <th>This Version</th>
                          <th>Current</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getDiffFields(selectedVersion).map((diff) => (
                          <tr key={diff.field}>
                            <td style={{ textTransform: 'capitalize' }}>{diff.field}</td>
                            <td className="diff-old">{diff.oldVal}</td>
                            <td className="diff-new">{diff.newVal}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </Modal>
    </>
  );
};

export default VersionTimeline;
