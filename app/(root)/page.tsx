"use client";

import { UserButton } from "@clerk/nextjs";
import { useAuth } from "@clerk/nextjs";

export default function Home() {
  const data = useAuth();
  console.log("User ID from Clerk:", data);
  return (
    <>
      <div className="">
        <h1>Root - page.tsx</h1>
        <div>You are signed in as: {data.userId}</div>
      <UserButton />
      </div>
    </>
  );
}
