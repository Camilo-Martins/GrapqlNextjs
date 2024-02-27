"use client";
import useToken from "@/hooks/useToken";
import { useRouter } from "next/navigation";
import React from "react";

const index = () => {
  const { getToken } = useToken();
  const router = useRouter();

  if (getToken) {
    router.push("/dashboard");
  }

  return (
    <div>
     
    </div>
  );
};

export default index;
