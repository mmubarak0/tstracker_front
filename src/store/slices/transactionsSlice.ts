import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export enum TransactionStatus {
  Pending = "Pending",
  Completed = "Completed",
}

export interface TransactionState {
  transaction_id: string;
  transaction_value: number;
  transaction_status: TransactionStatus;
  transaction_date: number;
}

const dates: number[] = [
  +new Date(),
  +new Date(Date.now() - 86400000),
  +new Date(Date.now() - 2 * 86400000),
  +new Date(Date.now() - 30 * 86400000),
];

const initialState: TransactionState[] = [
  {
    transaction_id: "00001",
    transaction_value: 100,
    transaction_status: TransactionStatus.Completed,
    transaction_date: dates[0],
  },
  {
    transaction_id: "00002",
    transaction_value: 200,
    transaction_status: TransactionStatus.Pending,
    transaction_date: dates[1],
  }, // Yesterday
  {
    transaction_id: "00003",
    transaction_value: 300,
    transaction_status: TransactionStatus.Pending,
    transaction_date: dates[2],
  }, // 2 days ago
  {
    transaction_id: "00004",
    transaction_value: 400,
    transaction_status: TransactionStatus.Pending,
    transaction_date: dates[3],
  }, // 30 days ago
  {
    transaction_id: "00005",
    transaction_value: 500,
    transaction_status: TransactionStatus.Pending,
    transaction_date: dates[0],
  },
  {
    transaction_id: "00006",
    transaction_value: 600,
    transaction_status: TransactionStatus.Completed,
    transaction_date: dates[0],
  },
  {
    transaction_id: "00007",
    transaction_value: 700,
    transaction_status: TransactionStatus.Pending,
    transaction_date: dates[0],
  },
];

const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    getAllTransactions(state, action: PayloadAction<{ searchQuery: string }>) {
      const { searchQuery } = action.payload;
      if (searchQuery) {
        return state.filter((transaction) =>
          transaction.transaction_id.includes(searchQuery)
        );
      }
      return state;
    },
    updateTransactionStatus(
      state,
      action: PayloadAction<{
        transaction_id: string;
        transaction_status: TransactionStatus;
      }>
    ) {
      const { transaction_id, transaction_status } = action.payload;
      return state.map((transaction) =>
        transaction.transaction_id === transaction_id
          ? { ...transaction, transaction_status }
          : transaction
      );
    },
    addTransaction(state, action: PayloadAction<TransactionState>) {
      const {
        transaction_id,
        transaction_value,
        transaction_status,
        transaction_date,
      } = action.payload;
      state.push({
        transaction_id,
        transaction_value,
        transaction_status,
        transaction_date,
      });
    },
  },
});

export const { getAllTransactions, updateTransactionStatus, addTransaction } =
  transactionsSlice.actions;
export default transactionsSlice.reducer;
