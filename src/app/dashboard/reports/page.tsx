import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ReportsPageClient from "./page-client";

export default async function ReportsPage() {
  const { userId, has } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  if (!has({ feature: "executive_reports" })) {
    redirect("/pricing?upgrade=executive_reports");
  }

  return <ReportsPageClient />;
}
