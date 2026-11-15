"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useUser, useSession, useClerk } from "@clerk/nextjs";
import {
  Business,
  BusinessLocation,
  Feedback,
  NotificationItem,
  DateRange,
  FeedbackStatus,
} from "@/types";
import { getSupabaseClient } from "./supabase/client";
import { slugify } from "./utils";

interface WorkspaceContextType {
  user: any | null;
  userEmail: string | null;
  business: Business | null;
  locations: BusinessLocation[];
  feedback: Feedback[];
  notifications: NotificationItem[];
  selectedDateRange: DateRange;
  selectedLocationId: string;
  isLoading: boolean;
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
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isLoaded: isClerkLoaded, isSignedIn, user: clerkUser } = useUser();
  const { session: clerkSession } = useSession();
  const { signOut: clerkSignOut } = useClerk();

  const [business, setBusiness] = useState<Business | null>(null);
  const [locations, setLocations] = useState<BusinessLocation[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [selectedDateRange, setDateRange] = useState<DateRange>("30d");
  const [selectedLocationId, setLocationFilter] = useState<string>("all");
  const [isDataLoading, setIsDataLoading] = useState<boolean>(true);

  const userEmail = useMemo(() => {
    return clerkUser?.primaryEmailAddress?.emailAddress ?? null;
  }, [clerkUser]);

  const loadWorkspace = useCallback(async () => {
    if (!isClerkLoaded) return;

    if (!isSignedIn || !clerkUser) {
      setBusiness(null);
      setLocations([]);
      setFeedback([]);
      setNotifications([]);
      setIsDataLoading(false);
      return;
    }

    setIsDataLoading(true);
    try {
      const clerkToken = await clerkSession?.getToken();
      const supabase = getSupabaseClient(clerkToken);

      // 1. Fetch user's business from Supabase by Clerk ID
      let { data: businesses, error: bizError } = await supabase
        .from("businesses")
        .select("*")
        .eq("owner_id", clerkUser.id)
        .order("created_at", { ascending: true })
        .limit(1);

      let currentBiz: Business | null = null;

      if (bizError) throw bizError;

      if (businesses && businesses.length > 0) {
        currentBiz = businesses[0];
      } else {
        // Fallback: If no business exists yet for this Clerk user, check by user profile email
        // to handle legacy accounts gracefully, or provision an initial business.
        const bizName =
          (clerkUser.publicMetadata?.business_name as string) ||
          `${clerkUser.firstName ? `${clerkUser.firstName}'s` : "My"} Business`;
        const bizSlug = `${slugify(bizName)}-${clerkUser.id.substring(clerkUser.id.length - 4)}`;
        const bizCategory =
          (clerkUser.publicMetadata?.business_category as string) || "Café & Restaurant";

        const { data: createdBiz, error: createBizErr } = await supabase
          .from("businesses")
          .insert({
            owner_id: clerkUser.id,
            name: bizName,
            slug: bizSlug,
            category: bizCategory,
            onboarding_completed: false,
          })
          .select()
          .single();

        if (!createBizErr && createdBiz) {
          currentBiz = createdBiz;
        } else if (createBizErr) {
          console.warn("[Workspace] Business insert notice:", createBizErr.message);
        }
      }

      if (currentBiz) {
        setBusiness(currentBiz);

        // 2. Fetch Locations
        const { data: locs, error: locsErr } = await supabase
          .from("locations")
          .select("*")
          .eq("business_id", currentBiz.id)
          .order("created_at", { ascending: true });

        if (locsErr) throw locsErr;

        if (locs && locs.length > 0) {
          setLocations(locs);
        } else {
          // Provision default Main Location only after a successful empty query
          const { data: createdLoc } = await supabase
            .from("locations")
            .insert({
              business_id: currentBiz.id,
              name: "Main Location",
              slug: "main",
              is_active: true,
            })
            .select()
            .single();

          if (createdLoc) {
            setLocations([createdLoc]);
          } else {
            setLocations([]);
          }
        }

        // 3. Fetch Real Feedback
        const { data: feedbackData, error: feedbackError } = await supabase
          .from("feedback")
          .select("*, locations(name)")
          .eq("business_id", currentBiz.id)
          .order("created_at", { ascending: false })
          .limit(1000);

        if (feedbackError) throw feedbackError;

        if (feedbackData) {
          setFeedback(
            feedbackData.map((f: any) => ({
              id: f.id,
              business_id: f.business_id,
              location_id: f.location_id || null,
              location_name: f.locations?.name || undefined,
              rating: f.rating,
              category: f.category || null,
              comment: f.comment || null,
              created_at: f.created_at,
              status: (f.status as FeedbackStatus) || "new",
              internal_notes: f.internal_notes || null,
            }))
          );
        } else {
          setFeedback([]);
        }

        // 4. Fetch Notifications
        const { data: notifs } = await supabase
          .from("notifications")
          .select("*")
          .eq("business_id", currentBiz.id)
          .order("created_at", { ascending: false })
          .limit(50);

        if (notifs) {
          setNotifications(notifs);
        } else {
          setNotifications([]);
        }
      } else {
        setBusiness(null);
        setLocations([]);
        setFeedback([]);
        setNotifications([]);
      }
    } catch (err) {
      console.error("Workspace initialization error:", err);
    } finally {
      setIsDataLoading(false);
    }
  }, [isClerkLoaded, isSignedIn, clerkUser, clerkSession]);

  useEffect(() => {
    loadWorkspace();
  }, [loadWorkspace]);

  const updateBusiness = async (updates: Partial<Business>): Promise<boolean> => {
    if (!business) return false;
    const previousBusiness = business;
    const updated = { ...business, ...updates, updated_at: new Date().toISOString() };
    setBusiness(updated);

    try {
      const clerkToken = await clerkSession?.getToken();
      const supabase = getSupabaseClient(clerkToken);
      const { error } = await supabase
        .from("businesses")
        .update(updates)
        .eq("id", business.id);
      if (error) throw error;
      return true;
    } catch (err) {
      setBusiness(previousBusiness);
      console.error("Failed to update business:", err);
      return false;
    }
  };

  const addLocation = async (name: string, address: string): Promise<BusinessLocation | null> => {
    if (!business) return null;
    const slug = slugify(name);

    try {
      const clerkToken = await clerkSession?.getToken();
      const supabase = getSupabaseClient(clerkToken);
      const { data, error } = await supabase
        .from("locations")
        .insert({
          business_id: business.id,
          name: name.trim(),
          slug,
          address: address.trim() || null,
          is_active: true,
        })
        .select()
        .single();

      if (error) throw error;
      setLocations((prev) => [...prev, data]);
      return data;
    } catch (err) {
      console.error("Failed to add location:", err);
      return null;
    }
  };

  const deleteLocation = async (id: string): Promise<boolean> => {
    try {
      const clerkToken = await clerkSession?.getToken();
      const supabase = getSupabaseClient(clerkToken);
      const { error } = await supabase.from("locations").delete().eq("id", id);
      if (error) throw error;
      setLocations((prev) => prev.filter((location) => location.id !== id));
      if (selectedLocationId === id) setLocationFilter("all");
      return true;
    } catch (err) {
      console.error("Failed to delete location:", err);
      return false;
    }
  };

  const updateFeedbackStatus = async (
    id: string,
    status: FeedbackStatus,
    note?: string
  ): Promise<boolean> => {
    const previousFeedback = feedback;
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

    try {
      const clerkToken = await clerkSession?.getToken();
      const supabase = getSupabaseClient(clerkToken);
      const payload: Record<string, unknown> = { status };
      if (note !== undefined) payload.internal_notes = note;
      const { error } = await supabase.from("feedback").update(payload).eq("id", id);
      if (error) throw error;
      return true;
    } catch (err) {
      setFeedback(previousFeedback);
      console.error("Failed to update feedback status:", err);
      return false;
    }
  };

  const markNotificationAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
    try {
      const clerkToken = await clerkSession?.getToken();
      const supabase = getSupabaseClient(clerkToken);
      await supabase.from("notifications").update({ is_read: true }).eq("id", id);
    } catch (err) {
      console.error(err);
    }
  };

  const markAllNotificationsAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    if (!business) return;
    try {
      const clerkToken = await clerkSession?.getToken();
      const supabase = getSupabaseClient(clerkToken);
      await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("business_id", business.id);
    } catch (err) {
      console.error(err);
    }
  };

  const signOut = async () => {
    try {
      await clerkSignOut();
    } catch (err) {
      console.error("SignOut error:", err);
    } finally {
      setBusiness(null);
      setLocations([]);
      setFeedback([]);
      setNotifications([]);
      router.push("/login");
    }
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.is_read).length;
  const isLoading = !isClerkLoaded || isDataLoading;

  return (
    <WorkspaceContext.Provider
      value={{
        user: clerkUser,
        userEmail,
        business,
        locations,
        feedback,
        notifications,
        selectedDateRange,
        selectedLocationId,
        isLoading,
        unreadNotificationsCount,
        setDateRange,
        setLocationFilter,
        updateBusiness,
        addLocation,
        deleteLocation,
        updateFeedbackStatus,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        refreshData: loadWorkspace,
        signOut,
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
