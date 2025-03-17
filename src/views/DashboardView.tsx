import React from "react";
import { Link } from "react-router-dom";
import { TransactionState, useGetTransactionsQuery } from "../store/slices/transactionsSlice";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  scales,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: false,
      text: 'Transactions Data',
    },
  },
};


const DashboardView: React.FC = () => {
  const { data, error, isLoading } = useGetTransactionsQuery({});

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.toString()}</p>;

  const transactions = data?.data;

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

  const numberOfDays = 15;
  const meantDate = (i: number): Date => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    // set the date to the end of the day
    date.setHours(23, 59, 59, 999);
    return date;
  }
  const labels = Array.from({ length: numberOfDays }, (_, i) => {
    return meantDate(i).toDateString();
  }).reverse()

  // Get the net profit for each day
  const netProfitDumpData = Array.from({ length: numberOfDays }, (_, i) => {
    const date = meantDate(i);
    // calculate the net profit for each day
    return transactions
      .filter((transaction: TransactionState) => isSameDay(new Date(transaction.transaction_date), date))
      .reduce((total: number, transaction: TransactionState) => total + +transaction.transaction_value, 0);
  }).reverse();

  const profileDumpData = Array.from({ length: numberOfDays }, (_, i) => {
    const date = meantDate(i);
    // calculate every transaction before this day
    return transactions
      .filter((transaction: TransactionState) => new Date(transaction.transaction_date) <= date)
      .reduce((total: number, transaction: TransactionState) => total + +transaction.transaction_value, 0);
  }).reverse();

  const chartOfNetData: any = {
    labels: labels,
    datasets: [
      {
        label: 'Net Profit over the last ' + numberOfDays.toString() + ' days',
        data: netProfitDumpData,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        pointRadius: 10,
        pointHoverRadius: 15,
        cubicInterpolationMode: 'monotone',
      },
    ],
  };
  const chartOfProfileData: any = {
    labels: labels,
    datasets: [
      {
        label: 'Profile over the last ' + numberOfDays.toString() + ' days',
        data: profileDumpData,
        fill: true,
        borderColor: 'rgb(255, 99, 132)',
        pointRadius: 10,
        pointHoverRadius: 15,
        stepped: true,
      },
    ],
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Link to="/create_transaction" className="btn btn-primary">
          Add Transaction
        </Link>
      </div>
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="card bg-base-100 shadow-xl place-items-center">
            <div className="card-body">
              <h2 className="card-title">Today Net Profit</h2>
              <p>${totalToday}</p>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl place-items-center">
            <div className="card-body">
              <h2 className="card-title">Yesterday Net Profit</h2>
              <p>${totalYesterday}</p>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl place-items-center">
            <div className="card-body">
              <h2 className="card-title">This Month Profit</h2>
              <p>${totalThisMonth}</p>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl place-items-center">
            <div className="card-body">
              <h2 className="card-title">Profile Holdings</h2>
              <p>${totalAllTime}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="h-96 bar-chart">
        <Line data={chartOfNetData} options={options} />
        <Line data={chartOfProfileData} options={options} />
      </div>
    </>
  );
};

export default DashboardView;
