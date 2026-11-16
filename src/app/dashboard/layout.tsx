"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { NotificationCenter } from "@/components/dashboard/NotificationCenter";
import { Menu, X, AlertCircle, RefreshCw } from "lucide-react";
import { useWorkspace } from "@/lib/workspace-context";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { workspaceError, refreshData, isLoading, business } = useWorkspace();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !workspaceError && (!business || business.onboarding_completed === false) && pathname !== "/dashboard/settings") {
      router.replace("/onboarding");
    }
  }, [business, isLoading, workspaceError, pathname, router]);
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
              aria-label="Close dashboard navigation"
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
      <div className="flex-1 flex flex-col min-w-0 dashboard-page-enter">
        {/* Mobile Top Header */}
        <div className="md:hidden h-14 border-b border-slate-200 bg-white px-4 flex items-center justify-between">
          <button
            type="button"
            aria-label="Open dashboard navigation"
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
          {isLoading ? (
            <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 sm:px-6" aria-busy="true" aria-label="Loading workspace">
              <div className="space-y-2">
                <div className="h-7 w-40 animate-pulse rounded-lg bg-slate-200" />
                <div className="h-4 w-64 max-w-full animate-pulse rounded bg-slate-100" />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="h-28 animate-pulse rounded-xl border border-slate-200 bg-white" />
                ))}
              </div>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="h-64 animate-pulse rounded-xl border border-slate-200 bg-white" />
                <div className="h-64 animate-pulse rounded-xl border border-slate-200 bg-white" />
              </div>
            </div>
          ) : workspaceError ? (
            <div className="mx-auto w-full max-w-2xl px-4 py-16 text-center sm:px-6">
              <AlertCircle className="mx-auto h-8 w-8 text-amber-600" aria-hidden="true" />
              <h1 className="mt-4 text-lg font-semibold tracking-tight text-slate-900">Workspace data is unavailable</h1>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">Signal has kept your existing data safe, but could not load it. Retry the connection before making changes.</p>
              <button
                type="button"
                onClick={() => void refreshData()}
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
              >
                <RefreshCw className="h-4 w-4" aria-hidden="true" />
                Retry connection
              </button>
            </div>
          ) : !business || business.onboarding_completed === false ? (
            <div className="mx-auto w-full max-w-xl px-4 py-16 text-center">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue-700"><AlertCircle className="h-6 w-6" /></div>
              <h1 className="mt-4 text-xl font-semibold tracking-tight text-zinc-950">Finish setting up your workspace</h1>
              <p className="mt-2 text-sm leading-6 text-zinc-600">Add your business details before opening the dashboard or generating customer QR codes.</p>
              <a href="/dashboard/settings" className="mt-6 inline-flex h-10 items-center justify-center rounded-lg bg-zinc-950 px-4 text-sm font-semibold text-white transition hover:bg-zinc-800">Set up your business</a>
            </div>
          ) : children}
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
