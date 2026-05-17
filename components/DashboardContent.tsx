"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setData } from "@/lib/slices/tableSlice";
import { generateMockData } from "@/lib/mockData";
import { Users, TrendingUp, BarChart3, Activity } from "lucide-react";

export function DashboardContent() {
  const dispatch = useAppDispatch();
  const { data } = useAppSelector((state) => state.table);

  useEffect(() => {
    if (data.length === 0) {
      const mockData = generateMockData(10000);
      dispatch(setData(mockData));
    }
  }, [dispatch, data.length]);

  const stats = useMemo(() => {
    if (data.length === 0)
      return {
        totalEmployees: 0,
        activeEmployees: 0,
        inactiveEmployees: 0,
        onLeaveEmployees: 0,
        avgSalary: 0,
        departments: 0,
      };

    const totalEmployees = data.length;
    let activeEmployees = 0;
    let inactiveEmployees = 0;
    let onLeaveEmployees = 0;
    let salaryTotal = 0;
    const departments = new Set<string>();

    data.forEach((emp) => {
      salaryTotal += emp.salary;
      departments.add(emp.department);

      if (emp.status === "active") activeEmployees += 1;
      if (emp.status === "inactive") inactiveEmployees += 1;
      if (emp.status === "on-leave") onLeaveEmployees += 1;
    });

    return {
      totalEmployees,
      activeEmployees,
      inactiveEmployees,
      onLeaveEmployees,
      avgSalary: Math.round(salaryTotal / totalEmployees),
      departments: departments.size,
    };
  }, [data]);

  const departmentStats = useMemo(() => {
    if (data.length === 0) return [];

    const depts = new Map<string, number>();
    data.forEach((emp) => {
      depts.set(emp.department, (depts.get(emp.department) || 0) + 1);
    });

    return Array.from(depts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [data]);

  const activePercentage =
    stats.totalEmployees > 0
      ? ((stats.activeEmployees / stats.totalEmployees) * 100).toFixed(1)
      : "0.0";

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="border-b border-border pb-5 sm:pb-6">
        <h1 className="mb-2 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
          Dashboard
        </h1>
        <p className="text-base text-muted-foreground sm:text-lg">
          Employee analytics and key metrics at a glance
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          title="Total Employees"
          value={stats.totalEmployees.toLocaleString()}
          color="bg-blue-500/10 text-blue-600"
        />
        <StatCard
          icon={Activity}
          title="Active Employees"
          value={stats.activeEmployees.toLocaleString()}
          color="bg-green-500/10 text-green-600"
          subtitle={`${activePercentage}% of total`}
        />
        <StatCard
          icon={TrendingUp}
          title="Average Salary"
          value={`$${(stats.avgSalary / 1000).toFixed(0)}k`}
          color="bg-purple-500/10 text-purple-600"
        />
        <StatCard
          icon={BarChart3}
          title="Departments"
          value={stats.departments.toString()}
          color="bg-orange-500/10 text-orange-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-lg border border-border/50 bg-card/50 p-4 backdrop-blur-sm sm:p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground sm:text-xl">
            <span className="text-primary">◆</span>
            Top Departments
          </h2>
          <div className="space-y-3">
            {departmentStats.map(([dept, count]) => (
              <div
                key={dept}
                className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
              >
                <span className="text-muted-foreground">{dept}</span>
                <div className="flex flex-1 items-center gap-3 sm:ml-4">
                  <div className="flex-1 bg-muted/30 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-primary to-primary/60 h-full"
                      style={{
                        width: `${(count / stats.totalEmployees) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium text-foreground w-16 text-right">
                    {count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-border/50 bg-card/50 p-4 backdrop-blur-sm sm:p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground sm:text-xl">
            <span className="text-primary">◆</span>
            Employment Status
          </h2>
          <div className="space-y-4">
            <StatusBar
              label="Active"
              count={stats.activeEmployees}
              total={stats.totalEmployees}
              color="bg-green-500"
            />
            <StatusBar
              label="On Leave"
              count={stats.onLeaveEmployees}
              total={stats.totalEmployees}
              color="bg-yellow-500"
            />
            <StatusBar
              label="Inactive"
              count={stats.inactiveEmployees}
              total={stats.totalEmployees}
              color="bg-red-500"
            />
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border/50 bg-gradient-to-r from-primary/10 to-primary/5 p-5 text-center backdrop-blur-sm sm:p-8">
        <h2 className="mb-2 text-xl font-bold text-foreground sm:text-2xl">
          Explore the Employee Database
        </h2>
        <p className="text-muted-foreground mb-6">
          View detailed employee information with advanced filtering, sorting,
          and search capabilities
        </p>
        <Link
          href="/employees"
          className="inline-block rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90 sm:px-8"
        >
          View Database
        </Link>
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string;
  color: string;
  subtitle?: string;
}

function StatCard({
  icon: Icon,
  title,
  value,
  color,
  subtitle,
}: StatCardProps) {
  return (
    <div className="rounded-lg border border-border/50 bg-card/50 p-4 backdrop-blur-sm transition-colors hover:bg-card/70 sm:p-6">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      <p className="text-muted-foreground text-sm mb-1">{title}</p>
      <p className="text-2xl font-bold text-foreground sm:text-3xl">{value}</p>
      {subtitle && (
        <p className="text-xs text-muted-foreground mt-2">{subtitle}</p>
      )}
    </div>
  );
}

interface StatusBarProps {
  label: string;
  count: number;
  total: number;
  color: string;
}

function StatusBar({ label, count, total, color }: StatusBarProps) {
  const percentage = total > 0 ? (count / total) * 100 : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <span className="text-sm text-muted-foreground">
          {count} ({percentage.toFixed(1)}%)
        </span>
      </div>
      <div className="w-full bg-muted/30 rounded-full h-2">
        <div
          className={`${color} h-full rounded-full`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
