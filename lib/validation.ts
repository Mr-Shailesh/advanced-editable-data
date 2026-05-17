export const validateEmail = (email: string): string => {
  if (!email) return "Email is required";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "Invalid email format";
  return "";
};

export const validateName = (name: string): string => {
  if (!name || !name.trim()) return "Name is required";
  if (name.length < 2) return "Name must be at least 2 characters";
  if (name.length > 100) return "Name must be less than 100 characters";
  return "";
};

export const validateDepartment = (department: string): string => {
  if (!department) return "Department is required";
  return "";
};

export const validateStatus = (status: string): string => {
  const validStatuses = ["active", "inactive", "on-leave"];
  if (!status || !validStatuses.includes(status)) return "Invalid status";
  return "";
};

export const validateSalary = (salary: number | string): string => {
  const num = typeof salary === "string" ? parseFloat(salary) : salary;
  if (isNaN(num)) return "Salary must be a number";
  if (num < 0) return "Salary cannot be negative";
  if (num > 1000000) return "Salary cannot exceed 1,000,000";
  return "";
};

export const validateHireDate = (date: string): string => {
  if (!date) return "Hire date is required";
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) return "Date format must be YYYY-MM-DD";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "Invalid date";
  if (d > new Date()) return "Hire date cannot be in the future";
  return "";
};

export const validateRow = (row: any): Record<string, string> => {
  const errors: Record<string, string> = {};

  const nameError = validateName(row.name);
  if (nameError) errors.name = nameError;

  const emailError = validateEmail(row.email);
  if (emailError) errors.email = emailError;

  const deptError = validateDepartment(row.department);
  if (deptError) errors.department = deptError;

  const statusError = validateStatus(row.status);
  if (statusError) errors.status = statusError;

  const salaryError = validateSalary(row.salary);
  if (salaryError) errors.salary = salaryError;

  const dateError = validateHireDate(row.hireDate);
  if (dateError) errors.hireDate = dateError;

  return errors;
};
