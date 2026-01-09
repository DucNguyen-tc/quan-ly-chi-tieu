// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Lấy config từ biến môi trường (.env.local)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Singleton Pattern (Cái này quan trọng trong Next.js)
// Next.js hay reload lại server, nếu không kiểm tra (getApps) thì nó sẽ khởi tạo lại Firebase liên tục
// -> Gây lỗi "Firebase App named '[DEFAULT]' already exists"
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Xuất khẩu 2 công cụ chính mình sẽ dùng
export const auth = getAuth(app); // Quản lý đăng nhập
export const db = getFirestore(app); // Quản lý dữ liệu