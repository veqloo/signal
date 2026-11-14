import { Business, BusinessLocation, Feedback, NotificationItem } from "@/types";

export const DEMO_BUSINESS: Business = {
  id: "demo-biz-signal-001",
  name: "Northside Specialty Coffee",
  slug: "northside-coffee",
  category: "Café & Bakery",
  welcome_message:
    "We care deeply about your experience. How was your coffee, pastry, and service today?",
  google_review_url: "https://g.page/r/northside-coffee/review",
  created_at: new Date(Date.now() - 60 * 86400000).toISOString(),
  updated_at: new Date().toISOString(),
};

export const DEMO_LOCATIONS: BusinessLocation[] = [
  {
    id: "loc-01",
    business_id: "demo-biz-signal-001",
    name: "Downtown Flagship (Gran Vía)",
    slug: "downtown",
    address: "Calle Gran Vía 42, Madrid",
    is_active: true,
  },
  {
    id: "loc-02",
    business_id: "demo-biz-signal-001",
    name: "Uptown Roastery & Bakery",
    slug: "uptown",
    address: "Calle Serrano 118, Madrid",
    is_active: true,
  },
  {
    id: "loc-03",
    business_id: "demo-biz-signal-001",
    name: "Financial District Espresso Bar",
    slug: "financial",
    address: "Paseo de la Castellana 89, Madrid",
    is_active: true,
  },
];

const sampleComments = [
  { rating: 5, category: "Quality", text: "The Ethiopian pour-over was exceptional. Perfectly balanced acidity and floral notes. Barista was knowledgeable.", loc: "loc-01" },
  { rating: 5, category: "Service", text: "Incredible hospitality. Staff greeted me warmly despite the morning rush and remembered my oat flat white.", loc: "loc-02" },
  { rating: 4, category: "Speed", text: "Quick service for a busy Saturday morning. Card payment was fast.", loc: "loc-01" },
  { rating: 5, category: "Atmosphere", text: "Lovely minimalist vibe, warm lighting, quiet playlist. The ideal place to read for an hour.", loc: "loc-03" },
  { rating: 2, category: "Wait Time", text: "Waited 18 minutes for two iced lattes. Only one barista was on espresso during peak hours.", loc: "loc-02" },
  { rating: 5, category: "Food & Pastries", text: "The almond croissant was flaky and fresh out of the oven. 10/10.", loc: "loc-01" },
  { rating: 1, category: "Cleanliness", text: "Several tables by the window had dirty mugs from previous guests and weren't cleared.", loc: "loc-03" },
  { rating: 4, category: "Value", text: "A bit higher priced than average, but the quality of the single-origin bean makes it worth it.", loc: "loc-01" },
  { rating: 5, category: "Quality", text: "Silky flat white with gorgeous latte art. Consistently top tier.", loc: "loc-02" },
  { rating: 3, category: "Atmosphere", text: "A bit too loud inside with the grinder constantly going without acoustic dampening.", loc: "loc-01" },
  { rating: 5, category: "Service", text: "Elena at the register was wonderful and gave great bean recommendations for home brewing.", loc: "loc-03" },
  { rating: 2, category: "Quality", text: "My batch brew tasted bitter and lukewarm today. Usually much better.", loc: "loc-02" },
  { rating: 5, category: "Service", text: "Super dog friendly! They gave a treat to our golden retriever.", loc: "loc-01" },
  { rating: 4, category: "Speed", text: "Online pickup order was ready on the counter right on time.", loc: "loc-03" },
  { rating: 5, category: "Food & Pastries", text: "Cardamom bun is out of this world.", loc: "loc-02" },
];

export function generateInitialFeedback(): Feedback[] {
  const result: Feedback[] = [];
  const now = Date.now();

  // Generate 48 items spread over the past 30 days
  for (let i = 0; i < 48; i++) {
    const template = sampleComments[i % sampleComments.length];
    const daysAgo = (i * 0.6) + (i % 3) * 0.2;
    const date = new Date(now - daysAgo * 86400000);
    const locObj = DEMO_LOCATIONS.find((l) => l.id === template.loc);

    result.push({
      id: `fb-${1000 + i}`,
      business_id: "demo-biz-signal-001",
      location_id: template.loc,
      location_name: locObj?.name || "Main",
      rating: template.rating as 1 | 2 | 3 | 4 | 5,
      category: template.category,
      comment: template.text,
      status: template.rating <= 2 ? (i % 2 === 0 ? "flagged" : "resolved") : (i < 5 ? "new" : "read"),
      internal_notes: template.rating <= 2 ? "Discussed with morning shift manager. Resolved." : null,
      created_at: date.toISOString(),
    });
  }

  return result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export const DEMO_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-01",
    business_id: "demo-biz-signal-001",
    feedback_id: "fb-1004",
    title: "Low Rating Alert (2/5) · Wait Time",
    message: "Uptown Roastery: Customer reported 18-minute wait time during peak hours.",
    severity: "warning",
    is_read: false,
    created_at: new Date(Date.now() - 3 * 3600000).toISOString(),
  },
  {
    id: "notif-02",
    business_id: "demo-biz-signal-001",
    feedback_id: "fb-1006",
    title: "Critical Rating Alert (1/5) · Cleanliness",
    message: "Financial District: Tables were reported uncleared by customer.",
    severity: "critical",
    is_read: false,
    created_at: new Date(Date.now() - 14 * 3600000).toISOString(),
  },
  {
    id: "notif-03",
    business_id: "demo-biz-signal-001",
    title: "Weekly Milestone Reached",
    message: "Northside Coffee surpassed 92% positive customer satisfaction this week.",
    severity: "info",
    is_read: true,
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
];
