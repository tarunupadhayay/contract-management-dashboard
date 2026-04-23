import React, { useState, useEffect } from 'react';
import { HiOutlinePlus, HiOutlineX } from 'react-icons/hi';
import './ContractForm.css';

const ContractForm = ({ initialData = null, onSubmit, loading = false, isEdit = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    parties: [''],
    startDate: '',
    endDate: '',
    status: 'Draft',
    changeNote: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        parties: initialData.parties?.length > 0 ? initialData.parties : [''],
        startDate: initialData.startDate ? initialData.startDate.split('T')[0] : '',
        endDate: initialData.endDate ? initialData.endDate.split('T')[0] : '',
        status: initialData.status || 'Draft',
        changeNote: '',
      });
    }
  }, [initialData]);

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (formData.title.length < 3) newErrors.title = 'Title must be at least 3 characters';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (formData.startDate && formData.endDate && formData.endDate <= formData.startDate) {
      newErrors.endDate = 'End date must be after start date';
    }
    const validParties = formData.parties.filter((p) => p.trim());
    if (validParties.length === 0) newErrors.parties = 'At least one party is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handlePartyChange = (index, value) => {
    const newParties = [...formData.parties];
    newParties[index] = value;
    setFormData((prev) => ({ ...prev, parties: newParties }));
  };

  const addParty = () => {
    setFormData((prev) => ({ ...prev, parties: [...prev.parties, ''] }));
  };

  const removeParty = (index) => {
    if (formData.parties.length <= 1) return;
    const newParties = formData.parties.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, parties: newParties }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const submitData = {
      ...formData,
      parties: formData.parties.filter((p) => p.trim()),
    };
    onSubmit(submitData);
  };

  // Available statuses for edit
  const statusTransitions = {
    Draft: ['Draft', 'Active'],
    Active: ['Active', 'Executed', 'Expired'],
    Executed: ['Executed', 'Expired'],
    Expired: ['Expired'],
  };

  const availableStatuses = isEdit && initialData
    ? statusTransitions[initialData.status] || [initialData.status]
    : ['Draft'];

  return (
    <form className="contract-form" onSubmit={handleSubmit} id="contract-form">
      <div className="form-section">
        <h4 className="form-section-title">Contract Details</h4>

        <div className="form-group">
          <label className="form-label" htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            className={`form-input ${errors.title ? 'input-error' : ''}`}
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter contract title"
          />
          {errors.title && <span className="form-error">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            className={`form-input ${errors.description ? 'input-error' : ''}`}
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter contract description"
            rows={4}
          />
          {errors.description && <span className="form-error">{errors.description}</span>}
        </div>
      </div>

      <div className="form-section">
        <h4 className="form-section-title">Parties Involved</h4>
        {formData.parties.map((party, index) => (
          <div className="party-row" key={index}>
            <input
              type="text"
              className={`form-input ${errors.parties ? 'input-error' : ''}`}
              value={party}
              onChange={(e) => handlePartyChange(index, e.target.value)}
              placeholder={`Party ${index + 1}`}
              id={`party-input-${index}`}
            />
            {formData.parties.length > 1 && (
              <button
                type="button"
                className="btn btn-icon btn-danger btn-sm"
                onClick={() => removeParty(index)}
              >
                <HiOutlineX size={16} />
              </button>
            )}
          </div>
        ))}
        {errors.parties && <span className="form-error">{errors.parties}</span>}
        <button
          type="button"
          className="btn btn-secondary btn-sm add-party-btn"
          onClick={addParty}
          id="add-party-btn"
        >
          <HiOutlinePlus size={14} />
          Add Party
        </button>
      </div>

      <div className="form-section">
        <h4 className="form-section-title">Timeline & Status</h4>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="startDate">Start Date *</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              className={`form-input ${errors.startDate ? 'input-error' : ''}`}
              value={formData.startDate}
              onChange={handleChange}
            />
            {errors.startDate && <span className="form-error">{errors.startDate}</span>}
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="endDate">End Date *</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              className={`form-input ${errors.endDate ? 'input-error' : ''}`}
              value={formData.endDate}
              onChange={handleChange}
            />
            {errors.endDate && <span className="form-error">{errors.endDate}</span>}
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              className="form-input"
              value={formData.status}
              onChange={handleChange}
            >
              {availableStatuses.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {isEdit && (
        <div className="form-section">
          <h4 className="form-section-title">Change Note</h4>
          <div className="form-group">
            <input
              type="text"
              name="changeNote"
              className="form-input"
              value={formData.changeNote}
              onChange={handleChange}
              placeholder="Brief description of changes (optional)"
              id="change-note-input"
            />
          </div>
        </div>
      )}

      <div className="form-actions">
        <button
          type="submit"
          className="btn btn-primary btn-lg"
          disabled={loading}
          id="contract-submit-btn"
        >
          {loading ? 'Saving...' : isEdit ? 'Update Contract' : 'Create Contract'}
        </button>
      </div>
    </form>
  );
};

export default ContractForm;
