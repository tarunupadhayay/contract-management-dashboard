import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchContracts, setFilters, resetFilters, deleteContract } from '../store/contractSlice';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import StatusBadge from '../components/StatusBadge';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import {
  HiOutlineEye,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlinePlusCircle,
  HiOutlineFilter,
  HiOutlineDocumentText,
} from 'react-icons/hi';
import './ContractList.css';

const ContractList = () => {
  const dispatch = useDispatch();
  const { contracts, pagination, filters, loading } = useSelector((state) => state.contracts);
  const { user } = useSelector((state) => state.auth);
  const [showFilters, setShowFilters] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ open: false, contract: null });

  useEffect(() => {
    loadContracts();
  }, [filters]);

  const loadContracts = (page = 1) => {
    const params = {
      page,
      limit: 10,
      ...filters,
    };
    // Remove empty filter values
    Object.keys(params).forEach((key) => {
      if (!params[key]) delete params[key];
    });
    dispatch(fetchContracts(params));
  };

  const handleSearch = (search) => {
    dispatch(setFilters({ search }));
  };

  const handleFilterChange = (newFilters) => {
    dispatch(setFilters(newFilters));
  };

  const handleReset = () => {
    dispatch(resetFilters());
  };

  const handlePageChange = (page) => {
    loadContracts(page);
  };

  const handleDelete = async () => {
    if (!deleteModal.contract) return;
    try {
      await dispatch(deleteContract(deleteModal.contract._id)).unwrap();
      toast.success('Contract deleted successfully');
      setDeleteModal({ open: false, contract: null });
      loadContracts();
    } catch (err) {
      toast.error(err || 'Failed to delete contract');
    }
  };

  return (
    <div className="contract-list-page" id="contract-list-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Contracts</h1>
          <p className="page-subtitle">{pagination.totalItems} contracts found</p>
        </div>
        <div className="flex gap-sm">
          <button
            className={`btn btn-secondary ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
            id="toggle-filters-btn"
          >
            <HiOutlineFilter size={16} />
            Filters
          </button>
          <Link to="/contracts/new" className="btn btn-primary" id="new-contract-btn">
            <HiOutlinePlusCircle size={16} />
            New Contract
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="contract-list-search">
        <SearchBar
          value={filters.search}
          onChange={handleSearch}
          placeholder="Search by title or party name..."
        />
      </div>

      {/* Filters */}
      {showFilters && (
        <FilterPanel
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleReset}
        />
      )}

      {/* Table */}
      {loading ? (
        <LoadingSpinner text="Loading contracts..." />
      ) : contracts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <HiOutlineDocumentText size={48} />
          </div>
          <h3 className="empty-state-title">No contracts found</h3>
          <p className="empty-state-text">
            {filters.search || filters.status
              ? 'Try adjusting your search or filters'
              : 'Get started by creating your first contract'}
          </p>
          {!filters.search && !filters.status && (
            <Link to="/contracts/new" className="btn btn-primary" style={{ marginTop: '16px' }}>
              <HiOutlinePlusCircle size={16} />
              Create Contract
            </Link>
          )}
        </div>
      ) : (
        <div className="glass-card contract-table-wrapper animate-fade-in">
          <table className="data-table" id="contracts-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Parties</th>
                <th>Status</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Created</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {contracts.map((contract) => (
                <tr key={contract._id} className="contract-row">
                  <td>
                    <Link to={`/contracts/${contract._id}`} className="contract-title-link">
                      {contract.title}
                    </Link>
                  </td>
                  <td>
                    <div className="parties-cell">
                      {contract.parties?.slice(0, 2).map((p, i) => (
                        <span key={i} className="party-tag">{p}</span>
                      ))}
                      {contract.parties?.length > 2 && (
                        <span className="party-more">+{contract.parties.length - 2}</span>
                      )}
                    </div>
                  </td>
                  <td><StatusBadge status={contract.status} /></td>
                  <td>{dayjs(contract.startDate).format('MMM D, YYYY')}</td>
                  <td>{dayjs(contract.endDate).format('MMM D, YYYY')}</td>
                  <td>{dayjs(contract.createdAt).format('MMM D, YYYY')}</td>
                  <td>
                    <div className="action-buttons">
                      <Link
                        to={`/contracts/${contract._id}`}
                        className="btn btn-icon btn-ghost btn-sm"
                        title="View"
                      >
                        <HiOutlineEye size={16} />
                      </Link>
                      {(user?.role === 'admin' || contract.createdBy?._id === user?.id) && (
                        <>
                          <Link
                            to={`/contracts/${contract._id}/edit`}
                            className="btn btn-icon btn-ghost btn-sm"
                            title="Edit"
                          >
                            <HiOutlinePencil size={16} />
                          </Link>
                          <button
                            className="btn btn-icon btn-ghost btn-sm"
                            title="Delete"
                            onClick={() => setDeleteModal({ open: true, contract })}
                          >
                            <HiOutlineTrash size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination pagination={pagination} onPageChange={handlePageChange} />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, contract: null })}
        title="Delete Contract"
        size="sm"
      >
        <div className="delete-confirm">
          <p>Are you sure you want to delete &quot;{deleteModal.contract?.title}&quot;?</p>
          <p className="text-sm text-muted" style={{ marginTop: '8px' }}>
            This action will soft-delete the contract. It can be recovered by an admin.
          </p>
          <div className="modal-footer" style={{ marginTop: '20px', padding: 0, borderTop: 'none' }}>
            <button
              className="btn btn-secondary"
              onClick={() => setDeleteModal({ open: false, contract: null })}
            >
              Cancel
            </button>
            <button
              className="btn btn-danger"
              onClick={handleDelete}
              id="confirm-delete-btn"
            >
              <HiOutlineTrash size={16} />
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ContractList;
