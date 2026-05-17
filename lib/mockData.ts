import { faker } from "@faker-js/faker";
import { TableRow } from "@/lib/slices/tableSlice";

const departments = [
  "Engineering",
  "Sales",
  "Marketing",
  "HR",
  "Finance",
  "Operations",
  "Product",
];
const statuses: Array<"active" | "inactive" | "on-leave"> = [
  "active",
  "inactive",
  "on-leave",
];

export function generateMockData(count: number = 10000): TableRow[] {
  const data: TableRow[] = [];

  for (let i = 0; i < count; i++) {
    data.push({
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      department: faker.helpers.arrayElement(departments),
      status: faker.helpers.arrayElement(statuses),
      salary: faker.number.int({ min: 40000, max: 250000 }),
      hireDate: faker.date.past({ years: 10 }).toISOString().split("T")[0],
    });
  }

  return data;
}
