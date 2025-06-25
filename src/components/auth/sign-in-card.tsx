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

interface SignInCardProps {
  setSignType: (signType: SignInFlow) => void;
}

function SignInCard(props: Readonly<SignInCardProps>) {
  const { setSignType } = props;
  return (
    <Card className="text-center p-4 h-full w-full">
      <CardHeader>
        <CardTitle>Log in to continue</CardTitle>
        <CardDescription>Use your email to continue</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 px-0 pb-0">
        <form action="" className="space-y-2.5">
          <input
            type="email"
            placeholder="Enter your email address"
            value={""}
            required
            className="border border-gray-500 p-2 w-full rounded-md "
          />
          <input
            type="password"
            placeholder="Enter your password"
            value={""}
            required
            className="border border-gray-500 p-2 w-full rounded-md border-solid"
          />
          <Button type="submit" className="w-full" size={"lg"}>
            Sign In
          </Button>
        </form>
        <Separator />
        <div className="flex justify-center">
          <Button className="w-full" variant={"outline"} size={"lg"}>
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
