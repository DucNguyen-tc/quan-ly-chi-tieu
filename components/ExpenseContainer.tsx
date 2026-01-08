"use client";

import { useState, useEffect, use } from "react";
import { Transaction, TransactionFormData } from "@/types";
import ExpenseForm from "./ExpenseForm";
import ExpenseList from "./ExpenseList";
import Summary from "./Summary";

export default function ExpenseContainer() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  // 1. Thêm state lưu tỷ giá
  const [rate, setRate] = useState<number>(0);

  // 2. Viết hàm fetch API (chạy 1 lần khi mở web)
  useEffect(() => {
    const fetchRate = async () => {
      try {
        const res = await fetch("https://open.er-api.com/v6/latest/USD");
        const data = await res.json();
        // API này trả về rates.VND, lấy nó lưu vào state
        setRate(data.rates.VND);
      } catch (error) {
        console.error("Lỗi lấy tỷ giá:", error);
      }
    };

    fetchRate();
  }, []);

  useEffect(() => {
    const storedTransactions = localStorage.getItem("transactions");
    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions));
    }
    setIsLoading(true);
  }, []);

  useEffect(() => {
    if (isLoading)
      localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions, isLoading]);

  const handleDelete = (id: string) => {
    const updateTransactions = transactions.filter((item) => item.id !== id);
    setTransactions(updateTransactions);
  };

  const handleAdd = (formData: TransactionFormData) => {
    const newTransaction = {
      id: crypto.randomUUID(),
      ...formData,
    };
    setTransactions([newTransaction, ...transactions]);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Quản Lý Chi Tiêu</h2>
      <div className="text-sm text-gray-500 mb-4 italic">
        🇺🇸 1 USD = {rate ? rate.toLocaleString() : "..."} VND
      </div>

      <Summary transactions={transactions}></Summary>

      <ExpenseForm onAdd={handleAdd} />

      <div className="bg-gray-100 p-4 rounded">
        <h3 className="font-bold">Danh sách giao dịch (Test):</h3>
        <ExpenseList data={transactions} onDelete={handleDelete} />
      </div>
    </div>
  );
}
