import { redirect } from "next/navigation";
import { getCurrentUser, hasPermission, type Role } from "@/lib/auth";
import { getBlogPosts, getMedia } from "@/lib/admin-actions";
import { BlogClient } from "./blog-client";

export default async function AdminBlogPage() {
  const user = await getCurrentUser();
  if (!user || !hasPermission(user.role as Role, "blog.read")) redirect("/admin/login");

  const [posts, media] = await Promise.all([getBlogPosts(), getMedia()]);

  return (
    <BlogClient
      posts={posts}
      media={media}
      canCreate={hasPermission(user.role as Role, "blog.create")}
      canUpdate={hasPermission(user.role as Role, "blog.update")}
      canDelete={hasPermission(user.role as Role, "blog.delete")}
    />
  );
}
