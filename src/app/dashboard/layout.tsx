"use client";

import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { NotificationCenter } from "@/components/dashboard/NotificationCenter";
import { Menu, X, AlertCircle, RefreshCw } from "lucide-react";
import { useWorkspace } from "@/lib/workspace-context";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { workspaceError, refreshData } = useWorkspace();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar onOpenNotifications={() => setNotificationsOpen(true)} />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden bg-slate-900/50 backdrop-blur-xs">
          <div className="relative flex-1 max-w-xs w-full bg-white">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-500 hover:text-slate-900"
            >
              <X className="w-5 h-5" />
            </button>
            <Sidebar onOpenNotifications={() => {
              setMobileMenuOpen(false);
              setNotificationsOpen(true);
            }} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Top Header */}
        <div className="md:hidden h-14 border-b border-slate-200 bg-white px-4 flex items-center justify-between">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-1.5 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-semibold text-sm tracking-tight text-slate-900">
            signal<span className="text-blue-600">.</span>
          </span>
          <div className="w-6" />
        </div>

        {workspaceError && (
          <div
            role="alert"
            className="mx-4 mt-4 flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950 sm:mx-6 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-start gap-2">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <div>
                <p className="font-semibold">We couldn&apos;t refresh your workspace</p>
                <p className="mt-0.5 text-xs text-amber-800">{workspaceError}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => void refreshData()}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-amber-300 bg-white px-3 py-2 text-xs font-semibold text-amber-950 transition hover:bg-amber-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700"
            >
              <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
              Try again
            </button>
          </div>
        )}

        <main className="flex-1 flex flex-col min-w-0">
          {children}
        </main>
      </div>

      {/* Notification Slideover Drawer */}
      <NotificationCenter
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />
    </div>
  );
}
