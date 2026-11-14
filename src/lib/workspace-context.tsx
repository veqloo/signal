"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Business, BusinessLocation, Feedback, NotificationItem, DateRange, FeedbackStatus } from "@/types";
import { DEMO_BUSINESS, DEMO_LOCATIONS, generateInitialFeedback, DEMO_NOTIFICATIONS } from "./demo-data";
import { getSupabaseClient } from "./supabase/client";

interface WorkspaceContextType {
  business: Business | null;
  locations: BusinessLocation[];
  feedback: Feedback[];
  notifications: NotificationItem[];
  selectedDateRange: DateRange;
  selectedLocationId: string; // "all" or specific location_id
  isDemoMode: boolean;
  isLoading: boolean;
  userEmail: string | null;
  unreadNotificationsCount: number;
  setDateRange: (range: DateRange) => void;
  setLocationFilter: (locId: string) => void;
  updateBusiness: (updates: Partial<Business>) => Promise<boolean>;
  addLocation: (name: string, address: string) => Promise<BusinessLocation | null>;
  deleteLocation: (id: string) => Promise<boolean>;
  updateFeedbackStatus: (id: string, status: FeedbackStatus, note?: string) => Promise<boolean>;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  refreshData: () => Promise<void>;
  signOut: () => Promise<void>;
  toggleDemoMode: () => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [business, setBusiness] = useState<Business | null>(DEMO_BUSINESS);
  const [locations, setLocations] = useState<BusinessLocation[]>(DEMO_LOCATIONS);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>(DEMO_NOTIFICATIONS);
  const [selectedDateRange, setDateRange] = useState<DateRange>("30d");
  const [selectedLocationId, setLocationFilter] = useState<string>("all");
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    // Initialize demo feedback
    const initial = generateInitialFeedback();
    setFeedback(initial);

    // Check if user is authenticated with Supabase
    checkAuthAndLoad();
  }, []);

  async function checkAuthAndLoad() {
    setIsLoading(true);
    try {
      const supabase = getSupabaseClient();
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        setUserEmail(session.user.email ?? null);
        setIsDemoMode(false);

        // Load real business from Supabase
        const { data: businesses, error: bizErr } = await supabase
          .from("businesses")
          .select("*")
          .order("created_at", { ascending: true })
          .limit(1);

        if (!bizErr && businesses && businesses.length > 0) {
          const biz = businesses[0];
          setBusiness(biz);

          // Load real locations
          const { data: locs } = await supabase
            .from("locations")
            .select("*")
            .eq("business_id", biz.id)
            .order("created_at", { ascending: true });

          if (locs && locs.length > 0) {
            setLocations(locs);
          } else {
            setLocations([]);
          }

          // Load real feedback
          const { data: fbList } = await supabase
            .from("feedback")
            .select("*")
            .eq("business_id", biz.id)
            .order("created_at", { ascending: false })
            .limit(1000);

          if (fbList) {
            setFeedback(
              fbList.map((f) => ({
                id: f.id,
                business_id: f.business_id,
                location_id: f.location_id || null,
                rating: f.rating,
                category: f.category || "General",
                comment: f.comment,
                status: (f.status as FeedbackStatus) || (f.rating <= 2 ? "flagged" : "new"),
                internal_notes: f.internal_notes || null,
                created_at: f.created_at,
              }))
            );
          }

          // Load notifications
          const { data: notifList } = await supabase
            .from("notifications")
            .select("*")
            .eq("business_id", biz.id)
            .order("created_at", { ascending: false })
            .limit(50);

          if (notifList) {
            setNotifications(notifList);
          }
        }
      } else {
        // Fallback to demo mode for frictionless previewing
        setIsDemoMode(true);
      }
    } catch (err) {
      console.warn("Could not load authenticated session, defaulting to demo mode", err);
      setIsDemoMode(true);
    } finally {
      setIsLoading(false);
    }
  }

  async function updateBusiness(updates: Partial<Business>): Promise<boolean> {
    if (!business) return false;
    const updated = { ...business, ...updates, updated_at: new Date().toISOString() };
    setBusiness(updated);

    if (!isDemoMode) {
      try {
        const supabase = getSupabaseClient();
        const { error } = await supabase
          .from("businesses")
          .update(updates)
          .eq("id", business.id);
        if (error) throw error;
      } catch (err) {
        console.error("Failed to update business in Supabase", err);
        return false;
      }
    }
    return true;
  }

  async function addLocation(name: string, address: string): Promise<BusinessLocation | null> {
    if (!business) return null;
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const newLoc: BusinessLocation = {
      id: `loc-${Date.now().toString(36)}`,
      business_id: business.id,
      name,
      slug,
      address: address || null,
      is_active: true,
      created_at: new Date().toISOString(),
    };

    if (!isDemoMode) {
      try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
          .from("locations")
          .insert({
            business_id: business.id,
            name,
            slug,
            address,
            is_active: true,
          })
          .select()
          .single();

        if (error) throw error;
        if (data) {
          setLocations((prev) => [...prev, data]);
          return data;
        }
      } catch (err) {
        console.error("Failed to save location in Supabase", err);
      }
    }

    setLocations((prev) => [...prev, newLoc]);
    return newLoc;
  }

  async function deleteLocation(id: string): Promise<boolean> {
    setLocations((prev) => prev.filter((l) => l.id !== id));
    if (!isDemoMode) {
      try {
        const supabase = getSupabaseClient();
        await supabase.from("locations").delete().eq("id", id);
      } catch (err) {
        console.error(err);
      }
    }
    return true;
  }

  async function updateFeedbackStatus(
    id: string,
    status: FeedbackStatus,
    note?: string
  ): Promise<boolean> {
    setFeedback((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status,
              internal_notes: note !== undefined ? note : item.internal_notes,
            }
          : item
      )
    );

    if (!isDemoMode) {
      try {
        const supabase = getSupabaseClient();
        const updatePayload: Record<string, unknown> = { status };
        if (note !== undefined) updatePayload.internal_notes = note;
        await supabase.from("feedback").update(updatePayload).eq("id", id);
      } catch (err) {
        console.error("Failed to update feedback status in Supabase", err);
      }
    }
    return true;
  }

  function markNotificationAsRead(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
  }

  function markAllNotificationsAsRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  }

  async function signOut() {
    try {
      const supabase = getSupabaseClient();
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
    setUserEmail(null);
    setIsDemoMode(true);
    setBusiness(DEMO_BUSINESS);
    setLocations(DEMO_LOCATIONS);
    setFeedback(generateInitialFeedback());
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }

  function toggleDemoMode() {
    setIsDemoMode((prev) => !prev);
  }

  const unreadNotificationsCount = notifications.filter((n) => !n.is_read).length;

  return (
    <WorkspaceContext.Provider
      value={{
        business,
        locations,
        feedback,
        notifications,
        selectedDateRange,
        selectedLocationId,
        isDemoMode,
        isLoading,
        userEmail,
        unreadNotificationsCount,
        setDateRange,
        setLocationFilter,
        updateBusiness,
        addLocation,
        deleteLocation,
        updateFeedbackStatus,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        refreshData: checkAuthAndLoad,
        signOut,
        toggleDemoMode,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
}
