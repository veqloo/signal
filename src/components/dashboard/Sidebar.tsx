"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWorkspace } from "@/lib/workspace-context";
import {
  LayoutDashboard,
  MessagesSquare,
  BarChart3,
  MapPin,
  QrCode,
  FileText,
  Settings,
  LogOut,
  Bell,
  Sparkles,
  ExternalLink,
} from "lucide-react";

export function Sidebar({ onOpenNotifications }: { onOpenNotifications?: () => void }) {
  const pathname = usePathname();
  const {
    business,
    locations,
    isDemoMode,
    userEmail,
    unreadNotificationsCount,
    signOut,
  } = useWorkspace();

  const navItems = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/feedback", label: "Feedback Inbox", icon: MessagesSquare },
    { href: "/dashboard/analytics", label: "Analytics & Trends", icon: BarChart3 },
    { href: "/dashboard/locations", label: "Locations", icon: MapPin, count: locations.length },
    { href: "/dashboard/qr", label: "QR Studio & Print", icon: QrCode },
    { href: "/dashboard/reports", label: "PDF Reports", icon: FileText },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className="w-64 flex-shrink-0 border-r border-slate-200 bg-white flex flex-col justify-between min-h-screen">
      {/* Top Section */}
      <div>
        {/* Brand */}
        <div className="h-16 px-6 border-b border-slate-100 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="font-semibold text-xl tracking-tight text-slate-900">
              signal<span className="text-blue-600">.</span>
            </span>
            <span className="text-[10px] font-medium tracking-wide uppercase px-1.5 py-0.5 rounded border border-slate-200 text-slate-500 bg-slate-50">
              PRO
            </span>
          </Link>

          {/* Notification Bell */}
          <button
            onClick={onOpenNotifications}
            className="relative p-1.5 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
            )}
          </button>
        </div>

        {/* Business Selector / Info */}
        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider mb-1">
            Active Workspace
          </div>
          <div className="font-semibold text-sm text-slate-900 truncate">
            {business?.name || "Your Business"}
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
            <span className="truncate">{business?.category || "Specialty Business"}</span>
            {isDemoMode && (
              <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-200">
                Demo
              </span>
            )}
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition ${
                  isActive
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-500"}`} />
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && item.count > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      isActive ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-slate-100 space-y-3">
        {/* Public Feedback Form Quick Link */}
        {business && (
          <a
            href={`/f/${business.slug}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between w-full px-3 py-2 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md transition"
          >
            <span className="truncate">Public Feedback Link</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 ml-1" />
          </a>
        )}

        {/* User Account / Sign Out */}
        <div className="flex items-center justify-between pt-2">
          <div className="truncate mr-2">
            <div className="text-xs font-medium text-slate-900 truncate">
              {userEmail || "demo@veqlo.me"}
            </div>
            <div className="text-[10px] text-slate-400">Owner Access</div>
          </div>
          <button
            onClick={() => signOut()}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
