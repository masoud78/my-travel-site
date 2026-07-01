import { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "./login-form";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "ورود به پنل مدیریت | ریوان سفر",
};

export default async function AdminLoginPage() {
  const user = await getCurrentUser();
  if (user) redirect("/admin/dashboard");

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-100 to-stone-200 p-4" dir="rtl">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-stone-100">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary to-primary-700 flex items-center justify-center text-white font-bold text-2xl mb-4 shadow-lg shadow-primary/20">
              ر
            </div>
            <h1 className="text-2xl font-bold text-stone-900">ورود به پنل مدیریت</h1>
            <p className="text-sm text-stone-500 mt-2">ریوان سفر</p>
          </div>
          <LoginForm />
        </div>
        <p className="text-center text-xs text-stone-500 mt-6">
          نام کاربری: admin@rivansafar.com | رمز عبور: admin123
        </p>
      </div>
    </main>
  );
}
