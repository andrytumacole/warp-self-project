import ConvexClientProvider from "@/components/convex/ConvexClientProvider";
import { auth } from "../../../auth";
import { ReactNode } from "react";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const session = await auth();
  return (
    <ConvexClientProvider session={session}>{children}</ConvexClientProvider>
  );
}
