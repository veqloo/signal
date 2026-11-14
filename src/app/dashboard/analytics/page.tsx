import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import AnalyticsPageClient from "./page-client";

export default async function AnalyticsPage() {
  const { userId, has } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  if (!has({ feature: "advanced_analytics" })) {
    redirect("/pricing?upgrade=advanced_analytics");
  }

  return <AnalyticsPageClient />;
}
