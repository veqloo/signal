import { Feedback, DateRange } from "@/types";

export function filterFeedback(
  items: Feedback[],
  range: DateRange,
  locationId: string
): Feedback[] {
  let filtered = [...items];

  // Location filter
  if (locationId && locationId !== "all") {
    filtered = filtered.filter((f) => f.location_id === locationId);
  }

  // Date range filter
  const now = new Date();
  if (range === "today") {
    const todayStr = now.toDateString();
    filtered = filtered.filter((f) => new Date(f.created_at).toDateString() === todayStr);
  } else if (range === "7d") {
    const cutoff = new Date(now.getTime() - 7 * 86400000);
    filtered = filtered.filter((f) => new Date(f.created_at) >= cutoff);
  } else if (range === "30d") {
    const cutoff = new Date(now.getTime() - 30 * 86400000);
    filtered = filtered.filter((f) => new Date(f.created_at) >= cutoff);
  } else if (range === "90d") {
    const cutoff = new Date(now.getTime() - 90 * 86400000);
    filtered = filtered.filter((f) => new Date(f.created_at) >= cutoff);
  }

  return filtered;
}

export function computeMetrics(filtered: Feedback[], allItems: Feedback[]) {
  const total = filtered.length;
  if (total === 0) {
    return {
      averageRating: 0,
      totalResponses: 0,
      positivePercentage: 0,
      attentionNeeded: 0,
      distribution: [5, 4, 3, 2, 1].map((r) => ({ rating: r, count: 0, percentage: 0 })),
      categories: [],
      ratingSentimentIndex: 0,
    };
  }

  const sum = filtered.reduce((acc, f) => acc + f.rating, 0);
  const averageRating = Number((sum / total).toFixed(2));

  const positiveCount = filtered.filter((f) => f.rating >= 4).length;
  const positivePercentage = Math.round((positiveCount / total) * 100);

  const attentionNeeded = filtered.filter((f) => f.rating <= 2).length;

  const distribution = [5, 4, 3, 2, 1].map((rating) => {
    const count = filtered.filter((f) => f.rating === rating).length;
    return {
      rating,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
    };
  });

  // Category breakdown
  const catMap: Record<string, { count: number; sum: number }> = {};
  filtered.forEach((f) => {
    const cat = f.category || "General";
    if (!catMap[cat]) catMap[cat] = { count: 0, sum: 0 };
    catMap[cat].count += 1;
    catMap[cat].sum += f.rating;
  });

  const categories = Object.keys(catMap).map((cat) => ({
    name: cat,
    count: catMap[cat].count,
    average: Number((catMap[cat].sum / catMap[cat].count).toFixed(1)),
    percentage: Math.round((catMap[cat].count / total) * 100),
  })).sort((a, b) => b.count - a.count);

  // A 1–5 rating is not a standard 0–10 NPS survey. Keep this explicitly
  // labelled as a rating sentiment index: 5-star share minus 1–3-star share.
  const fiveStarRatings = filtered.filter((f) => f.rating === 5).length;
  const lowRatings = filtered.filter((f) => f.rating <= 3).length;
  const ratingSentimentIndex = Math.round(((fiveStarRatings - lowRatings) / total) * 100);

  return {
    averageRating,
    totalResponses: total,
    positivePercentage,
    attentionNeeded,
    distribution,
    categories,
    ratingSentimentIndex,
  };
}

export function computeDailyActivity(filtered: Feedback[], daysCount = 7) {
  const result: { date: Date; dateStr: string; label: string; count: number; avgRating: number }[] = [];
  const now = new Date();

  for (let i = daysCount - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 86400000);
    const dayDateStr = d.toDateString();
    const dayItems = filtered.filter((f) => new Date(f.created_at).toDateString() === dayDateStr);

    const count = dayItems.length;
    const avg = count > 0 ? dayItems.reduce((acc, c) => acc + c.rating, 0) / count : 0;

    result.push({
      date: d,
      dateStr: dayDateStr,
      label: d.toLocaleDateString("en-US", { weekday: "short", month: "numeric", day: "numeric" }),
      count,
      avgRating: Number(avg.toFixed(1)),
    });
  }

  return result;
}
