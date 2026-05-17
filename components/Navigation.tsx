"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BarChart3, Database } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCheckUnsavedChanges } from "@/lib/useCheckUnsavedChanges";

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const checkUnsavedChanges = useCheckUnsavedChanges();

  const navItems = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: BarChart3,
    },
    {
      href: "/employees",
      label: "Employee Database",
      icon: Database,
    },
  ];

  const handleNavigationClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    label: string,
  ) => {
    if (pathname === href) return;

    event.preventDefault();
    checkUnsavedChanges(() => {
      router.push(href);
    }, `go to ${label}`);
  };

  return (
    <nav
      aria-label="Primary navigation"
      className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50"
    >
      <div className="container mx-auto flex flex-col gap-3 px-4 py-3 sm:py-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-8">
          <Link
            href="/dashboard"
            onClick={(event) =>
              handleNavigationClick(event, "/dashboard", "Dashboard")
            }
            className="w-fit text-xl font-bold text-primary transition-colors hover:text-primary/80"
            aria-label="Go to dashboard"
          >
            DataHub
          </Link>
          <div className="flex flex-wrap items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={(event) =>
                    handleNavigationClick(event, item.href, item.label)
                  }
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors sm:px-4",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
