import Link from "next/link";
import { forgotPasswordAction } from "@/app/actions/auth";
import { AuthCard } from "@/components/AuthCard";
import { AuthForm } from "@/components/AuthForm";

export default function ForgotPasswordPage() {
  return (
    <AuthCard
      title="Reset your password"
      description="Generate a secure reset token. Connect SMTP in production to email reset links automatically."
      footer={
        <>
          Remembered it? <Link className="font-semibold text-blue-700" href="/login">Back to login</Link>
        </>
      }
    >
      <AuthForm mode="forgot" action={forgotPasswordAction} />
    </AuthCard>
  );
}
