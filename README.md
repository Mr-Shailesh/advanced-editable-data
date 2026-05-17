# React Editable Data Table

A Next.js employee management dashboard with an editable data table, filtering, sorting, CSV export, pagination, and virtualized infinite scrolling.

## Features

- Dashboard page with total employee stats, active employee count, average salary, department count, and status breakdowns
- Employee database page with `10,000` generated mock employees
- Search employees by name or email
- Filter employees by salary range, hire date range, status, and department
- Sort employee columns by name, email, department, status, salary, and hire date
- Inline row editing for employee details
- Field validation before saving edited rows
- Save individual rows
- Save all pending row changes from the toolbar
- Cancel row editing
- Undo saved row changes
- CSV export for the current filtered dataset
- Unsaved/edit-mode protection modal before actions that may discard row edit state
- Protected actions include filtering, exporting, adding employees, switching table mode, changing pagination, and navigating between pages
- Rows in edit mode are treated as pending work even if no field value has changed
- Top navigation between Dashboard and Employee Database
- Minimal UI component set, keeping only the shared UI primitives used by the app

## Extra Features

- Dashboard analytics page to show employee stats at a glance.
- Add user data from the employee form with validation.
- Delete user data with a confirmation modal.
- Virtualized infinite scroll using `react-window` for better performance with large datasets.
- Unsaved changes protection for rows that are only in edit mode, even before values are changed.
- Confirmation modal before deleting an employee.
- CSV export for filtered employee data.
- Switchable table rendering modes:
  - Infinite Scroll, enabled by default and optimized with `react-window`
  - Pagination with configurable rows per page

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Redux Toolkit and React Redux
- Tailwind CSS
- Radix UI primitives
- react-window
- Faker.js

## Setup Instructions

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Run the development server:

   ```bash
   pnpm dev
   ```

3. Open the app:

   ```text
   http://localhost:3000
   ```

   If port `3000` is busy, Next.js will choose another available port and print it in the terminal.

4. Create a production build:

   ```bash
   pnpm build
   ```

5. Start the production server:

   ```bash
   pnpm start
   ```

## Available Scripts

```bash
pnpm dev
```

Starts the Next.js development server.

```bash
pnpm build
```

Creates a production build.

```bash
pnpm start
```

Starts the production server after a successful build.

## Project Structure

```text
app/
  dashboard/        Dashboard route
  employees/        Employee database route
components/
  ui/               Minimal shared UI primitives used by the app
  DataTable.tsx     Sortable table with optional virtualized rendering
  EditableTableRow.tsx
  FilterPanel.tsx
  TableToolbar.tsx
  TablePagination.tsx
lib/
  slices/           Redux slices
  mockData.ts       Mock employee generation
  tableUtils.ts     Filtering, sorting, pagination, CSV export
  validation.ts     Row validation rules
```

## Approach and Decisions Taken

- Used Next.js with the App Router to keep routing simple for the Dashboard and Employee Database pages.
- Used Redux Toolkit as the single source of truth for table data, filters, sorting, pagination, and edit state.
- Generated `10,000` mock employees with Faker.js so the table can demonstrate large-data behavior without a backend.
- Added `react-window` virtualization for the default Infinite Scroll mode to avoid rendering all rows at once.
- Kept Pagination as an alternate mode so users can switch between traditional page-based browsing and virtualized scrolling.
- Treated rows in edit mode as pending work, even if values are not changed, to avoid losing user context during actions like filtering, exporting, adding employees, changing pages, or navigating away.
- Used modal confirmations for destructive or state-changing flows, including delete confirmation and unsaved/edit-mode protection.
- Kept the UI dependency surface small by removing unused scaffolded UI components and packages.
- Kept filtering, sorting, pagination, CSV export, and validation logic in `lib/` helpers to keep UI components focused on rendering and interaction.

## Known Limitations

- Data is mock/generated in the browser and is not persisted after refresh.
- There is no backend API or database integration.
- CSV export uses the current filtered dataset.
- Virtualized rows use estimated fixed heights, so very long validation messages may need additional layout handling.
- The app is optimized for the assessment workflow, not a full production employee management system.

## Notes

- The employee table initializes with `10,000` mock rows.
- Infinite Scroll is the default table mode and uses virtual scrolling for better performance with large datasets.
- Rows in edit mode are treated as pending work even if no field has changed yet.
- Actions that could discard edit state show an unsaved changes modal first.
