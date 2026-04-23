const mongoose = require('mongoose');

const versionSchema = new mongoose.Schema(
  {
    versionNumber: {
      type: Number,
      required: true,
    },
    title: String,
    description: String,
    parties: [String],
    startDate: Date,
    endDate: Date,
    status: {
      type: String,
      enum: ['Draft', 'Active', 'Executed', 'Expired'],
    },
    modifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    modifiedAt: {
      type: Date,
      default: Date.now,
    },
    changeNote: {
      type: String,
      default: '',
    },
  },
  { _id: true }
);

const activityLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      enum: ['CREATED', 'UPDATED', 'STATUS_CHANGED', 'DELETED', 'RESTORED'],
      required: true,
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    details: {
      type: String,
      default: '',
    },
  },
  { _id: true }
);

const contractSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Contract title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },
    parties: {
      type: [String],
      required: [true, 'At least one party is required'],
      validate: {
        validator: function (v) {
          return v && v.length > 0;
        },
        message: 'At least one party must be specified',
      },
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
      validate: {
        validator: function (v) {
          return v > this.startDate;
        },
        message: 'End date must be after start date',
      },
    },
    status: {
      type: String,
      enum: ['Draft', 'Active', 'Executed', 'Expired'],
      default: 'Draft',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    versions: [versionSchema],
    activityLog: [activityLogSchema],
  },
  {
    timestamps: true,
  }
);

// Indexes for search/filter performance
contractSchema.index({ title: 'text', parties: 'text' });
contractSchema.index({ status: 1 });
contractSchema.index({ createdBy: 1 });
contractSchema.index({ isDeleted: 1 });
contractSchema.index({ createdAt: -1 });

// Valid status transitions
const STATUS_TRANSITIONS = {
  Draft: ['Active'],
  Active: ['Executed', 'Expired'],
  Executed: ['Expired'],
  Expired: [],
};

// Validate status transition
contractSchema.methods.canTransitionTo = function (newStatus) {
  if (this.status === newStatus) return true;
  const allowedTransitions = STATUS_TRANSITIONS[this.status] || [];
  return allowedTransitions.includes(newStatus);
};

// Create a version snapshot before updating
contractSchema.methods.createVersionSnapshot = function (userId, changeNote) {
  const versionNumber = this.versions.length + 1;
  this.versions.push({
    versionNumber,
    title: this.title,
    description: this.description,
    parties: [...this.parties],
    startDate: this.startDate,
    endDate: this.endDate,
    status: this.status,
    modifiedBy: userId,
    modifiedAt: new Date(),
    changeNote: changeNote || '',
  });
  return versionNumber;
};

// Add activity log entry
contractSchema.methods.addActivityLog = function (action, userId, details) {
  this.activityLog.push({
    action,
    performedBy: userId,
    timestamp: new Date(),
    details: details || '',
  });
};

// Soft delete
contractSchema.methods.softDelete = function (userId) {
  this.isDeleted = true;
  this.deletedAt = new Date();
  this.addActivityLog('DELETED', userId, 'Contract soft deleted');
};

module.exports = mongoose.model('Contract', contractSchema);
