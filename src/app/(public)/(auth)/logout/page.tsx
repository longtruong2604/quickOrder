"use client";
import { getRefreshTokenFromStorage } from "@/lib/utils";
import { useLogoutMutation } from "@/queries/use-auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

const LogoutPage = () => {
  const router = useRouter();
  const { mutateAsync } = useLogoutMutation();
  const ref = useRef<any>(null);
  const searchParams = useSearchParams();
  const token = searchParams.get("refreshToken");

  // prevent double api request
  useEffect(() => {
    if (ref.current || token !== getRefreshTokenFromStorage()) return;
    ref.current = true;
    mutateAsync().then(() => {
      setTimeout(() => {
        ref.current = null;
      }, 1000);
      router.push("/login");
    });
  }, []);
  return <div>Logout...</div>;
};
export default LogoutPage;
