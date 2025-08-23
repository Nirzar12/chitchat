"use client";

import LoadingLogo from "@/components/shared/LoadingLogo";
import { Button } from "@/components/ui/button";
import { ClerkProvider, useAuth, SignInButton } from "@clerk/nextjs";
import { Authenticated, AuthLoading, Unauthenticated, ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const ConvexClientProvider = ({ children }: Props) => {
  const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL!;
  const convex = new ConvexReactClient(CONVEX_URL);

  return (
    <ClerkProvider>
      <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
        <AuthLoading>
          <LoadingLogo />
        </AuthLoading>

        <Authenticated>
          {children}
        </Authenticated>

        <Unauthenticated>
          <div className="flex flex-col items-center justify-center h-screen">
            <p>You are not signed in.</p>
            <div className="border bg-blue-500 p-2 rounded-md"><SignInButton /></div>
          </div>
        </Unauthenticated>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
};

export default ConvexClientProvider;
