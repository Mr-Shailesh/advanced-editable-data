import { DashboardContent } from "@/components/DashboardContent";

export const metadata = {
  title: "Dashboard | DataHub",
  description: "Employee data analytics and insights",
};

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-3 py-5 sm:px-4 sm:py-8">
        <DashboardContent />
      </div>
    </main>
  );
}
