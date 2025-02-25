import React, { useState } from "react";
import { Link } from "react-router-dom";
import type { RootState } from "../store/index";
import { useAppDispatch, useAppSelector } from "../hooks/redux-hooks";
import {
  TransactionStatus,
  updateTransactionStatus,
} from "../store/slices/transactionsSlice";

const TransactionsView: React.FC = () => {
  const transactions = useAppSelector((state: RootState) => state.transactions);
  const dispatch = useAppDispatch();
  const [searchQuery, setSearchQuery] = useState("");

  const handleCheckboxChange = (transaction_id: string) => {
    dispatch(
      updateTransactionStatus({
        transaction_id,
        transaction_status:
          transactions.find(
            (transaction) => transaction.transaction_id === transaction_id
          )?.transaction_status === TransactionStatus.Pending
            ? TransactionStatus.Completed
            : TransactionStatus.Pending,
      })
    );
  };

  const filteredTransactions = transactions.filter((transaction) =>
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
          {filteredTransactions.map((transaction) => (
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
                      TransactionStatus.Completed
                    }
                    onChange={() =>
                      handleCheckboxChange(transaction.transaction_id)
                    }
                    className="checkbox checkbox-success"
                  />
                  <span className="ml-2">
                    {transaction.transaction_status ===
                    TransactionStatus.Completed
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
