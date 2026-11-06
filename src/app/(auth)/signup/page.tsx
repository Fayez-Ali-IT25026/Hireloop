"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ImageIcon, Lock, Mail, User } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

const validatePassword = (password: string): string | null => {
  if (password.length < 6) return "Password must be at least 6 characters.";
  if (!/[A-Z]/.test(password)) return "Password must have an uppercase letter.";
  if (!/[a-z]/.test(password)) return "Password must have a lowercase letter.";
  return null;
};

const RegisterPage = () => {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [photoURL, setPhotoURL] = useState("");

  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const error = validatePassword(password);
    setPasswordError(error);

    if (error) {
      toast.error(error);
      return;
    }

    setLoading(true);

    try {
      const { data, error: authError } = await authClient.signUp.email({
        name,
        email,
        password,
        image: photoURL || undefined,
        callbackURL: "/signin",
      });

      if (authError) {
        toast.error(authError.message || "Registration failed. Try again.");
        return;
      }

      console.log("Registration successful:", data);
      toast.success("Account created successfully!");

      router.push("/signin");
      router.refresh();
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handelGoogleRegister = async () => {
    await authClient.signIn.social({
      provider: "google",
    });
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-6 py-28">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[800px] -translate-x-1/2 rounded-full bg-indigo-600/25 blur-[130px]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[500px] bg-[url('/cta-bg.png')] bg-cover bg-top opacity-30 [mask-image:linear-gradient(to_top,black,transparent_80%)]" />

      <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-white shadow-2xl shadow-indigo-950/50 backdrop-blur-xl">
        <Link href="/" className="block text-center text-xl font-bold tracking-tight">
          hire<span className="text-indigo-400">loop</span>
        </Link>

        <h1 className="mt-6 text-center text-2xl font-bold">Create your account</h1>
        <p className="mt-1 text-center text-sm text-zinc-400">
          Join Hireloop and find your dream job today.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-xs text-zinc-300">Name</Label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
              <Input id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Your full name" className="h-11 rounded-xl border-white/10 bg-white/5 pl-10 text-white placeholder:text-zinc-500 focus-visible:border-indigo-500/60 focus-visible:ring-indigo-500/20" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs text-zinc-300">Email</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
              <Input id="email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" className="h-11 rounded-xl border-white/10 bg-white/5 pl-10 text-white placeholder:text-zinc-500 focus-visible:border-indigo-500/60 focus-visible:ring-indigo-500/20" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="photoURL" className="text-xs text-zinc-300">Photo URL</Label>
            <div className="relative">
              <ImageIcon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
              <Input id="photoURL" name="photoURL" type="url" value={photoURL} onChange={(e) => setPhotoURL(e.target.value)} placeholder="https://example.com/photo.jpg" className="h-11 rounded-xl border-white/10 bg-white/5 pl-10 text-white placeholder:text-zinc-500 focus-visible:border-indigo-500/60 focus-visible:ring-indigo-500/20" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-xs text-zinc-300">Password</Label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
              <Input id="password" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••" className="h-11 rounded-xl border-white/10 bg-white/5 pl-10 text-white placeholder:text-zinc-500 focus-visible:border-indigo-500/60 focus-visible:ring-indigo-500/20" />
            </div>
            {passwordError && <p className="text-xs text-red-400">{passwordError}</p>}
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="h-11 w-full rounded-xl bg-indigo-600 font-semibold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500"
          >
            {loading ? "Creating account..." : "Register"}
          </Button>

          <div className="flex items-center gap-3 text-xs text-zinc-500">
            <span className="h-px flex-1 bg-white/10" /> Or <span className="h-px flex-1 bg-white/10" />
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handelGoogleRegister}
            className="h-11 w-full gap-3 rounded-xl border-white/10 bg-white text-slate-800 hover:bg-zinc-100 hover:text-slate-900"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="size-5" aria-hidden="true">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.05 13.22l7.98 6.19C11.96 13.72 17.48 9.5 24 9.5Z" />
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.75 7.18l7.73 6C44.43 37.95 46.98 31.83 46.98 24.55Z" />
              <path fill="#FBBC05" d="M10.03 28.59a14.5 14.5 0 0 1 0-9.18l-7.98-6.19a24 24 0 0 0 0 21.56l7.98-6.19Z" />
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.15 1.45-4.89 2.3-8.18 2.3-6.52 0-12.04-4.22-13.97-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z" />
            </svg>
            Sign up with Google
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-400">
          Already have an account?{" "}
          <Link href="/signin" className="font-medium text-indigo-400 hover:underline">Login</Link>
        </p>
      </div>
    </section>
  );
};

export default RegisterPage;