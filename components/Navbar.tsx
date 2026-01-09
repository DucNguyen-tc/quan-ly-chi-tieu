'use client';

import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase'; // Gọi thằng bảo vệ ra
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  User 
} from 'firebase/auth';

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);

  // 1. Lắng nghe trạng thái đăng nhập (Chạy ngầm liên tục)
  useEffect(() => {
    // Hàm này sẽ tự chạy mỗi khi user đăng nhập hoặc đăng xuất
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Cập nhật state để UI đổi theo
    });

    // Dọn dẹp khi component bị hủy (để tránh rò rỉ bộ nhớ)
    return () => unsubscribe();
  }, []);

  // 2. Hàm xử lý Đăng Nhập
  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
    }
  };

  // 3. Hàm xử lý Đăng Xuất
  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center mb-6">
      <h1 className="text-xl font-bold text-blue-600">💸 Web Chi Tiêu</h1>

      <div>
        {user ? (
          // Giao diện KHI ĐÃ ĐĂNG NHẬP
          <div className="flex items-center gap-3">
            <span className="text-gray-700 hidden sm:inline">
              Chào, <b>{user.displayName}</b>
            </span>
            {/* Ảnh avatar lấy từ Google */}
            {user.photoURL && (
              <img 
                src={user.photoURL} 
                alt="Avatar" 
                className="w-8 h-8 rounded-full border"
              />
            )}
            <button 
              onClick={handleLogout}
              className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded"
            >
              Thoát
            </button>
          </div>
        ) : (
          // Giao diện KHI CHƯA ĐĂNG NHẬP
          <button 
            onClick={handleLogin}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-bold flex items-center gap-2"
          >
            {/* Icon Google fake cho đẹp */}
            <span>G</span> Đăng nhập Google
          </button>
        )}
      </div>
    </nav>
  );
}