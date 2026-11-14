import { redirect } from "next/navigation";

// Clerk handles email verification inside its sign-up flow.
export default function VerifyEmailPage() {
  redirect("/sign-up");
}
