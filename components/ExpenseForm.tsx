'use client';

import { useState } from 'react';
import { TransactionFormData } from '@/types'; 

interface Props {
  onAdd: (data: TransactionFormData) => void;
}

export default function ExpenseForm({ onAdd }: Props) {
  // State quản lý form
  const [formData, setFormData] = useState<TransactionFormData>({
    amount: 0,
    date: new Date().toISOString().split('T')[0], // Lấy ngày hôm nay (YYYY-MM-DD)
    category: '',
    type: 'expense', // Mặc định là Chi
    note: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Chặn việc load lại trang

    if (formData.amount <= 0 || !formData.category) {
      alert('Vui lòng nhập số tiền và danh mục!');
      return;
    }

    onAdd(formData);

    setFormData({ ...formData, amount: 0, note: '', category: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-md mb-4 text-gray-800">
      <h3 className="font-bold text-lg mb-3">Thêm giao dịch mới</h3>
      
      <div className="grid grid-cols-2 gap-3 mb-3">
        {/* Nhập tiền */}
        <div>
          <label className="block text-sm mb-1">Số tiền</label>
          <input 
            type="number" 
            className="w-full border p-2 rounded"
            value={formData.amount || ''} // Để trống nếu là 0 cho dễ nhìn
            onChange={e => setFormData({...formData, amount: Number(e.target.value)})}
            placeholder="0"
          />
        </div>
        
        {/* Nhập ngày */}
        <div>
           <label className="block text-sm mb-1">Ngày</label>
           <input 
             type="date" 
             className="w-full border p-2 rounded"
             value={formData.date}
             onChange={e => setFormData({...formData, date: e.target.value})}
           />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        {/* Chọn loại (Thu/Chi) */}
        <div>
           <label className="block text-sm mb-1">Loại</label>
           <select 
             className="w-full border p-2 rounded"
             value={formData.type}
             // Đoạn này phải ép kiểu (as ...) vì TS nó sợ mày nhập linh tinh
             onChange={e => setFormData({...formData, type: e.target.value as 'income' | 'expense'})}
           >
             <option value="expense">Chi tiêu 💸</option>
             <option value="income">Thu nhập 💰</option>
           </select>
        </div>

        {/* Nhập danh mục (Ăn uống, đi lại...) */}
        <div>
           <label className="block text-sm mb-1">Danh mục</label>
           <input 
             type="text" 
             className="w-full border p-2 rounded"
             placeholder="Ví dụ: Ăn sáng..."
             value={formData.category}
             onChange={e => setFormData({...formData, category: e.target.value})}
           />
        </div>
      </div>

      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded font-bold hover:bg-blue-700 transition">
        + Thêm Giao Dịch
      </button>
    </form>
  );
}