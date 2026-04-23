import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { contractApi } from '../api/contractApi';

// Async thunks
export const fetchContracts = createAsyncThunk(
  'contracts/fetchContracts',
  async (params, { rejectWithValue }) => {
    try {
      const response = await contractApi.getContracts(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch contracts');
    }
  }
);

export const fetchContractById = createAsyncThunk(
  'contracts/fetchContractById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await contractApi.getContractById(id);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch contract');
    }
  }
);

export const createContract = createAsyncThunk(
  'contracts/createContract',
  async (data, { rejectWithValue }) => {
    try {
      const response = await contractApi.createContract(data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create contract');
    }
  }
);

export const updateContract = createAsyncThunk(
  'contracts/updateContract',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await contractApi.updateContract(id, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update contract');
    }
  }
);

export const deleteContract = createAsyncThunk(
  'contracts/deleteContract',
  async (id, { rejectWithValue }) => {
    try {
      await contractApi.deleteContract(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete contract');
    }
  }
);

export const fetchVersions = createAsyncThunk(
  'contracts/fetchVersions',
  async (id, { rejectWithValue }) => {
    try {
      const response = await contractApi.getVersions(id);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch versions');
    }
  }
);

const contractSlice = createSlice({
  name: 'contracts',
  initialState: {
    contracts: [],
    currentContract: null,
    versions: [],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      itemsPerPage: 10,
    },
    filters: {
      search: '',
      status: '',
      startDateFrom: '',
      startDateTo: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
    },
    loading: false,
    detailLoading: false,
    error: null,
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = {
        search: '',
        status: '',
        startDateFrom: '',
        startDateTo: '',
        sortBy: 'createdAt',
        sortOrder: 'desc',
      };
    },
    clearCurrentContract: (state) => {
      state.currentContract = null;
      state.versions = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Contracts
    builder
      .addCase(fetchContracts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContracts.fulfilled, (state, action) => {
        state.loading = false;
        state.contracts = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchContracts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch Contract By Id
    builder
      .addCase(fetchContractById.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
      })
      .addCase(fetchContractById.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.currentContract = action.payload;
      })
      .addCase(fetchContractById.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.payload;
      });

    // Create Contract
    builder
      .addCase(createContract.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createContract.fulfilled, (state, action) => {
        state.loading = false;
        state.contracts.unshift(action.payload);
      })
      .addCase(createContract.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update Contract
    builder
      .addCase(updateContract.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateContract.fulfilled, (state, action) => {
        state.loading = false;
        state.currentContract = action.payload;
        const index = state.contracts.findIndex(c => c._id === action.payload._id);
        if (index !== -1) {
          state.contracts[index] = action.payload;
        }
      })
      .addCase(updateContract.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete Contract
    builder
      .addCase(deleteContract.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteContract.fulfilled, (state, action) => {
        state.loading = false;
        state.contracts = state.contracts.filter(c => c._id !== action.payload);
      })
      .addCase(deleteContract.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch Versions
    builder
      .addCase(fetchVersions.pending, (state) => {
        state.detailLoading = true;
      })
      .addCase(fetchVersions.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.versions = action.payload.versions;
      })
      .addCase(fetchVersions.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters, resetFilters, clearCurrentContract, clearError } = contractSlice.actions;
export default contractSlice.reducer;
