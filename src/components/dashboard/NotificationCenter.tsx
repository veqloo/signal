"use client";

import { useWorkspace } from "@/lib/workspace-context";
import { formatRelativeTime } from "@/lib/utils";
import { X, CheckCheck, AlertCircle, AlertTriangle, Info, Bell } from "lucide-react";

export function NotificationCenter({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } =
    useWorkspace();

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/20 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-slate-700" />
            <h2 className="text-sm font-bold text-slate-900">Notifications & Alerts</h2>
            {unreadCount > 0 && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-100 text-red-700">
                {unreadCount} new
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <button
                onClick={markAllNotificationsAsRead}
                className="text-xs font-medium text-slate-500 hover:text-slate-900 p-1.5 rounded hover:bg-slate-100 transition inline-flex items-center gap-1"
                title="Mark all as read"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No notifications yet. You will receive alerts when critical ratings are submitted.
            </div>
          ) : (
            notifications.map((item) => {
              const Icon =
                item.severity === "critical"
                  ? AlertCircle
                  : item.severity === "warning"
                  ? AlertTriangle
                  : Info;
              const colorClass =
                item.severity === "critical"
                  ? "text-red-600 bg-red-50 border-red-100"
                  : item.severity === "warning"
                  ? "text-amber-600 bg-amber-50 border-amber-100"
                  : "text-blue-600 bg-blue-50 border-blue-100";

              return (
                <div
                  key={item.id}
                  onClick={() => markNotificationAsRead(item.id)}
                  className={`p-3 rounded-lg transition cursor-pointer mb-1 ${
                    item.is_read ? "bg-white opacity-70" : "bg-slate-50 hover:bg-slate-100/80"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-1.5 rounded-md border ${colorClass} flex-shrink-0`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-semibold text-slate-900 truncate">
                          {item.title}
                        </h4>
                        {!item.is_read && (
                          <span className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0 ml-2" />
                        )}
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{item.message}</p>
                      <div className="text-[10px] text-slate-400 pt-1">
                        {formatRelativeTime(item.created_at)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
