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
  workspaceError: string | null;
  unreadNotificationsCount: number;
  setDateRange: (range: DateRange) => void;
  setLocationFilter: (locId: string) => void;
  createBusiness: (input: {
    name: string;
    category: string;
    welcome_message: string | null;
    google_review_url: string | null;
    location_name: string;
    location_address: string;
  }) => Promise<Business>;
  updateBusiness: (updates: Partial<Business>) => Promise<boolean>;
  addLocation: (name: string, address: string) => Promise<BusinessLocation | null>;
  deleteLocation: (id: string) => Promise<boolean>;
  updateFeedbackStatus: (id: string, status: FeedbackStatus, note?: string) => Promise<boolean>;
  markNotificationAsRead: (id: string) => Promise<void>;
  markAllNotificationsAsRead: () => Promise<void>;
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
  const [workspaceError, setWorkspaceError] = useState<string | null>(null);

  const userEmail = useMemo(() => {
    return clerkUser?.primaryEmailAddress?.emailAddress ?? null;
  }, [clerkUser]);

  const loadWorkspace = useCallback(async () => {
    if (!isClerkLoaded) return;

    setWorkspaceError(null);

    if (!isSignedIn || !clerkUser) {
      setBusiness(null);
      setLocations([]);
      setFeedback([]);
      setNotifications([]);
      setWorkspaceError(null);
      setIsDataLoading(false);
      return;
    }

    setIsDataLoading(true);
    try {
      const clerkToken = await clerkSession?.getToken();
      if (!clerkToken) throw new Error("Your session has expired. Please sign in again.");
      const supabase = getSupabaseClient(clerkToken);

      // Resolve only a business explicitly owned by the signed-in Clerk user.
      // Do not silently create a demo/default restaurant when the query is empty.
      const { data: businesses, error: bizError } = await supabase
        .from("businesses")
        .select("*")
        .eq("owner_id", clerkUser.id)
        .order("created_at", { ascending: true })
        .limit(1);

      if (bizError) {
        console.error("Business lookup failed:", bizError);
        throw new Error(`Could not load your business workspace: ${bizError.message}`);
      }

      const currentBiz: Business | null = businesses?.[0] ?? null;
      if (!currentBiz) {
        setBusiness(null);
        setLocations([]);
        setFeedback([]);
        setNotifications([]);
        return;
      }

      setBusiness(currentBiz);

      const { data: locs, error: locsErr } = await supabase
        .from("locations")
        .select("*")
        .eq("business_id", currentBiz.id)
        .order("created_at", { ascending: true });
      if (locsErr) throw new Error(`Could not load business locations: ${locsErr.message}`);
      setLocations(locs ?? []);

      const { data: feedbackData, error: feedbackError } = await supabase
        .from("feedback")
        .select("*, locations(name)")
        .eq("business_id", currentBiz.id)
        .order("created_at", { ascending: false })
        .limit(1000);
      if (feedbackError) throw new Error(`Could not load customer feedback: ${feedbackError.message}`);
      setFeedback((feedbackData ?? []).map((item: any) => ({
        id: item.id,
        business_id: item.business_id,
        location_id: item.location_id || null,
        location_name: item.locations?.name || undefined,
        rating: item.rating,
        category: item.category || null,
        comment: item.comment || null,
        created_at: item.created_at,
        status: (item.status as FeedbackStatus) || "new",
        internal_notes: item.internal_notes || null,
      })));

      const { data: notifs, error: notificationsError } = await supabase
        .from("notifications")
        .select("*")
        .eq("business_id", currentBiz.id)
        .order("created_at", { ascending: false })
        .limit(50);
      if (notificationsError) throw new Error(`Could not load notifications: ${notificationsError.message}`);
      setNotifications(notifs ?? []);
    } catch (err) {
      console.error("Workspace initialization error:", err);
      setWorkspaceError(
        err instanceof Error ? err.message : "Signal couldn't load your workspace. Check your connection and try again."
      );
    } finally {
      setIsDataLoading(false);
    }
  }, [isClerkLoaded, isSignedIn, clerkUser, clerkSession]);

  useEffect(() => {
    loadWorkspace();
  }, [loadWorkspace]);

  const createBusiness = async (input: {
    name: string;
    category: string;
    welcome_message: string | null;
    google_review_url: string | null;
    location_name: string;
    location_address: string;
  }): Promise<Business> => {
    if (!clerkUser) throw new Error("Your Clerk account is not ready. Please sign in again.");

    const clerkToken = await clerkSession?.getToken();
    if (!clerkToken) throw new Error("Your session has expired. Please sign in again.");

    const supabase = getSupabaseClient(clerkToken);
    const baseSlug = slugify(input.name) || "business";
    const uniqueSuffix = crypto.randomUUID().slice(0, 6);
    const businessSlug = `${baseSlug}-${uniqueSuffix}`;

    const { data: createdBusiness, error: businessError } = await supabase
      .from("businesses")
      .insert({
        owner_id: clerkUser.id,
        name: input.name.trim(),
        slug: businessSlug,
        category: input.category,
        welcome_message: input.welcome_message,
        google_review_url: input.google_review_url,
        onboarding_completed: false,
      })
      .select("*")
      .single();

    if (businessError) throw new Error(`Could not create your business: ${businessError.message}`);

    // Keep the business visible if location creation needs to be retried.
    setBusiness(createdBusiness);

    const locationName = input.location_name.trim() || "Main Location";
    const locationSlug = `${slugify(locationName) || "main-location"}-${uniqueSuffix}`;
    const { data: createdLocation, error: locationError } = await supabase
      .from("locations")
      .insert({
        business_id: createdBusiness.id,
        name: locationName,
        slug: locationSlug,
        address: input.location_address.trim() || null,
        is_active: true,
      })
      .select("*")
      .single();

    if (locationError) {
      throw new Error(`Your business was created, but its first location could not be saved: ${locationError.message}`);
    }

    // Memberships enable future team features; business ownership remains authoritative.
    const { error: membershipError } = await supabase
      .from("business_memberships")
      .insert({ business_id: createdBusiness.id, user_id: clerkUser.id, role: "owner" });
    if (membershipError) console.warn("Business owner membership could not be created:", membershipError);

    const { error: completionError } = await supabase
      .from("businesses")
      .update({ onboarding_completed: true })
      .eq("id", createdBusiness.id)
      .eq("owner_id", clerkUser.id);

    if (completionError) {
      throw new Error(`Your business was saved, but setup could not be completed: ${completionError.message}`);
    }

    const completedBusiness = { ...createdBusiness, onboarding_completed: true };
    setBusiness(completedBusiness);
    setLocations([createdLocation]);
    setFeedback([]);
    setNotifications([]);
    setWorkspaceError(null);
    return completedBusiness;
  };

  const updateBusiness = async (updates: Partial<Business>): Promise<boolean> => {
    if (!business) return false;
    const previousBusiness = business;
    const updated = { ...business, ...updates, updated_at: new Date().toISOString() };
    setBusiness(updated);

    try {
      const clerkToken = await clerkSession?.getToken();
      if (!clerkToken) throw new Error("Your session has expired. Please sign in again.");
      const supabase = getSupabaseClient(clerkToken);
      const { error } = await supabase
        .from("businesses")
        .update(updates)
        .eq("id", business.id);
      if (error) throw error;
      return true;
    } catch (err) {
      console.error("Failed to update business:", err);
      setBusiness(previousBusiness);
      return false;
    }
  };

  const addLocation = async (name: string, address: string): Promise<BusinessLocation | null> => {
    if (!business) return null;
    const slug = slugify(name);

    try {
      const clerkToken = await clerkSession?.getToken();
      if (!clerkToken) throw new Error("Your session has expired. Please sign in again.");
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
    const previousLocations = locations;
    setLocations((prev) => prev.filter((l) => l.id !== id));
    try {
      const clerkToken = await clerkSession?.getToken();
      if (!clerkToken) throw new Error("Your session has expired. Please sign in again.");
      const supabase = getSupabaseClient(clerkToken);
      const { error } = await supabase.from("locations").delete().eq("id", id);
      if (error) throw error;
      return true;
    } catch (err) {
      console.error("Failed to delete location:", err);
      setLocations(previousLocations);
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
      if (!clerkToken) throw new Error("Your session has expired. Please sign in again.");
      const supabase = getSupabaseClient(clerkToken);
      const payload: Record<string, unknown> = { status };
      if (note !== undefined) payload.internal_notes = note;
      const { error } = await supabase.from("feedback").update(payload).eq("id", id);
      if (error) throw error;
      return true;
    } catch (err) {
      console.error("Failed to update feedback status:", err);
      setFeedback(previousFeedback);
      return false;
    }
  };

  const markNotificationAsRead = async (id: string) => {
    const previousNotifications = notifications;
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
    try {
      const clerkToken = await clerkSession?.getToken();
      if (!clerkToken) throw new Error("Your session has expired. Please sign in again.");
      const supabase = getSupabaseClient(clerkToken);
      const { error } = await supabase.from("notifications").update({ is_read: true }).eq("id", id);
      if (error) throw error;
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
      setNotifications(previousNotifications);
    }
  };

  const markAllNotificationsAsRead = async () => {
    if (!business) return;
    const previousNotifications = notifications;
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    try {
      const clerkToken = await clerkSession?.getToken();
      if (!clerkToken) throw new Error("Your session has expired. Please sign in again.");
      const supabase = getSupabaseClient(clerkToken);
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("business_id", business.id);
      if (error) throw error;
    } catch (err) {
      console.error("Failed to mark all notifications as read:", err);
      setNotifications(previousNotifications);
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
        workspaceError,
        unreadNotificationsCount,
        setDateRange,
        setLocationFilter,
        createBusiness,
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
