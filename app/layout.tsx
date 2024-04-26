import AuthButton from "../components/AuthButton";

import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import BackButton from "@/components/BackButton";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "JobTrack - job application tracking",
  description:
    "JobTrack is your all-in-one solution for managing your job applications. Whether you&apos;re a freelancer, engineer, designer, product manager, or any other professional, JobTrack can help you keep track of your applications, interviews, and offers.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.className} dark`}>
      <body className="bg-background text-foreground">
        <nav className="w-full flex border-b h-16 justify-between items-center md:pr-5">
          <BackButton />

          <div className="w-full max-w-4xl flex justify-end items-center p-3 text-sm">
            <AuthButton />
          </div>
        </nav>

        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
