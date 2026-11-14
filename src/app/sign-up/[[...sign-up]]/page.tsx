import { SignUp } from "@clerk/nextjs";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-[440px] flex flex-col items-center">
        {/* Brand header */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2 mb-2 group">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-white font-bold text-base shadow-sm">
              S
            </div>
            <span className="font-semibold text-lg tracking-tight text-zinc-900">
              Signal
            </span>
          </Link>
          <p className="text-xs text-zinc-500">
            Listen beyond the rating. Create your free business account.
          </p>
        </div>

        {/* Clerk SignUp Component with Signal Enterprise Styling */}
        <SignUp
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
          fallbackRedirectUrl="/onboarding"
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "w-full shadow-sm border border-zinc-200/80 rounded-xl bg-white p-6 sm:p-8",
              headerTitle: "text-base font-semibold text-zinc-900",
              headerSubtitle: "text-xs text-zinc-500",
              socialButtonsBlockButton:
                "border border-zinc-200 hover:bg-zinc-50 text-zinc-700 text-xs font-medium rounded-lg h-9 transition",
              dividerLine: "bg-zinc-200",
              dividerText: "text-zinc-400 text-[11px]",
              formFieldLabel: "text-xs font-medium text-zinc-700 mb-1",
              formFieldInput:
                "text-xs rounded-lg border border-zinc-200 py-2 px-3 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 transition h-9",
              formButtonPrimary:
                "bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold py-2.5 rounded-lg transition shadow-sm h-9",
              footerActionLink: "text-zinc-900 font-semibold hover:underline text-xs",
              identityPreviewText: "text-xs text-zinc-700 font-medium",
              identityPreviewEditButton: "text-zinc-900 hover:text-zinc-600 text-xs",
            },
          }}
        />

        {/* Footer info */}
        <div className="mt-8 text-center text-[11px] text-zinc-400">
          Protected by Signal by Veqlo &copy; {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
}
