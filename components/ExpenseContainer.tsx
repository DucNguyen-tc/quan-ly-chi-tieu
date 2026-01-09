'use client';

import { useState, useEffect } from 'react';
import ExpenseForm from './ExpenseForm';
import ExpenseList from './ExpenseList';
import Summary from './Summary';
import { Transaction, TransactionFormData } from '@/types';

// 1. Import đồ nghề Firebase
import { db, auth } from '@/lib/firebase';
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';

export default function ExpenseContainer() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [user, setUser] = useState<User | null>(null); // Lưu thông tin người đang đăng nhập

  // 2. Lắng nghe: Ai đang đăng nhập?
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) setTransactions([]); // Nếu thoát thì xóa sạch list trên màn hình
    });
    return () => unsubscribe();
  }, []);

  // 3. Lắng nghe Dữ liệu Real-time (Thay thế cho useEffect đọc LocalStorage)
  useEffect(() => {
    if (!user) return; // Chưa đăng nhập thì không tải dữ liệu

    // Đường dẫn: users -> [ID Của User] -> transactions
    const q = query(
      collection(db, 'users', user.uid, 'transactions'),
      orderBy('createdAt', 'desc') // Sắp xếp cái mới nhất lên đầu
    );

    // onSnapshot: Tự động chạy mỗi khi Database thay đổi (Thêm/Xóa/Sửa bên kia là bên này nhảy số luôn)
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id, // Lấy ID do Firebase tự sinh
        ...doc.data()
      })) as Transaction[];
      
      setTransactions(data);
    });

    return () => unsubscribe(); // Dọn dẹp khi tắt component
  }, [user]); // Chạy lại khi user thay đổi

  // 4. Hàm Thêm mới (Gửi lên Mây)
  const handleAdd = async (formData: TransactionFormData) => {
    if (!user) {
      alert("Vui lòng đăng nhập để lưu!");
      return;
    }

    try {
      await addDoc(collection(db, 'users', user.uid, 'transactions'), {
        ...formData,
        createdAt: serverTimestamp() // Lưu thêm thời gian server để sắp xếp
      });
      // Không cần setTransactions thủ công nữa! onSnapshot sẽ tự lo việc đó.
    } catch (error) {
      console.error("Lỗi thêm:", error);
    }
  };

  // 5. Hàm Xóa (Bắn lệnh lên Mây)
  const handleDelete = async (id: string) => {
    if (!user) return;
    try {
      const docRef = doc(db, 'users', user.uid, 'transactions', id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Lỗi xóa:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Nếu chưa đăng nhập thì hiện thông báo nhắc nhở */}
      {!user ? (
        <div className="text-center p-10 bg-yellow-100 rounded text-yellow-800">
          Vui lòng đăng nhập để quản lý chi tiêu của bạn 🔒
        </div>
      ) : (
        <>
          <Summary transactions={transactions} />
          <ExpenseForm onAdd={handleAdd} />
          <ExpenseList data={transactions} onDelete={handleDelete} />
        </>
      )}
    </div>
  );
}