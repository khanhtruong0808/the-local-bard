"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Button from "@/components/Button";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [view, setView] = useState("sign-in");
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });
    setView("check-email");
  };

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await supabase.auth.signInWithPassword({
      email,
      password,
    });
    router.push("/");
  };

  const handleGoogleSignIn = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) {
      console.error(error);
      return;
    }
    router.push("/");
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8 bg-blue-950">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Image
          className="mx-auto w-auto"
          width={40}
          height={40}
          alt="The Local Bard Logo"
          src="/logo.jpg"
        />
        <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-white">
          {view === "sign-in"
            ? "Sign In to your account"
            : "Sign Up for a new account"}
        </h2>
      </div>

      {view === "check-email" ? (
        <p className="text-center text-neutral-400">
          Check <span className="font-bold text-white">{email}</span> to
          continue signing up
        </p>
      ) : (
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form
            className="space-y-6"
            onSubmit={view === "sign-in" ? handleSignIn : handleSignUp}
          >
            <div>
              <label
                className="block text-sm/6 font-medium text-white"
                htmlFor="email"
              >
                Email
              </label>
              <div className="mt-2">
                <input
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white placeholder:text-white/30 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-yellow-500 sm:text-sm sm:leading-6"
                  name="email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  placeholder="you@example.com"
                />
              </div>
            </div>
            <div>
              <label
                className="block text-sm/6 font-medium text-white"
                htmlFor="password"
              >
                Password
              </label>
              <div className="mt-2">
                <input
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white placeholder:text-white/30 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-yellow-500 sm:text-sm sm:leading-6"
                  type="password"
                  name="password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  placeholder="••••••••"
                />
              </div>
            </div>
            {view === "sign-in" ? (
              <>
                <Button className="flex w-full justify-center" size="large">
                  Sign In
                </Button>
                <p className="mt-6 text-center text-sm text-neutral-400">
                  Don&apos;t have an account?
                  {/* Fake button, looks like a link */}
                  <button
                    className="ml-1 underline"
                    onClick={() => setView("sign-up")}
                  >
                    Sign Up Now
                  </button>
                </p>
              </>
            ) : null}
            {view === "sign-up" ? (
              <>
                <Button className="flex w-full justify-center" size="large">
                  Sign Up
                </Button>
                <p className="mt-6 text-center text-sm text-neutral-400">
                  Already have an account?
                  {/* Fake button, looks like a link */}
                  <button
                    className="ml-1 underline"
                    onClick={() => setView("sign-in")}
                  >
                    Sign In Now
                  </button>
                </p>
              </>
            ) : null}
          </form>
          <div>
            <div className="relative mt-10">
              <div
                className="absolute inset-0 flex items-center"
                aria-hidden="true"
              >
                <div className="w-full border-t border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm font-medium leading-6">
                <span className="bg-blue-950 px-6 text-white">
                  Or continue with
                </span>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-4">
              <Button
                variant="secondary"
                className="flex w-full items-center justify-center gap-3 rounded-md"
                onClick={handleGoogleSignIn}
              >
                <svg className="h-5 w-5" viewBox="0 0 256 262">
                  <path
                    d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                    fill="#4285F4"
                  />
                  <path
                    d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                    fill="#34A853"
                  />
                  <path
                    d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
                    fill="#FBBC05"
                  />
                  <path
                    d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                    fill="#EB4335"
                  />
                </svg>
                <span className="text-sm font-semibold leading-6">Google</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
