"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWorkspace } from "@/lib/workspace-context";
import {
  Inbox,
  LayoutDashboard,
  BarChart3,
  MapPin,
  QrCode,
  FileText,
  Settings,
  LogOut,
  ExternalLink,
  ChevronDown,
  Sparkles,
  Command,
  Bell,
} from "lucide-react";

export function Sidebar({ onOpenNotifications }: { onOpenNotifications?: () => void }) {
  const pathname = usePathname();
  const {
    business,
    locations,
    feedback,
    notifications,
    userEmail,
    signOut,
  } = useWorkspace();

  const unreadCount = feedback.filter((f) => f.status === "new").length;
  const unreadNotifs = notifications.filter((n) => !n.is_read).length;

  const coreNav = [
    {
      href: "/dashboard/feedback",
      label: "Feedback Inbox",
      icon: Inbox,
      badge: unreadCount > 0 ? unreadCount : null,
    },
    {
      href: "/dashboard",
      label: "Overview",
      icon: LayoutDashboard,
    },
    {
      href: "/dashboard/analytics",
      label: "Analytics & NPS",
      icon: BarChart3,
    },
  ];

  const opsNav = [
    {
      href: "/dashboard/locations",
      label: "Branches & Units",
      icon: MapPin,
      badge: locations.length > 0 ? locations.length : null,
    },
    {
      href: "/dashboard/qr-codes",
      label: "QR Studio & Print",
      icon: QrCode,
    },
    {
      href: "/dashboard/reports",
      label: "Executive Reports",
      icon: FileText,
    },
  ];

  const prefNav = [
    {
      href: "/dashboard/settings",
      label: "Business Settings",
      icon: Settings,
    },
  ];

  const getInitials = (name?: string) => {
    if (!name) return "S";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <aside className="w-64 flex-shrink-0 bg-zinc-950 text-zinc-300 border-r border-zinc-800/80 flex flex-col justify-between min-h-screen select-none">
      {/* Top Section */}
      <div className="space-y-6">
        {/* Workspace Selector Lockup */}
        <div className="p-3 border-b border-zinc-800/70">
          <div className="p-2 rounded-lg bg-zinc-900/80 hover:bg-zinc-900 border border-zinc-800 transition flex items-center justify-between cursor-pointer group">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-md bg-blue-600 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
                {getInitials(business?.name)}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-zinc-100 truncate group-hover:text-white transition">
                  {business?.name || "My Business"}
                </div>
                <div className="text-[10px] text-zinc-400 font-mono flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="truncate">{business?.category || "Specialty"}</span>
                </div>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300 shrink-0 ml-1" />
          </div>

          {/* Quick feedback public link pill & Notification trigger */}
          <div className="mt-2.5 px-2 flex items-center justify-between text-[11px] text-zinc-400">
            {business?.slug ? (
              <a
                href={`/f/${business.slug}`}
                target="_blank"
                rel="noreferrer"
                className="text-[10px] text-blue-400 hover:text-blue-300 inline-flex items-center gap-1 hover:underline font-mono"
              >
                <span>/f/{business.slug}</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            ) : (
              <span className="text-[10px] font-mono text-zinc-500">Workspace Active</span>
            )}

            {onOpenNotifications && (
              <button
                type="button"
                onClick={onOpenNotifications}
                className="relative p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition"
                title="Notifications"
              >
                <Bell className="w-3.5 h-3.5" />
                {unreadNotifs > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-red-500" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Navigation Categories */}
        <div className="px-3 space-y-6">
          {/* Core */}
          <div className="space-y-1">
            <div className="px-2.5 pb-1 text-[10px] font-mono font-semibold tracking-wider uppercase text-zinc-400">
              Workspace
            </div>
            {coreNav.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition ${
                    isActive
                      ? "bg-zinc-800/90 text-white shadow-sm font-semibold"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? "text-blue-400" : "text-zinc-400"}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== null && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                        isActive
                          ? "bg-blue-600 text-white"
                          : "bg-zinc-800 text-zinc-400"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Operations */}
          <div className="space-y-1">
            <div className="px-2.5 pb-1 text-[10px] font-mono font-semibold tracking-wider uppercase text-zinc-400">
              Operations
            </div>
            {opsNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition ${
                    isActive
                      ? "bg-zinc-800/90 text-white shadow-sm font-semibold"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? "text-blue-400" : "text-zinc-400"}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== null && (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Configuration */}
          <div className="space-y-1">
            <div className="px-2.5 pb-1 text-[10px] font-mono font-semibold tracking-wider uppercase text-zinc-400">
              Management
            </div>
            {prefNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition ${
                    isActive
                      ? "bg-zinc-800/90 text-white shadow-sm font-semibold"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? "text-blue-400" : "text-zinc-400"}`} />
                    <span>{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Profile & Sign Out */}
      <div className="p-3 border-t border-zinc-800/80 space-y-2">
        <div className="px-2.5 py-2 rounded-md bg-zinc-900/50 border border-zinc-800/60 flex items-center justify-between">
          <div className="min-w-0 pr-2">
            <div className="text-[11px] font-semibold text-zinc-200 truncate">
              {userEmail || "Signed in"}
            </div>
            <div className="text-[10px] font-mono text-zinc-400 flex items-center gap-1">
              <span>Owner</span>
              <span>&bull;</span>
              <span className="text-emerald-400">Verified</span>
            </div>
          </div>
          <button
            type="button"
            onClick={signOut}
            title="Sign out of Signal"
            className="p-1.5 rounded text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="px-2.5 pt-1 text-[10px] text-zinc-400 font-mono flex items-center justify-between">
          <span>Signal v2.0</span>
          <a
            href="https://veqlo.me"
            target="_blank"
            rel="noreferrer"
            className="hover:text-zinc-400 transition"
          >
            veqlo.me &rarr;
          </a>
        </div>
      </div>
    </aside>
  );
}
