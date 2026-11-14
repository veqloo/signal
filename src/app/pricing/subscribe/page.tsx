import Link from "next/link";
import { PricingTable } from "@clerk/nextjs";

export const metadata = {
  title: "Choose a Signal plan | Signal by Veqlo",
  description: "Compare Signal plans and manage your subscription securely.",
};

export default function SubscribePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <div className="mb-8">
          <Link href="/pricing" className="text-xs font-medium text-slate-500 hover:text-slate-900">
            ← Back to pricing
          </Link>
          <p className="mt-6 text-[11px] font-semibold uppercase tracking-widest text-blue-600">
            Signal by Veqlo
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Choose the right plan for your business.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">
            Secure checkout and subscription management are handled by Clerk Billing.
            Your plan is attached to your Signal account.
          </p>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-8">
          <PricingTable />
        </section>

        <p className="mt-6 text-center text-xs text-slate-500">
          Already subscribed?{" "}
          <Link href="/dashboard/billing" className="font-medium text-slate-900 underline underline-offset-4">
            Manage your subscription
          </Link>
        </p>
      </div>
    </main>
  );
}
