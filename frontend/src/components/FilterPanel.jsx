import React from 'react';
import { HiOutlineFilter, HiX } from 'react-icons/hi';
import './FilterPanel.css';

const FilterPanel = ({ filters, onFilterChange, onReset }) => {
  const hasActiveFilters = filters.status || filters.startDateFrom || filters.startDateTo;

  return (
    <div className="filter-panel glass-card" id="filter-panel">
      <div className="filter-panel-header">
        <div className="filter-panel-title">
          <HiOutlineFilter size={16} />
          <span>Filters</span>
        </div>
        {hasActiveFilters && (
          <button className="btn btn-ghost btn-sm" onClick={onReset} id="filter-reset-btn">
            <HiX size={14} />
            Clear
          </button>
        )}
      </div>

      <div className="filter-panel-body">
        <div className="filter-group">
          <label className="form-label">Status</label>
          <select
            className="form-input"
            value={filters.status}
            onChange={(e) => onFilterChange({ status: e.target.value })}
            id="filter-status"
          >
            <option value="">All Statuses</option>
            <option value="Draft">Draft</option>
            <option value="Active">Active</option>
            <option value="Executed">Executed</option>
            <option value="Expired">Expired</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="form-label">Start Date From</label>
          <input
            type="date"
            className="form-input"
            value={filters.startDateFrom}
            onChange={(e) => onFilterChange({ startDateFrom: e.target.value })}
            id="filter-date-from"
          />
        </div>

        <div className="filter-group">
          <label className="form-label">Start Date To</label>
          <input
            type="date"
            className="form-input"
            value={filters.startDateTo}
            onChange={(e) => onFilterChange({ startDateTo: e.target.value })}
            id="filter-date-to"
          />
        </div>

        <div className="filter-group">
          <label className="form-label">Sort By</label>
          <select
            className="form-input"
            value={filters.sortBy}
            onChange={(e) => onFilterChange({ sortBy: e.target.value })}
            id="filter-sort-by"
          >
            <option value="createdAt">Created Date</option>
            <option value="updatedAt">Updated Date</option>
            <option value="title">Title</option>
            <option value="startDate">Start Date</option>
            <option value="endDate">End Date</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="form-label">Order</label>
          <select
            className="form-input"
            value={filters.sortOrder}
            onChange={(e) => onFilterChange({ sortOrder: e.target.value })}
            id="filter-sort-order"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
