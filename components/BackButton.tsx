"use client";

import { useRouter, useSelectedLayoutSegments } from "next/navigation";
import { Button } from "./ui/button";
import { ChevronLeft } from "lucide-react";

export default function BackButton() {
  const router = useRouter();
  const segments = useSelectedLayoutSegments();
  if (segments.length === 2 && segments[0] === "positions") {
    return (
      <Button
        className="h-full rounded-none"
        variant="ghost"
        onClick={() => router.push("/positions")}
      >
        <ChevronLeft />
      </Button>
    );
  }
  return <div></div>;
}
