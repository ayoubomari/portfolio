"use client";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";
import { useRouter } from "next/navigation";

// Define the expected response type (adjust this according to your API response)
interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

// Define the credentials type
interface Credentials {
  username: string;
  password: string;
}

const loginMutation = async (
  credentials: Credentials,
): Promise<LoginResponse> => {
  const response = await fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      JSON.stringify({
        message: errorData.error,
        status: response.status,
      }),
    );
  }

  return response.json();
};

export default function Page() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const mutation = useMutation({
    mutationFn: loginMutation,
    onSuccess: () => {
      router.push("/dashboard");
    },
    onError: (error: Error) => {
      console.error("Login failed:", error);
      // Handle error (e.g., show error message to user)
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ username, password });
  };

  return (
    <>
      <Header />
      <div className="flex min-h-screen">
        <div className="my-auto w-full p-10 md:w-1/2">
          <div className="mx-auto max-w-md grow">
            <div className="mb-8">
              <Image
                src="/assets/images/icons/logo.webp"
                alt="logo"
                width={50}
                height={50}
              />
            </div>
            <h1 className="mb-6 text-2xl font-bold">Sign in to your account</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="username"
                  className="mb-1 block text-sm font-medium"
                >
                  Username
                </label>
                <Input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="mb-1 block text-sm font-medium"
                >
                  Password
                </label>
                <Input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Checkbox id="remember" />
                  <label htmlFor="remember" className="ml-2 text-sm">
                    Remember me
                  </label>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Signing in..." : "Sign in"}
              </Button>
            </form>
            {mutation.isError && (
              <p className="mt-2 text-red-500">
                {JSON.parse(mutation.error.message).message ||
                  "Login failed. Please try again."}
              </p>
            )}
          </div>
        </div>
        <div className="relative hidden w-1/2 md:block">
          <Image
            src="/assets/images/contents/login-background.webp"
            alt="login"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
      <Footer />
    </>
  );
}
