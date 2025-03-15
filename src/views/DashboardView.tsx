import React from "react";
import { Link } from "react-router-dom";
import { TransactionState, useGetTransactionsQuery } from "../store/slices/transactionsSlice";

const DashboardView: React.FC = () => {
  const { data, error, isLoading } = useGetTransactionsQuery({});

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.toString()}</p>;

  const transactions = data?.data;
  console.log(transactions);

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const totalToday = transactions
    .filter((transaction: TransactionState) => isSameDay(new Date(transaction.transaction_date), today))
    .reduce((total: number, transaction: TransactionState) => total + +transaction.transaction_value, 0);
  console.log(totalToday);

  const totalYesterday = transactions
    .filter((transaction: TransactionState) => isSameDay(new Date(transaction.transaction_date), yesterday))
    .reduce((total: number, transaction: TransactionState) => total + +transaction.transaction_value, 0);

  const totalThisMonth = transactions
    .filter(
      (transaction: TransactionState) =>
        new Date(transaction.transaction_date).getMonth() === today.getMonth() &&
        new Date(transaction.transaction_date).getFullYear() === today.getFullYear()
    )
    .reduce((total: number, transaction: TransactionState) => total + +transaction.transaction_value, 0);

  const totalAllTime = transactions
    .reduce((total: number, transaction: TransactionState) => total + +transaction.transaction_value, 0);

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Link to="/create_transaction" className="btn btn-primary">
          Add Transaction
        </Link>
      </div>
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Total Today</h2>
              <p>${totalToday}</p>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Total Yesterday</h2>
              <p>${totalYesterday}</p>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Total This Month</h2>
              <p>${totalThisMonth}</p>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Total of all Time</h2>
              <p>${totalAllTime}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardView;
