"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import AuthDialog from "@/components/auth/AuthDialog";
import UserProfile from "@/components/home/UserProfile";
import { SquarePen, Save } from "lucide-react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

interface NavbarProps {
  onSave?: () => void;
  onPublish?: () => void;
}

export default function Navbar({ onSave, onPublish }: NavbarProps) {
  const { data: session } = useSession();
  const pathname = usePathname();

  // No mostrar el botón "Escribir" en la página de escritura
  const isWritePage = pathname === "/write";

  return (
    <nav className="w-full border-b border-gray-100 bg-white">
      <div className="container mx-auto flex h-16 items-center px-4 sm:px-6 lg:px-8">
        <div className="w-full flex justify-between items-center">
          <div className="flex items-center space-x-4">
            {/* Logo */}
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

            {/* Mostrar estado cuando esté en la página de escritura */}
            {isWritePage && (
              <>
                {/* Desktop: Mostrar solo "Borrador" */}
                <div className="hidden sm:flex space-x-3 h-6">
                  <span className="text-lg font-medium self-end leading-none -mb-0.5 bg-gradient-to-b from-neutral-500 to-neutral-800 bg-clip-text text-transparent">
                    Borrador
                  </span>
                </div>

                {/* Mobile: Solo mostrar "Borrador" */}
                <div className="sm:hidden flex space-x-3 h-6">
                  <span className="text-lg font-medium self-end leading-none -mb-0.5 bg-gradient-to-b from-neutral-500 to-neutral-800 bg-clip-text text-transparent">
                    Borrador
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Controles de usuario a la derecha */}
          <div className="flex items-center">
            {session?.user ? (
              <div className="flex items-center gap-3">
                {/* Botones específicos para la página de escritura */}
                {isWritePage && onSave && onPublish ? (
                  <>
                    {/* Desktop: Botones separados */}
                    <div className="hidden sm:flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={onSave}
                        className="flex items-center space-x-2"
                      >
                        <Save className="size-4" />
                        <span>Guardar</span>
                      </Button>

                      <Button
                        onClick={onPublish}
                        size="sm"
                        className="bg-gradient-to-b from-neutral-700 to-neutral-900 hover:from-neutral-800 hover:to-neutral-950 text-white"
                      >
                        Publicar
                      </Button>
                    </div>

                    {/* Mobile: Solo botón de Publicar */}
                    <div className="sm:hidden">
                      <Button
                        onClick={onPublish}
                        size="sm"
                        className="bg-gradient-to-b from-neutral-700 to-neutral-900 hover:from-neutral-800 hover:to-neutral-950 text-white"
                      >
                        Publicar
                      </Button>
                    </div>
                  </>
                ) : (
                  /* Botón Escribir - Solo mostrar si NO estamos en la página de escritura */
                  !isWritePage && (
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
                  )
                )}

                {/* Perfil de usuario - oculto en mobile si estamos en write page */}
                <div className={`${isWritePage ? "hidden sm:block" : ""}`}>
                  <UserProfile user={session.user} />
                </div>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-3">
                {/* Botón Iniciar sesión */}
                <AuthDialog
                  trigger={
                    <Button
                      variant="outline"
                      size="lg"
                      className="text-neutral-700 border-neutral-300 hover:bg-neutral-100 hover:border-neutral-400 transition-all duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                    >
                      Iniciar sesión
                    </Button>
                  }
                />

                {/* Botón Regístrate */}
                <AuthDialog
                  trigger={
                    <Button
                      size="lg"
                      className="bg-neutral-700 text-white hover:bg-neutral-800 transition-all duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                    >
                      Regístrate
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
