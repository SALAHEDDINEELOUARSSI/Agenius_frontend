"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function ResetPassword({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  // ✅ Vérifie la validité du token dès que la page se charge
  useEffect(() => {
    if (token) {
      fetch(`http://localhost:8686/api/password-reset/validate/${token}`)
        .then(res => {
          if (!res.ok) {
            alert("Lien de réinitialisation invalide ou expiré.");
            router.push("/login");
          }
        });
    }
  }, [token]);

  // ✅ Appel réel à l’API backend pour la réinitialisation
  const handleApiCall = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8686/api/password-reset/reset?token=${token}&newPassword=${password}`, {
        method: "POST"
      });

      if (response.ok) {
        alert("Mot de passe réinitialisé avec succès !");
        router.push("/login");
      } else {
        const errorText = await response.text();
        alert("Erreur : " + errorText);
      }
    } catch (error) {
      console.error("API call failed", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Validation côté frontend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setNewPasswordError('');

    if (!password) {
      setLoading(false);
      setPasswordError("Password is required");
      return;
    } else if (password.length < 6) {
      setLoading(false);
      setPasswordError("The password must be at least 6 characters long.");
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!passwordRegex.test(password)) {
      setLoading(false);
      setPasswordError("The password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.");
      return;
    }

    if (!newPassword) {
      setLoading(false);
      setNewPasswordError("Confirm password is required");
      return;
    }
    if (newPassword !== password) {
      setLoading(false);
      setNewPasswordError("Passwords do not match.");
      return;
    }

    if (!newPasswordError && !passwordError) {
      handleApiCall();
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Reset your password</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your new password to reset your password.
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="password1">New Password</Label>
          <Input
            id="password1"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
        </div>
        <div className="grid gap-3">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          {newPasswordError && <p className="text-red-500 text-sm">{newPasswordError}</p>}
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Loading ..." : "Reset Password"}
        </Button>
      </div>
      <div className="text-center text-sm">
        <Link href="/login" className="hover:underline hover:underline-offset-4 text-violet-700 hover:text-violet-400">
          Back to login
        </Link>
      </div>
    </form>
  );
}
