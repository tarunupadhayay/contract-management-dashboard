import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createContract } from '../store/contractSlice';
import ContractForm from '../components/ContractForm';
import { toast } from 'react-toastify';
import { HiOutlineArrowLeft } from 'react-icons/hi';
import './CreateContract.css';

const CreateContract = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.contracts);

  const handleSubmit = async (data) => {
    try {
      await dispatch(createContract(data)).unwrap();
      toast.success('Contract created successfully!');
      navigate('/contracts');
    } catch (err) {
      toast.error(err || 'Failed to create contract');
    }
  };

  return (
    <div className="create-contract-page" id="create-contract-page">
      <div className="detail-breadcrumb">
        <button className="breadcrumb-link" onClick={() => navigate(-1)}>
          <HiOutlineArrowLeft size={16} />
          Back
        </button>
      </div>

      <div className="page-header">
        <div>
          <h1 className="page-title">Create Contract</h1>
          <p className="page-subtitle">Fill in the details to create a new contract</p>
        </div>
      </div>

      <div className="glass-card form-card">
        <ContractForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  );
};

export default CreateContract;
