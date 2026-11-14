import { redirect } from "next/navigation";

// Clerk validates the recovery link and renders the password reset flow.
export default function ResetPasswordPage() {
  redirect("/sign-in");
}
