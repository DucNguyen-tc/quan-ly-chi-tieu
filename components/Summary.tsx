import { Transaction } from "@/types";

interface Props {
  transactions: Transaction[];
}

export default function Summary({ transactions }: Props) {
  // Logic tính toán thần thánh
  // Dùng reduce để cộng dồn tiền. 
  // acc là biến tích lũy, curr là thằng hiện tại đang xét
  
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const balance = totalIncome - totalExpense;

  return (
    <div className="grid grid-cols-3 gap-4 mb-6 text-center">
      {/* Thẻ Số dư */}
      <div className="bg-white p-4 rounded shadow border-t-4 border-blue-500">
        <p className="text-gray-500 text-sm font-bold uppercase">Số dư hiện tại</p>
        <p className={`text-xl font-bold ${balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
          {balance.toLocaleString()} đ
        </p>
      </div>

      {/* Thẻ Tổng thu */}
      <div className="bg-white p-4 rounded shadow border-t-4 border-green-500">
        <p className="text-gray-500 text-sm font-bold uppercase">Tổng thu</p>
        <p className="text-xl font-bold text-green-600">
          +{totalIncome.toLocaleString()} đ
        </p>
      </div>

      {/* Thẻ Tổng chi */}
      <div className="bg-white p-4 rounded shadow border-t-4 border-red-500">
        <p className="text-gray-500 text-sm font-bold uppercase">Tổng chi</p>
        <p className="text-xl font-bold text-red-500">
          -{totalExpense.toLocaleString()} đ
        </p>
      </div>
    </div>
  );
}