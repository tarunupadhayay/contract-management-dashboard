import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchContractById, updateContract, clearCurrentContract } from '../store/contractSlice';
import ContractForm from '../components/ContractForm';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-toastify';
import { HiOutlineArrowLeft } from 'react-icons/hi';
import './CreateContract.css';

const EditContract = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentContract, detailLoading, loading } = useSelector((state) => state.contracts);

  useEffect(() => {
    dispatch(fetchContractById(id));
    return () => {
      dispatch(clearCurrentContract());
    };
  }, [id, dispatch]);

  const handleSubmit = async (data) => {
    try {
      await dispatch(updateContract({ id, data })).unwrap();
      toast.success('Contract updated successfully!');
      navigate(`/contracts/${id}`);
    } catch (err) {
      toast.error(err || 'Failed to update contract');
    }
  };

  if (detailLoading || !currentContract) {
    return <LoadingSpinner text="Loading contract..." />;
  }

  return (
    <div className="edit-contract-page" id="edit-contract-page">
      <div className="detail-breadcrumb">
        <button className="breadcrumb-link" onClick={() => navigate(-1)}>
          <HiOutlineArrowLeft size={16} />
          Back
        </button>
      </div>

      <div className="page-header">
        <div>
          <h1 className="page-title">Edit Contract</h1>
          <p className="page-subtitle">Update the contract details below</p>
        </div>
      </div>

      <div className="glass-card form-card">
        <ContractForm
          initialData={currentContract}
          onSubmit={handleSubmit}
          loading={loading}
          isEdit
        />
      </div>
    </div>
  );
};

export default EditContract;
