import { Transaction } from "@/types";

interface Props {
  data: Transaction[];
 onDelete: (id: string) => void; // Chuẩn bị sẵn hàm xóa để tí nữa dùng
}

export default function ExpenseList({ data , onDelete}: Props) {
  return (
    <div className="bg-white p-4 rounded shadow-md">
      <h3 className="font-bold text-lg mb-3 text-gray-700">Lịch sử giao dịch</h3>
      <ul>
        {data.map((item) => (
          <li key={item.id} className="flex justify-between items-center border-b py-2 last:border-0 text-gray-800">
            <div>
              <p className="font-medium">{item.category}</p>
              <p className="text-xs text-gray-500">{item.date}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={item.type === 'income' ? 'text-green-600 font-bold' : 'text-red-500 font-bold'}>
                {item.type === 'income' ? '+' : '-'}{item.amount.toLocaleString()} đ
              </span>
              <button 
                onClick={() => onDelete(item.id)}
                className="bg-red-100 text-red-500 px-2 py-1 rounded text-xs hover:bg-red-200">
                Xóa
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}