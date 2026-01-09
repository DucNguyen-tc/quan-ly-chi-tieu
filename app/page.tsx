import ExpenseContainer from "@/components/ExpenseContainer";
import Navbar from '@/components/Navbar';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar /> {/* 👈 Đặt nó ở đây, trên cùng */}
      
      <div className="p-8">
        <ExpenseContainer />
      </div>
    </main>
  );
}