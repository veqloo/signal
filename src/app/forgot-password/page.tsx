import { redirect } from "next/navigation";

// Password recovery is handled by Clerk's SignIn flow.
export default function ForgotPasswordPage() {
  redirect("/sign-in");
}
