"use client";

import { z } from "zod";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { auth, signInWithGoogle } from "@/firebase/client";
import { signIn as serverSignIn } from "@/lib/actions/auth.action";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import { signIn, signUp } from "@/lib/actions/auth.action";
import FormField from "./FormField";

const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(3),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      if (type === "sign-up") {
        const { name, email, password } = data;

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        const result = await signUp({
          uid: userCredential.user.uid,
          name: name!,
          email,
          password,
        });

        if (!result.success) {
          toast.error(result.message);
          return;
        }

        toast.success("Account created successfully. Please sign in.");
        router.push("/sign-in");
      } else {
        const { email, password } = data;

        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        const idToken = await userCredential.user.getIdToken();
        if (!idToken) {
          toast.error("Sign in Failed. Please try again.");
          return;
        }

        await signIn({
          email,
          idToken,
        });

        toast.success("Signed in successfully.");
        router.push("/");
      }
    } catch (error) {
      console.error('Authentication error:', error);
      toast.error(`There was an error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      const result = await signInWithGoogle();
      if (result?.user) {
        const idToken = await result.user.getIdToken();
        await serverSignIn({
          email: result.user.email!,
          idToken,
        });
        toast.success("Signed in with Google successfully");
        router.push("/");
      }
    } catch (error) {
      console.error('Google sign in error:', error);
      toast.error("Failed to sign in with Google");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const isSignIn = type === "sign-in";

  return (
    <div className="card-border lg:min-w-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center">
          <Image src="/logo.png" alt="logo" height={32} width={38} />
          <h2 className="text-primary-100">PrepView</h2>
        </div>

        <h3>Practice job interviews with AI</h3>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 mt-4 form"
          >
            {!isSignIn && (
              <FormField
                control={form.control}
                name="name"
                label="Name"
                placeholder="Your Name"
                type="text"
              />
            )}

            <FormField
              control={form.control}
              name="email"
              label="Email"
              placeholder="Your email address"
              type="email"
            />

            <FormField
              control={form.control}
              name="password"
              label="Password"
              placeholder="Enter your password"
              type="password"
            />

            <Button 
              className="btn w-full" 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-t-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {isSignIn ? "Signing In..." : "Creating Account..."}
                </div>
              ) : isSignIn ? "Sign In" : "Create an Account"}
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full flex justify-center">
                  <div className="w-1/4 border-t border-gray-300"></div>
                </div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-background text-muted-foreground text-xs font-medium tracking-wide">OR</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center justify-center gap-3 h-11 text-foreground border-input hover:bg-accent hover:text-accent-foreground"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading || isLoading}
            >
              {isGoogleLoading ? (
                <div className="w-5 h-5 border-2 border-t-2 border-primary rounded-full animate-spin"></div>
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                    <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.28426 53.749 C -8.52426 55.089 -9.24426 56.239 -10.4143 57.009 L -10.4143 60.529 L -6.46426 60.529 C -4.56426 58.689 -3.264 55.329 -3.264 51.509 Z"/>
                    <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.80426 62.159 -6.86426 60.529 L -10.4143 57.009 C -11.4143 57.719 -12.754 58.139 -14.754 58.139 C -17.4443 58.139 -19.6543 56.639 -20.4743 54.239 L -24.5343 54.239 L -24.5343 57.839 C -22.5943 61.689 -19.1543 63.239 -14.754 63.239 Z"/>
                    <path fill="#FBBC05" d="M -20.4743 54.239 C -20.8243 53.159 -21.0043 52.019 -21.0043 50.839 C -21.0043 49.659 -20.8143 48.519 -20.4743 47.439 L -20.4743 43.839 L -24.5343 43.839 C -25.7543 46.299 -26.3343 49.009 -26.3343 51.839 C -26.3343 54.669 -25.8143 57.379 -24.5343 59.839 L -20.4743 54.239 Z"/>
                    <path fill="#EA4335" d="M -14.754 43.439 C -12.3943 43.439 -10.3243 44.329 -8.72426 45.659 L -6.63426 43.569 C -8.88426 41.479 -11.6343 40.239 -14.754 40.239 C -19.1543 40.239 -22.5943 41.789 -24.5343 45.639 L -20.4743 47.439 C -19.6543 45.039 -17.4443 43.439 -14.754 43.439 Z"/>
                  </g>
                </svg>
              )}
              <span className="text-sm font-medium">Continue with Google</span>
            </Button>
          </form>
        </Form>

        <p className="text-center">
          {isSignIn ? "No account yet?" : "Have an account already?"}
          <Link
            href={!isSignIn ? "/sign-in" : "/sign-up"}
            className="font-bold text-user-primary ml-1"
          >
            {!isSignIn ? "Sign In" : "Sign Up"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;