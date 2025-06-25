import { FcGoogle } from "react-icons/fc";

import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Separator } from "../ui/separator";
import { SignInFlow } from "@/types/global";
import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { TriangleAlert } from "lucide-react";
import { ConvexError } from "convex/values";

interface SignInCardProps {
  setSignType: (signType: SignInFlow) => void;
}

function SignInCard(props: Readonly<SignInCardProps>) {
  const { setSignType } = props;

  const { signIn } = useAuthActions();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    if (password !== confirmPassword) {
      setError(
        "Invalid! Password mismatch, please try to enter password again"
      );
      alert(error); //change to modal
      setIsLoading(false);
      return;
    }

    try {
      await signIn("password", { email, password, flow: "signUp" });
    } catch (e) {
      setError(e as string);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSignUp() {
    setIsLoading(true);
    try {
      await signIn("google");
    } catch (e) {
      const errorMessage =
        e instanceof ConvexError
          ? (e.data as { message: string }).message
          : "Unexpected error occurred";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="text-center p-4 h-full w-full">
      <CardHeader>
        <CardTitle>Sign up to continue</CardTitle>
        <CardDescription>Create a new account</CardDescription>
      </CardHeader>
      {error && (
        <div className=" flex justify-center p-2 mb-4 text-destructive flex-col items-center">
          <TriangleAlert />
          <p className="font-semibold">{error}</p>
        </div>
      )}
      <CardContent className="space-y-5 px-0 pb-0">
        <form onSubmit={handleSubmit} className="space-y-2.5">
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border border-gray-500 p-2 w-full rounded-md "
            disabled={isLoading}
          />
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border border-gray-500 p-2 w-full rounded-md border-solid"
            disabled={isLoading}
          />
          <input
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="border border-gray-500 p-2 w-full rounded-md border-solid"
            disabled={isLoading}
          />
          <Button
            type="submit"
            className="w-full"
            size={"lg"}
            disabled={isLoading}
          >
            Sign Up
          </Button>
        </form>
        <Separator />
        <div className="flex justify-center">
          <Button
            className="w-full"
            variant={"outline"}
            size={"lg"}
            disabled={isLoading}
            onClick={handleSignUp}
          >
            <FcGoogle />
            Sign Up with Google
          </Button>
        </div>
        <p className="text-sm text-left text-gray-500">
          Already have an account?{" "}
          <button onClick={() => setSignType("signIn")} disabled={isLoading}>
            <span className="hover:underline text-sky-700">Sign In</span>
          </button>
        </p>
      </CardContent>
    </Card>
  );
}

export default SignInCard;
