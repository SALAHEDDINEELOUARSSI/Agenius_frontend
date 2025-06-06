"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function ForgotPassword({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [message, setMessage] = useState(""); // Pour afficher un message de succès ou d'erreur
  const router = useRouter();

  // Fonction pour envoyer la demande au backend
  const handleApiCall = async () => {
  setLoading(true);
  try {
    const response = await fetch("http://localhost:8686/api/password-reset/request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: email }),
    });

    if (!response.ok) {
      throw new Error("Erreur lors de l'envoi de l'email de réinitialisation");
    }

    // je vais Afficher juste un message de succès, sans redirection
    setMessage("Si un compte existe, vous recevrez un email avec le lien de réinitialisation.");
  } catch (error) {
    console.error("API call failed", error);
    setMessage("Une erreur est survenue. Veuillez réessayer.");
  } finally {
    setLoading(false);
  }
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Empêche la redirection par défaut
    setEmailError("");
    setMessage(""); // Réinitialise les messages

    // Validation des champs
    if (!email) {
      setEmailError("Email is required");
      setLoading(false);
      return;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Email is invalid");
      setLoading(false);
      return;
    }

    // Appeler la fonction pour envoyer la demande à l'API
    handleApiCall();
  };

  return (
    <form onSubmit={handleSubmit} className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">
          Forgot password <span className="text-violet-700">Agenius</span>
        </h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your email address to receive a password reset link.
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Loading..." : "Send Reset Link"}
        </Button>
      </div>

      {/* Afficher le message après le traitement */}
      {message && (
        <div className="text-center text-sm text-green-500 mt-4">
          {message}
        </div>
      )}

      <div className="text-center text-sm">
        <Link
          href="/login"
          className="hover:underline hover:underline-offset-4 text-violet-700 hover:text-violet-400"
        >
          Back to login
        </Link>
      </div>
    </form>
  );
}
