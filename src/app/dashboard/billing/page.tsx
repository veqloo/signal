import { UserProfile } from "@clerk/nextjs";
import { Header } from "@/components/dashboard/Header";

export const metadata = {
  title: "Plans & Billing | Signal by Veqlo",
};

export default function BillingPage() {
  return (
    <div className="flex-1 pb-16">
      <Header
        title="Plans & Billing"
        subtitle="Manage your Signal subscription, payment method, and account."
      />
      <div className="mx-auto max-w-5xl px-6 py-8">
        <div className="mb-6 max-w-2xl">
          <h2 className="text-sm font-semibold text-slate-900">Your subscription</h2>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">
            View your current plan, update billing details, or change your subscription.
            Subscription controls appear here once Clerk Billing is enabled for this Clerk instance.
          </p>
        </div>
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white p-2 shadow-sm sm:p-4">
          <UserProfile routing="hash" />
        </div>
      </div>
    </div>
  );
}
