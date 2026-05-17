import { DataTableContainer } from "@/components/DataTableContainer";

export const metadata = {
  title: "Employee Database | DataHub",
  description:
    "Advanced data table with filtering, sorting, and virtualization",
};

export default function EmployeesPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-3 py-5 sm:px-4 sm:py-8">
        <DataTableContainer />
      </div>
    </main>
  );
}
