import { DataTableContainer } from "@/components/DataTableContainer";

export const metadata = {
  title: "Employee Database | DataHub",
  description:
    "Advanced data table with filtering, sorting, and virtualization",
};

export default function EmployeesPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <DataTableContainer />
      </div>
    </main>
  );
}
