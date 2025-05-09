"use client";

import { useState } from "react";
import Image from "next/image";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

interface AuthDialogProps {
  trigger: React.ReactNode;
}

// Componente de formulario para compartir entre Dialog y Drawer
function AuthForm() {
  return (
    <div className="mt-2">
      <p className="text-neutral-700 mb-6 sr-only">
        Usa tu correo electrónico o cuenta de Google para acceder a Verbaliza.
      </p>

      {/* Botón de Google */}
      <Button
        variant="outline"
        className="w-full mb-3 py-6 relative"
        onClick={() => {
          // Implementación futura de autenticación con Google
        }}
      >
        <div className="absolute left-6">
          <Image src="/google.svg" alt="Google" width={20} height={20} />
        </div>
        <span className="mx-auto">Usar Google</span>
      </Button>

      {/* Botón de Correo Electrónico */}
      <Button
        variant="outline"
        className="w-full py-6 relative"
        onClick={() => {
          // Implementación futura para formulario de correo
        }}
      >
        <div className="absolute left-6">
          <Mail size={20} />
        </div>
        <span className="mx-auto">Usar un correo electrónico</span>
      </Button>
    </div>
  );
}

export default function AuthDialog({ trigger }: AuthDialogProps) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // Versión para escritorio (Dialog)
  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold mb-2">
              Inicia sesión o regístrate en un momento
            </DialogTitle>
            <DialogDescription className="text-neutral-700">
              Usa tu correo electrónico o cuenta de Google para acceder a
              Verbaliza.
            </DialogDescription>
          </DialogHeader>
          <AuthForm />
        </DialogContent>
      </Dialog>
    );
  }

  // Versión para móvil (Drawer)
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent className="px-4 pb-8">
        <DrawerHeader>
          <DrawerTitle className="text-3xl font-bold mb-2 text-center">
            Inicia sesión o regístrate en un momento
          </DrawerTitle>
          <DrawerDescription className="text-neutral-700 text-center">
            Usa tu correo electrónico o cuenta de Google para acceder a
            Verbaliza.
          </DrawerDescription>
        </DrawerHeader>
        <AuthForm />
      </DrawerContent>
    </Drawer>
  );
}
