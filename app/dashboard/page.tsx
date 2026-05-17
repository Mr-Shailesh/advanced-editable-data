import { DashboardContent } from "@/components/DashboardContent";

export const metadata = {
  title: "Dashboard | DataHub",
  description: "Employee data analytics and insights",
};

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <DashboardContent />
      </div>
    </main>
  );
}
