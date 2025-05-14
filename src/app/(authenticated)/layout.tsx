"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/home/Navbar";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isWritePage = pathname === "/write";

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Solo mostrar el navbar por defecto si NO es /write */}
      {!isWritePage && <Navbar />}
      <main className="flex-grow">{children}</main>
    </div>
  );
}
