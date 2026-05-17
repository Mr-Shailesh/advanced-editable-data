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
        avgSalary: 0,
        departments: 0,
      };

    const totalEmployees = data.length;
    const activeEmployees = data.filter(
      (emp) => emp.status === "active",
    ).length;
    const avgSalary = Math.round(
      data.reduce((sum, emp) => sum + emp.salary, 0) / data.length,
    );
    const departments = new Set(data.map((emp) => emp.department)).size;

    return { totalEmployees, activeEmployees, avgSalary, departments };
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

  const statusStats = useMemo(() => {
    if (data.length === 0) return { active: 0, inactive: 0, onLeave: 0 };

    return {
      active: data.filter((emp) => emp.status === "active").length,
      inactive: data.filter((emp) => emp.status === "inactive").length,
      onLeave: data.filter((emp) => emp.status === "on-leave").length,
    };
  }, [data]);

  return (
    <div className="space-y-8">
      <div className="border-b border-border pb-6">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent mb-2">
          Dashboard
        </h1>
        <p className="text-muted-foreground text-lg">
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
          subtitle={`${((stats.activeEmployees / stats.totalEmployees) * 100).toFixed(1)}% of total`}
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
        <div className="border border-border/50 rounded-lg bg-card/50 backdrop-blur-sm p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <span className="text-primary">◆</span>
            Top Departments
          </h2>
          <div className="space-y-3">
            {departmentStats.map(([dept, count]) => (
              <div key={dept} className="flex items-center justify-between">
                <span className="text-muted-foreground">{dept}</span>
                <div className="flex items-center gap-3 flex-1 ml-4">
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

        <div className="border border-border/50 rounded-lg bg-card/50 backdrop-blur-sm p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <span className="text-primary">◆</span>
            Employment Status
          </h2>
          <div className="space-y-4">
            <StatusBar
              label="Active"
              count={statusStats.active}
              total={stats.totalEmployees}
              color="bg-green-500"
            />
            <StatusBar
              label="On Leave"
              count={statusStats.onLeave}
              total={stats.totalEmployees}
              color="bg-yellow-500"
            />
            <StatusBar
              label="Inactive"
              count={statusStats.inactive}
              total={stats.totalEmployees}
              color="bg-red-500"
            />
          </div>
        </div>
      </div>

      <div className="border border-border/50 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 backdrop-blur-sm p-8 text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Explore the Employee Database
        </h2>
        <p className="text-muted-foreground mb-6">
          View detailed employee information with advanced filtering, sorting,
          and search capabilities
        </p>
        <Link
          href="/employees"
          className="inline-block px-8 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
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
    <div className="border border-border/50 rounded-lg bg-card/50 backdrop-blur-sm p-6 hover:bg-card/70 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      <p className="text-muted-foreground text-sm mb-1">{title}</p>
      <p className="text-3xl font-bold text-foreground">{value}</p>
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
  const percentage = (count / total) * 100;

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
