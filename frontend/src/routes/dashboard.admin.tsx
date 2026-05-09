import { createFileRoute, Outlet, notFound } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/dashboard/admin")({
  component: AdminShell,
});

function AdminShell() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user || user.role !== "ADMIN") throw notFound();
  return <Outlet />;
}
