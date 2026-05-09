import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { TransactionsTable } from "@/components/TransactionsTable";

export const Route = createFileRoute("/dashboard/transactions")({
  component: TransactionsPage,
});

function TransactionsPage() {
  return (
    <DashboardLayout
      active="transactions"
      title="Transactions"
      subtitle="Monitor and drill into transaction risk and live trace paths."
    >
      <TransactionsTable />
    </DashboardLayout>
  );
}

