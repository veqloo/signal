export interface Business {
  id: string;
  owner_id?: string;
  name: string;
  slug: string;
  category: string | null;
  welcome_message: string | null;
  google_review_url: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface BusinessLocation {
  id: string;
  business_id: string;
  name: string;
  slug: string;
  address: string | null;
  is_active: boolean;
  created_at?: string;
}

export type FeedbackRating = 1 | 2 | 3 | 4 | 5;
export type FeedbackStatus = "new" | "read" | "flagged" | "resolved" | "archived";

export interface Feedback {
  id: string;
  business_id: string;
  location_id?: string | null;
  location_name?: string | null;
  rating: FeedbackRating;
  category: string | null;
  comment: string | null;
  status: FeedbackStatus;
  internal_notes?: string | null;
  created_at: string;
}

export interface NotificationItem {
  id: string;
  business_id: string;
  feedback_id?: string | null;
  title: string;
  message: string;
  severity: "info" | "warning" | "critical";
  is_read: boolean;
  created_at: string;
}

export type DateRange = "today" | "7d" | "30d" | "90d" | "all";
