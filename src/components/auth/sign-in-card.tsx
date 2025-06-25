import { FcGoogle } from "react-icons/fc";

import { TriangleAlert } from "lucide-react";
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
import { useAuthActions } from "@convex-dev/auth/react";

import { useState } from "react";

interface SignInCardProps {
  setSignType: (signType: SignInFlow) => void;
}

function SignInCard(props: Readonly<SignInCardProps>) {
  const { signIn } = useAuthActions();
  const { setSignType } = props;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signIn("password", { email, password, flow: "signIn" });
    } catch (e) {
      setError("Invalid username or password");
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setIsLoading(true);
    try {
      await signIn("google");
    } catch (e) {
      setError("Error: " + e);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="text-center p-4 h-full w-full">
      <CardHeader>
        <CardTitle>Log in to continue</CardTitle>
        <CardDescription>Use your email to continue</CardDescription>
      </CardHeader>
      {error && (
        <div className="bg-red-50">
          <TriangleAlert />
          <p>{error}</p>
        </div>
      )}
      <CardContent className="space-y-5 px-0 pb-0">
        <form onSubmit={handleSubmit} className="space-y-2.5">
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            required
            className="border border-gray-500 p-2 w-full rounded-md "
            onChange={(e) => setEmail(e.target.value)}
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
          <Button
            className="w-full"
            size={"lg"}
            type="submit"
            disabled={isLoading}
          >
            Sign In
          </Button>
        </form>
        <Separator />
        <div className="flex justify-center">
          <Button
            className="w-full"
            variant={"outline"}
            size={"lg"}
            onClick={() => handleGoogleSignIn()}
          >
            <FcGoogle />
            Sign In with Google
          </Button>
        </div>
        <p className="text-sm text-left text-gray-500">
          Don&apos;t have an account?{" "}
          <button onClick={() => setSignType("signUp")}>
            <span className="hover:underline text-sky-700">Sign Up</span>
          </button>
        </p>
      </CardContent>
    </Card>
  );
}

export default SignInCard;
