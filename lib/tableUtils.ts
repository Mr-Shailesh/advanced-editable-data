import { TableRow, FilterState } from "@/lib/slices/tableSlice";

export function applyFiltersAndSearch(
  data: TableRow[],
  filters: FilterState,
  searchQuery: string,
): TableRow[] {
  return data.filter((row) => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        row.name.toLowerCase().includes(query) ||
        row.email.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    if (filters.status.length > 0) {
      if (!filters.status.includes(row.status)) return false;
    }

    if (filters.department.length > 0) {
      if (!filters.department.includes(row.department)) return false;
    }

    if (filters.salaryMin > 0 || filters.salaryMax < 500000) {
      if (row.salary < filters.salaryMin || row.salary > filters.salaryMax) {
        return false;
      }
    }

    if (filters.dateFrom) {
      if (new Date(row.hireDate) < new Date(filters.dateFrom)) return false;
    }
    if (filters.dateTo) {
      if (new Date(row.hireDate) > new Date(filters.dateTo)) return false;
    }

    return true;
  });
}

export function applySorting(
  data: TableRow[],
  sortField: string | null,
  sortDirection: "asc" | "desc",
): TableRow[] {
  if (!sortField) return data;

  const sorted = [...data].sort((a, b) => {
    const aValue = (a as any)[sortField];
    const bValue = (b as any)[sortField];

    if (aValue === bValue) return 0;

    const comparison = aValue < bValue ? -1 : 1;
    return sortDirection === "asc" ? comparison : -comparison;
  });

  return sorted;
}

export function getPaginatedData(
  data: TableRow[],
  currentPage: number,
  pageSize: number,
): { data: TableRow[]; totalPages: number; totalRows: number } {
  const totalRows = data.length;
  const totalPages = Math.ceil(totalRows / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  return {
    data: data.slice(startIndex, endIndex),
    totalPages,
    totalRows,
  };
}

export function exportToCSV(
  data: TableRow[],
  filename: string = "export.csv",
): void {
  const headers = [
    "ID",
    "Name",
    "Email",
    "Department",
    "Status",
    "Salary",
    "Hire Date",
  ];
  const csvContent = [
    headers.join(","),
    ...data.map((row) =>
      [
        row.id,
        `"${row.name}"`,
        row.email,
        row.department,
        row.status,
        row.salary,
        row.hireDate,
      ].join(","),
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
