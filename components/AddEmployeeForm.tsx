"use client";

import { useState, useCallback } from "react";
import { useAppDispatch } from "@/lib/hooks";
import { addRow } from "@/lib/slices/tableSlice";
import { validateRow } from "@/lib/validation";
import { cn } from "@/lib/utils";
import { Plus, X } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { useCheckUnsavedChanges } from "@/lib/useCheckUnsavedChanges";

interface AddEmployeeFormProps {
  onClose?: () => void;
}

export function AddEmployeeForm({ onClose }: AddEmployeeFormProps) {
  const dispatch = useAppDispatch();
  const checkUnsavedChanges = useCheckUnsavedChanges();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    status: "active" as const,
    salary: "",
    hireDate: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = useCallback(
    (field: string, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      if (errors[field]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    },
    [errors],
  );

  const handleSubmit = useCallback(() => {
    const submitData = {
      ...formData,
      salary: parseFloat(formData.salary) || 0,
    };

    const validationErrors = validateRow(submitData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    dispatch(
      addRow({
        id: uuidv4(),
        ...submitData,
      }),
    );

    setFormData({
      name: "",
      email: "",
      department: "",
      status: "active",
      salary: "",
      hireDate: "",
    });
    setErrors({});
    setIsOpen(false);
    onClose?.();
  }, [dispatch, formData, onClose]);

  const handleReset = useCallback(() => {
    setFormData({
      name: "",
      email: "",
      department: "",
      status: "active",
      salary: "",
      hireDate: "",
    });
    setErrors({});
    setIsOpen(false);
  }, []);

  const handleAddEmployeeClick = useCallback(() => {
    checkUnsavedChanges(() => {
      setIsOpen(true);
    }, "add employee");
  }, [checkUnsavedChanges]);

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={handleAddEmployeeClick}
        aria-haspopup="dialog"
        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground transition-colors hover:bg-primary/90 sm:w-auto"
      >
        <Plus className="h-4 w-4" />
        Add Employee
      </button>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-employee-title"
    >
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-border bg-card">
        <div className="sticky top-0 flex items-center justify-between border-b border-border bg-muted/50 px-4 py-3 sm:px-6 sm:py-4">
          <h2
            id="add-employee-title"
            className="text-lg font-semibold text-foreground"
          >
            Add New Employee
          </h2>
          <button
            type="button"
            onClick={handleReset}
            aria-label="Close add employee form"
            className="p-2 hover:bg-muted rounded transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 p-4 sm:p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="employee-name"
                className="block text-sm font-medium text-foreground mb-1"
              >
                Name
              </label>
              <input
                id="employee-name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="John Doe"
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "employee-name-error" : undefined}
                className={cn(
                  "w-full px-3 py-2 bg-background border rounded-lg text-sm focus:outline-none focus:border-primary transition-colors",
                  errors.name && "border-red-500",
                )}
              />
              {errors.name && (
                <p id="employee-name-error" className="text-xs text-red-400 mt-1">
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="employee-email"
                className="block text-sm font-medium text-foreground mb-1"
              >
                Email
              </label>
              <input
                id="employee-email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="john@example.com"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "employee-email-error" : undefined}
                className={cn(
                  "w-full px-3 py-2 bg-background border rounded-lg text-sm focus:outline-none focus:border-primary transition-colors",
                  errors.email && "border-red-500",
                )}
              />
              {errors.email && (
                <p id="employee-email-error" className="text-xs text-red-400 mt-1">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="employee-department"
                className="block text-sm font-medium text-foreground mb-1"
              >
                Department
              </label>
              <select
                id="employee-department"
                value={formData.department}
                onChange={(e) =>
                  handleInputChange("department", e.target.value)
                }
                aria-invalid={Boolean(errors.department)}
                aria-describedby={
                  errors.department ? "employee-department-error" : undefined
                }
                className={cn(
                  "w-full px-3 py-2 bg-background border rounded-lg text-sm focus:outline-none focus:border-primary transition-colors",
                  errors.department && "border-red-500",
                )}
              >
                <option value="">Select Department</option>
                <option value="Engineering">Engineering</option>
                <option value="Sales">Sales</option>
                <option value="Marketing">Marketing</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
              </select>
              {errors.department && (
                <p
                  id="employee-department-error"
                  className="text-xs text-red-400 mt-1"
                >
                  {errors.department}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="employee-status"
                className="block text-sm font-medium text-foreground mb-1"
              >
                Status
              </label>
              <select
                id="employee-status"
                value={formData.status}
                onChange={(e) => handleInputChange("status", e.target.value)}
                className="w-full px-3 py-2 bg-background border rounded-lg text-sm focus:outline-none focus:border-primary transition-colors"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="on-leave">On Leave</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="employee-salary"
                className="block text-sm font-medium text-foreground mb-1"
              >
                Salary
              </label>
              <input
                id="employee-salary"
                type="number"
                value={formData.salary}
                onChange={(e) => handleInputChange("salary", e.target.value)}
                placeholder="50000"
                aria-invalid={Boolean(errors.salary)}
                aria-describedby={
                  errors.salary ? "employee-salary-error" : undefined
                }
                className={cn(
                  "w-full px-3 py-2 bg-background border rounded-lg text-sm focus:outline-none focus:border-primary transition-colors",
                  errors.salary && "border-red-500",
                )}
              />
              {errors.salary && (
                <p id="employee-salary-error" className="text-xs text-red-400 mt-1">
                  {errors.salary}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="employee-hire-date"
                className="block text-sm font-medium text-foreground mb-1"
              >
                Hire Date
              </label>
              <input
                id="employee-hire-date"
                type="date"
                value={formData.hireDate}
                onChange={(e) => handleInputChange("hireDate", e.target.value)}
                aria-invalid={Boolean(errors.hireDate)}
                aria-describedby={
                  errors.hireDate ? "employee-hire-date-error" : undefined
                }
                className={cn(
                  "w-full px-3 py-2 bg-background border rounded-lg text-sm focus:outline-none focus:border-primary transition-colors",
                  errors.hireDate && "border-red-500",
                )}
              />
              {errors.hireDate && (
                <p
                  id="employee-hire-date-error"
                  className="text-xs text-red-400 mt-1"
                >
                  {errors.hireDate}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 flex flex-col-reverse gap-3 border-t border-border bg-muted/50 px-4 py-4 sm:flex-row sm:justify-end sm:px-6">
          <button
            type="button"
            onClick={handleReset}
            className="cursor-pointer rounded-lg px-4 py-2 text-foreground transition-colors hover:bg-muted"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 cursor-pointer bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            Add Employee
          </button>
        </div>
      </div>
    </div>
  );
}
