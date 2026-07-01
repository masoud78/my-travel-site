"use client";

import { useState } from "react";
import { Users, Briefcase, Building2, ImageIcon } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { JobsTab } from "./jobs-tab";

type JobItem = {
  id: string;
  title: string;
  slug: string;
  type: string;
  city: string | null;
  department: string | null;
  description: string;
  requirements: string | null;
  benefits: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

interface UsersClientProps {
  users: {
    id: string;
    name: string;
    email: string;
    role: string;
    phone: string | null;
    isActive: boolean;
    createdAt: Date;
  }[];
  jobs: JobItem[];
  roleLabels: Record<string, string>;
  canManageJobs: boolean;
  canCreateJob: boolean;
  canUpdateJob: boolean;
  canDeleteJob: boolean;
}

export function UsersClient({
  users,
  jobs,
  roleLabels,
  canManageJobs,
  canCreateJob,
  canUpdateJob,
  canDeleteJob,
}: UsersClientProps) {
  const [activeTab, setActiveTab] = useState("users");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-stone-900">مدیریت کاربران و تیم</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="users" className="gap-2">
            <Users className="w-4 h-4" />
            کاربران
          </TabsTrigger>
          <TabsTrigger value="jobs" className="gap-2">
            <Briefcase className="w-4 h-4" />
            فرصت‌های شغلی
          </TabsTrigger>
          <TabsTrigger value="consultants" className="gap-2" disabled>
            <ImageIcon className="w-4 h-4" />
            مشاوران
          </TabsTrigger>
          <TabsTrigger value="branches" className="gap-2" disabled>
            <Building2 className="w-4 h-4" />
            شعب
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-6">
          <div className="bg-white rounded-xl border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-stone-50 text-stone-700">
                <tr>
                  <th className="px-4 py-3 text-right font-semibold">نام</th>
                  <th className="px-4 py-3 text-right font-semibold">ایمیل</th>
                  <th className="px-4 py-3 text-right font-semibold">نقش</th>
                  <th className="px-4 py-3 text-right font-semibold">وضعیت</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-t border-stone-100">
                    <td className="px-4 py-3 font-medium">{u.name}</td>
                    <td className="px-4 py-3 text-stone-600" dir="ltr">
                      {u.email}
                    </td>
                    <td className="px-4 py-3 text-stone-600">
                      {roleLabels[u.role] || u.role}
                    </td>
                    <td className="px-4 py-3 text-stone-600">
                      {u.isActive ? "فعال" : "غیرفعال"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="jobs" className="mt-6">
          {canManageJobs ? (
            <JobsTab
              jobs={jobs}
              canCreate={canCreateJob}
              canUpdate={canUpdateJob}
              canDelete={canDeleteJob}
            />
          ) : (
            <div className="bg-white rounded-xl border p-8 text-center text-stone-500">
              شما دسترسی مدیریت فرصت‌های شغلی را ندارید.
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
