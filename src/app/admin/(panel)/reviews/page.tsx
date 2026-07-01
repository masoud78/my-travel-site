import { redirect } from "next/navigation";
import { getCurrentUser, hasPermission, type Role } from "@/lib/auth";
import { getReviewsAdmin } from "@/lib/admin-actions";
import { ReviewsClient } from "./reviews-client";

export default async function AdminReviewsPage() {
  const user = await getCurrentUser();
  if (!user || !hasPermission(user.role as Role, "reviews.read")) redirect("/admin/login");

  const reviews = await getReviewsAdmin();

  return (
    <ReviewsClient
      reviews={reviews}
      canCreate={hasPermission(user.role as Role, "reviews.create")}
      canUpdate={hasPermission(user.role as Role, "reviews.update")}
      canDelete={hasPermission(user.role as Role, "reviews.delete")}
    />
  );
}
