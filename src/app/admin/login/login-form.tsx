"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        body: JSON.stringify({
          email: formData.get("email"),
          password: formData.get("password"),
        }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "ایمیل یا رمز عبور اشتباه است");
      } else {
        router.push("/admin/dashboard");
        router.refresh();
      }
    } catch {
      setError("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">ایمیل</label>
        <Input
          name="email"
          type="email"
          required
          defaultValue="admin@rivansafar.com"
          dir="ltr"
          className="h-11"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">رمز عبور</label>
        <div className="relative">
          <Input
            name="password"
            type={showPassword ? "text" : "password"}
            required
            defaultValue="admin123"
            dir="ltr"
            className="h-11 pl-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>
      {error && (
        <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">{error}</div>
      )}
      <Button type="submit" className="w-full h-11 text-base" disabled={loading}>
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "ورود"}
      </Button>
    </form>
  );
}
