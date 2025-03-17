import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface TransactionState {
  transaction_id: string;
  transaction_value: number;
  transaction_date: number;
  transaction_status: TransactionStatus;
  created_at: string;
  updated_at: string;
}

export enum TransactionStatus {
  PENDING = "pending",
  COMPLETED = "completed",
}

export const transactionsApi = createApi({
  reducerPath: "transactionsApi",
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BASE_URL }),
  endpoints: (builder) => ({
    getTransactions: builder.query({
      query: () => "transactions",
    }),
    addTransaction: builder.mutation({
      query: (body) => ({
        url: "transactions",
        method: "POST",
        body,
      }),
    }),
    updateTransaction: builder.mutation({
      query: (body) => ({
        url: `transactions/${body._id}`,
        method: "PUT",
        body,
      }),
    }),
    deleteTransaction: builder.mutation({
      query: (transaction_id) => ({
        url: `transactions/${transaction_id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const { useGetTransactionsQuery, useAddTransactionMutation, useUpdateTransactionMutation, useDeleteTransactionMutation } = transactionsApi;
