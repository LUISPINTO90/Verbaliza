"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import AuthDialog from "@/components/auth/AuthDialog";
import UserProfile from "@/components/home/UserProfile";
import { SquarePen } from "lucide-react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  // No mostrar el botón "Escribir" en la página de escritura
  const isWritePage = pathname === "/write";

  return (
    <nav className="w-full border-b border-gray-100 bg-white">
      <div className="container mx-auto flex h-16 items-center px-4 sm:px-6 lg:px-8">
        <div className="w-full flex justify-between items-center">
          {/* Logo en la izquierda */}
          <Link
            href="/"
            className="flex items-center transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            <Image
              src="/logo.png"
              alt="Logo"
              width={140}
              height={40}
              className="h-6 w-auto object-contain"
              priority
              quality={100}
            />
          </Link>

          {/* Controles de usuario a la derecha */}
          <div className="flex items-center">
            {session?.user ? (
              <div className="flex items-center gap-3">
                {/* Botón Escribir - Solo mostrar si NO estamos en la página de escritura */}
                {!isWritePage && (
                  <Link href="/write">
                    <Button
                      variant="outline"
                      size="lg"
                      className="text-neutral-700 border-neutral-300 hover:bg-neutral-100 hover:border-neutral-400 transition-all duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                    >
                      <SquarePen className="h-4 w-4 mr-2" />
                      Escribir
                    </Button>
                  </Link>
                )}

                {/* Perfil de usuario */}
                <UserProfile user={session.user} />
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-3">
                {/* Botón único para iniciar sesión */}
                <AuthDialog
                  trigger={
                    <Button
                      size="lg"
                      className="bg-neutral-700 text-white hover:bg-neutral-800 transition-all duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                    >
                      Iniciar sesión
                    </Button>
                  }
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
