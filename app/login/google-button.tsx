"use client";

import { type ComponentProps } from "react";
import { loginWithExternalProvider } from "@/utils/supabase/auth";
import Image from "next/image";
import { Button } from "@/components/ui/button";

type Props = ComponentProps<"button"> & {
  pendingText?: string;
};

export function GoogleAuthButton({ children, pendingText, ...props }: Props) {
  const handleAuthGoogle = async () => {
    loginWithExternalProvider("google");
  };
  return (
    <Button onClick={handleAuthGoogle} className="">
      <Image
        className="w-6 h-6"
        src="https://www.svgrepo.com/show/475656/google-color.svg"
        loading="lazy"
        alt="google logo"
        width={24}
        height={24}
      />
      <span className="ml-2">Login with Google</span>
    </Button>
  );
}
