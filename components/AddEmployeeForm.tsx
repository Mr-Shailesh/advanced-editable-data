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
        onClick={handleAddEmployeeClick}
        className="flex cursor-pointer items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
      >
        <Plus className="h-4 w-4" />
        Add Employee
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 flex items-center justify-between border-b border-border bg-muted/50 px-6 py-4">
          <h2 className="text-lg font-semibold text-foreground">
            Add New Employee
          </h2>
          <button
            onClick={handleReset}
            className="p-2 hover:bg-muted rounded transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="John Doe"
                className={cn(
                  "w-full px-3 py-2 bg-background border rounded-lg text-sm focus:outline-none focus:border-primary transition-colors",
                  errors.name && "border-red-500",
                )}
              />
              {errors.name && (
                <p className="text-xs text-red-400 mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="john@example.com"
                className={cn(
                  "w-full px-3 py-2 bg-background border rounded-lg text-sm focus:outline-none focus:border-primary transition-colors",
                  errors.email && "border-red-500",
                )}
              />
              {errors.email && (
                <p className="text-xs text-red-400 mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Department
              </label>
              <select
                value={formData.department}
                onChange={(e) =>
                  handleInputChange("department", e.target.value)
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
                <p className="text-xs text-red-400 mt-1">{errors.department}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Status
              </label>
              <select
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
              <label className="block text-sm font-medium text-foreground mb-1">
                Salary
              </label>
              <input
                type="number"
                value={formData.salary}
                onChange={(e) => handleInputChange("salary", e.target.value)}
                placeholder="50000"
                className={cn(
                  "w-full px-3 py-2 bg-background border rounded-lg text-sm focus:outline-none focus:border-primary transition-colors",
                  errors.salary && "border-red-500",
                )}
              />
              {errors.salary && (
                <p className="text-xs text-red-400 mt-1">{errors.salary}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Hire Date
              </label>
              <input
                type="date"
                value={formData.hireDate}
                onChange={(e) => handleInputChange("hireDate", e.target.value)}
                className={cn(
                  "w-full px-3 py-2 bg-background border rounded-lg text-sm focus:outline-none focus:border-primary transition-colors",
                  errors.hireDate && "border-red-500",
                )}
              />
              {errors.hireDate && (
                <p className="text-xs text-red-400 mt-1">{errors.hireDate}</p>
              )}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 flex gap-3 border-t border-border bg-muted/50 px-6 py-4 justify-end">
          <button
            onClick={handleReset}
            className="px-4 py-2 cursor-pointer text-foreground hover:bg-muted rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
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
