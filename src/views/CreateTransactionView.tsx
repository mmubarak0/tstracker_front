import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TransactionStatus, useAddTransactionMutation, useGetTransactionsQuery } from "../store/slices/transactionsSlice";

function CreateTransactionView() {
  const navigate = useNavigate();
  const [addTransaction, addTransactionResult] = useAddTransactionMutation();
  const { refetch: refetchTransactions } = useGetTransactionsQuery({});
  const today = +new Date();
  const [formData, setFormData] = useState({
    transaction_id: "",
    transaction_value: 0,
    transaction_date: today,
    transaction_status: TransactionStatus.PENDING,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addTransaction(formData);
    if (addTransactionResult.error) {
      alert("Failed to create transaction");
      return;
    }
    await refetchTransactions();
    alert("Transaction created successfully");
    navigate("/");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create Transaction</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-control">
          <label htmlFor="transaction_id" className="label">
            <span className="label-text">Transaction ID:</span>
          </label>
          <input
            type="text"
            id="transaction_id"
            name="transaction_id"
            value={formData.transaction_id}
            onChange={handleChange}
            required
            className="input input-bordered w-full"
          />
        </div>
        <div className="form-control">
          <label htmlFor="transaction_value" className="label">
            <span className="label-text">Transaction Value:</span>
          </label>
          <input
            type="number"
            id="transaction_value"
            name="transaction_value"
            value={formData.transaction_value}
            onChange={handleChange}
            required
            className="input input-bordered w-full"
          />
        </div>
        <div className="form-control">
          <label htmlFor="transaction_date" className="label">
            <span className="label-text">Transaction Date:</span>
          </label>
          <input
            type="datetime-local"
            id="transaction_date"
            name="transaction_date"
            value={new Date(formData.transaction_date)
              .toISOString()
              .slice(0, 16)}
            onChange={handleChange}
            required
            className="input input-bordered w-full"
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={addTransactionResult.isLoading}
        >
          Create Transaction
        </button>
      </form>
    </div>
  );
}

export default CreateTransactionView;
