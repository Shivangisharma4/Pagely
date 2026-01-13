"use client";

import { useState } from "react";
import { Header } from "./header";
import { Sidebar } from "./sidebar";
import { QuickActions } from "@/components/ui/quick-actions";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
  className?: string;
}

export function MainLayout({ children, showSidebar = true, className }: MainLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="relative min-h-screen flex flex-col">
      <Header onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
      <div className="flex-1 flex">
        {/* Desktop Sidebar */}
        {showSidebar && (
          <div className="hidden lg:block border-r">
            <Sidebar />
          </div>
        )}

        {/* Mobile Sidebar Drawer */}
        {showSidebar && mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            {/* Drawer */}
            <div className="fixed left-0 top-0 bottom-0 w-64 bg-background border-r z-50 lg:hidden overflow-y-auto">
              <Sidebar onItemClick={() => setMobileMenuOpen(false)} />
            </div>
          </>
        )}

        <main className={cn("flex-1 overflow-y-auto", className)}>
          <div className="container py-3 sm:py-4 md:py-6 px-4 sm:px-6 page-transition">
            {children}
          </div>
        </main>
      </div>
      <QuickActions />
    </div>
  );
}
