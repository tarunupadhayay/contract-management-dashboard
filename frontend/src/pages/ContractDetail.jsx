import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchContractById, fetchVersions, clearCurrentContract, deleteContract } from '../store/contractSlice';
import StatusBadge from '../components/StatusBadge';
import ActivityLog from '../components/ActivityLog';
import VersionTimeline from '../components/VersionTimeline';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import {
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineCalendar,
  HiOutlineUsers,
  HiOutlineUser,
  HiOutlineArrowLeft,
  HiOutlineClock,
} from 'react-icons/hi';
import './ContractDetail.css';

const ContractDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentContract, versions, detailLoading } = useSelector((state) => state.contracts);
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('details');
  const [deleteModal, setDeleteModal] = useState(false);

  useEffect(() => {
    dispatch(fetchContractById(id));
    dispatch(fetchVersions(id));

    return () => {
      dispatch(clearCurrentContract());
    };
  }, [id, dispatch]);

  const canEdit =
    user?.role === 'admin' ||
    currentContract?.createdBy?._id === user?.id;

  const handleDelete = async () => {
    try {
      await dispatch(deleteContract(id)).unwrap();
      toast.success('Contract deleted successfully');
      navigate('/contracts');
    } catch (err) {
      toast.error(err || 'Failed to delete');
    }
  };

  if (detailLoading || !currentContract) {
    return <LoadingSpinner text="Loading contract details..." />;
  }

  const contract = currentContract;

  return (
    <div className="contract-detail-page" id="contract-detail-page">
      {/* Breadcrumb */}
      <div className="detail-breadcrumb">
        <Link to="/contracts" className="breadcrumb-link">
          <HiOutlineArrowLeft size={16} />
          Back to Contracts
        </Link>
      </div>

      {/* Header */}
      <div className="detail-header glass-card">
        <div className="detail-header-top">
          <div className="detail-header-info">
            <div className="flex items-center gap-md" style={{ flexWrap: 'wrap' }}>
              <h1 className="detail-title">{contract.title}</h1>
              <StatusBadge status={contract.status} />
            </div>
            <p className="detail-meta">
              Created by {contract.createdBy?.name || 'Unknown'} on{' '}
              {dayjs(contract.createdAt).format('MMMM D, YYYY')}
            </p>
          </div>
          {canEdit && (
            <div className="detail-actions">
              <Link to={`/contracts/${id}/edit`} className="btn btn-secondary" id="edit-contract-btn">
                <HiOutlinePencil size={16} />
                Edit
              </Link>
              <button
                className="btn btn-danger"
                onClick={() => setDeleteModal(true)}
                id="delete-contract-btn"
              >
                <HiOutlineTrash size={16} />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="detail-tabs">
        <button
          className={`detail-tab ${activeTab === 'details' ? 'active' : ''}`}
          onClick={() => setActiveTab('details')}
          id="tab-details"
        >
          Details
        </button>
        <button
          className={`detail-tab ${activeTab === 'activity' ? 'active' : ''}`}
          onClick={() => setActiveTab('activity')}
          id="tab-activity"
        >
          Activity Log
        </button>
        <button
          className={`detail-tab ${activeTab === 'versions' ? 'active' : ''}`}
          onClick={() => setActiveTab('versions')}
          id="tab-versions"
        >
          Version History ({versions?.length || 0})
        </button>
      </div>

      {/* Tab Content */}
      <div className="detail-content animate-fade-in" key={activeTab}>
        {activeTab === 'details' && (
          <div className="detail-grid">
            <div className="glass-card detail-section">
              <h3 className="detail-section-title">Description</h3>
              <p className="detail-description">{contract.description}</p>
            </div>

            <div className="glass-card detail-section">
              <h3 className="detail-section-title">
                <HiOutlineUsers size={18} />
                Parties Involved
              </h3>
              <div className="detail-parties">
                {contract.parties?.map((party, index) => (
                  <div className="detail-party-item" key={index}>
                    <HiOutlineUser size={16} />
                    <span>{party}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card detail-section">
              <h3 className="detail-section-title">
                <HiOutlineCalendar size={18} />
                Timeline
              </h3>
              <div className="detail-timeline-grid">
                <div className="timeline-item">
                  <span className="timeline-label">Start Date</span>
                  <span className="timeline-value">
                    {dayjs(contract.startDate).format('MMMM D, YYYY')}
                  </span>
                </div>
                <div className="timeline-item">
                  <span className="timeline-label">End Date</span>
                  <span className="timeline-value">
                    {dayjs(contract.endDate).format('MMMM D, YYYY')}
                  </span>
                </div>
                <div className="timeline-item">
                  <span className="timeline-label">Duration</span>
                  <span className="timeline-value">
                    {dayjs(contract.endDate).diff(dayjs(contract.startDate), 'day')} days
                  </span>
                </div>
                <div className="timeline-item">
                  <span className="timeline-label">Last Updated</span>
                  <span className="timeline-value">
                    {dayjs(contract.updatedAt).format('MMMM D, YYYY h:mm A')}
                  </span>
                </div>
              </div>
            </div>

            <div className="glass-card detail-section">
              <h3 className="detail-section-title">
                <HiOutlineClock size={18} />
                Metadata
              </h3>
              <div className="detail-timeline-grid">
                <div className="timeline-item">
                  <span className="timeline-label">Contract ID</span>
                  <span className="timeline-value" style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                    {contract._id}
                  </span>
                </div>
                <div className="timeline-item">
                  <span className="timeline-label">Created By</span>
                  <span className="timeline-value">{contract.createdBy?.name}</span>
                </div>
                <div className="timeline-item">
                  <span className="timeline-label">Created At</span>
                  <span className="timeline-value">
                    {dayjs(contract.createdAt).format('MMMM D, YYYY h:mm A')}
                  </span>
                </div>
                <div className="timeline-item">
                  <span className="timeline-label">Total Versions</span>
                  <span className="timeline-value">{contract.versions?.length || 0}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="glass-card detail-section">
            <h3 className="detail-section-title">Activity Timeline</h3>
            <ActivityLog activities={contract.activityLog} />
          </div>
        )}

        {activeTab === 'versions' && (
          <div className="glass-card detail-section">
            <h3 className="detail-section-title">Version History</h3>
            <VersionTimeline versions={versions} currentContract={contract} />
          </div>
        )}
      </div>

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        title="Delete Contract"
        size="sm"
      >
        <div className="delete-confirm">
          <p>Are you sure you want to delete &quot;{contract.title}&quot;?</p>
          <p className="text-sm text-muted" style={{ marginTop: '8px' }}>
            This action will soft-delete the contract.
          </p>
          <div className="modal-footer" style={{ marginTop: '20px', padding: 0, borderTop: 'none' }}>
            <button className="btn btn-secondary" onClick={() => setDeleteModal(false)}>
              Cancel
            </button>
            <button className="btn btn-danger" onClick={handleDelete}>
              <HiOutlineTrash size={16} />
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ContractDetail;
