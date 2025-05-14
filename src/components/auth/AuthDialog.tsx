"use client";

import { useState } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { signIn } from "next-auth/react";
import { GoogleIcon } from "@/components/icons/GoogleIcon";

interface AuthDialogProps {
  trigger: React.ReactNode;
}

export default function AuthDialog({ trigger }: AuthDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // Función para manejar el inicio de sesión con Google
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error);
      setIsLoading(false);
    }
  };

  // Contenido del diálogo
  const content = (
    <div className="w-full">
      <div className="mb-3">
        <DialogTitle className="text-2xl font-bold text-left">
          Inicia sesión con Google
        </DialogTitle>
        <DialogDescription className="text-neutral-600 mt-2 text-left">
          Usa tu cuenta de Google para acceder a Verbaliza de forma rápida y
          segura.
        </DialogDescription>
      </div>

      <Separator className="mb-6" />

      <div className="flex-1 flex items-center justify-center">
        <Button
          variant="outline"
          className="w-full py-6 relative cursor-pointer"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
        >
          <div className="absolute left-6">
            <GoogleIcon size={20} />
          </div>
          <span className="mx-auto">
            {isLoading ? "Iniciando sesión..." : "Continuar con Google"}
          </span>
        </Button>
      </div>
    </div>
  );

  // Versión para escritorio (Dialog)
  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className="sm:max-w-lg p-8 flex flex-col">
          <DialogClose className="absolute top-4 right-4 sr-only">
            Cerrar
          </DialogClose>
          {content}
        </DialogContent>
      </Dialog>
    );
  }

  // Versión para móvil (Drawer)
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent className="px-6 pb-8">
        <DrawerClose className="sr-only">Cerrar</DrawerClose>
        <div className="pt-6">{content}</div>
      </DrawerContent>
    </Drawer>
  );
}
