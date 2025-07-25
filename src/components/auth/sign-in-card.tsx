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
        <div className=" flex justify-center p-2 mb-4 text-destructive flex-col items-center">
          <TriangleAlert />
          <p className="font-semibold">{error}</p>
        </div>
      )}
      <CardContent className="space-y-5 px-0 pb-0">
        <form onSubmit={handleSubmit} className="space-y-2.5">
          <div>
            <label
              htmlFor="email"
              className="text-left flex text-sm font-semibold"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border border-gray-500 p-2 w-full rounded-md "
              disabled={isLoading}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="text-left flex text-sm font-semibold"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border border-gray-500 p-2 w-full rounded-md border-solid"
              disabled={isLoading}
            />
          </div>

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
