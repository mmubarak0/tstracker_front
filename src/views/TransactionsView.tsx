import React, { useState } from "react";
import { Link } from "react-router-dom";
import { TransactionState, TransactionStatus, useGetTransactionsQuery, useUpdateTransactionMutation } from "../store/slices/transactionsSlice";

const TransactionsView: React.FC = () => {
  const { data, error, isLoading, refetch } = useGetTransactionsQuery({});
  const [updateTransaction, updateTransactionResult] = useUpdateTransactionMutation();
  const [searchQuery, setSearchQuery] = useState("");

  if (isLoading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>Error: {error.toString()}</p>;
  }
  const transactions = data?.data;

  const handleCheckboxChange = async (transaction_id: string) => {
    const transaction = transactions?.find(
      (transaction: TransactionState) => transaction.transaction_id === transaction_id
    );

    if (!transaction) {
      return;
    }

    const updatedTransaction = {
      ...transaction,
      transaction_status:
        transaction.transaction_status === TransactionStatus.COMPLETED
          ? TransactionStatus.PENDING
          : TransactionStatus.COMPLETED,
    };

    await updateTransaction(updatedTransaction);
    await refetch();
  };

  const filteredTransactions = transactions?.filter((transaction) =>
    transaction.transaction_id.includes(searchQuery)
  );

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <Link to="/create_transaction" className="btn btn-primary">
          Add Transaction
        </Link>
      </div>
      <div className="container mx-auto p-4">
        <input
          type="text"
          placeholder="Search by Transaction ID"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input input-bordered w-full mb-4"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-center">
          {filteredTransactions?.map((transaction) => (
            <div
              key={transaction.transaction_id}
              className="card bg-base-100 shadow-xl"
            >
              <div className="card-body">
                <h2 className="card-title">
                  Transaction ID: {transaction.transaction_id}
                </h2>
                <p>Value: ${transaction.transaction_value}</p>
                <label className="flex justify-center">
                  <input
                    type="checkbox"
                    checked={
                      transaction.transaction_status ===
                      TransactionStatus.COMPLETED
                    }
                    onChange={() =>
                      handleCheckboxChange(transaction.transaction_id)
                    }
                    disabled={updateTransactionResult.isLoading}
                    className="checkbox checkbox-success"
                  />
                  <span className="ml-2">
                    {transaction.transaction_status ===
                      TransactionStatus.COMPLETED
                      ? "Completed"
                      : "Pending"}
                  </span>
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default TransactionsView;
