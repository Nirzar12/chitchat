"use client";

import { UserButton } from "@clerk/nextjs";
import { useAuth } from "@clerk/nextjs";

export default function Home() {
  const data = useAuth();
  console.log("User ID from Clerk:", data);
  return (
    <>
      <div className="w-full h-full flex flex-col items-center justify-center ">
        <div>You are signed in as: {data.userId}</div>
      <UserButton />
      </div>
    </>
  );
}
