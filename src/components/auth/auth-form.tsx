"use client";

import { useState } from "react";
import { SignInFlow } from "@/types/global";
import SignInCard from "./signInCard";
import SignUpCard from "./signUpCard";

function AuthForm() {
  const [signType, setSignType] = useState<SignInFlow>("signIn");
  return (
    <div className="flex justify-center md:h-auto md:w-[420px]">
      {signType === "signIn" ? <SignInCard /> : <SignUpCard />}
    </div>
  );
}

export default AuthForm;
