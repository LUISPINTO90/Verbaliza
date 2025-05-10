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
import { AnimatePresence } from "framer-motion";
import MainAuthOptions from "./MainAuthOptions";
import EmailFormView from "./EmailFormView";
import PasswordFormView from "./PasswordFormView";
import RegisterFormView from "./RegisterFormView";

interface AuthDialogProps {
  trigger: React.ReactNode;
}

export default function AuthDialog({ trigger }: AuthDialogProps) {
  const [open, setOpen] = useState(false);
  const [currentView, setCurrentView] = useState<
    "main" | "email" | "password" | "register"
  >("main");
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleEmailClick = () => {
    setCurrentView("email");
  };

  const handleBackClick = () => {
    if (currentView === "email") {
      setCurrentView("main");
    } else if (currentView === "password") {
      setCurrentView("email");
    } else if (currentView === "register") {
      setCurrentView("main");
    }
  };

  const handleContinue = () => {
    if (currentView === "email") {
      setCurrentView("password");
    } else if (currentView === "password" || currentView === "register") {
      // Aquí iría la lógica para iniciar sesión o registrarse
      setOpen(false);
    }
  };

  const handleRegister = () => {
    setCurrentView("register");
  };

  const handleLogin = () => {
    setCurrentView("email");
  };

  // Resetear la vista al cerrar el diálogo
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      // Pequeño retraso para que no se vea el cambio antes de cerrarse
      setTimeout(() => {
        setCurrentView("main");
      }, 300);
    }
  };

  // Contenido compartido entre Dialog y Drawer
  const sharedContent = (
    <div className="relative overflow-hidden">
      <AnimatePresence mode="wait" initial={false}>
        {currentView === "main" ? (
          <MainAuthOptions key="main" onEmailClick={handleEmailClick} />
        ) : currentView === "email" ? (
          <EmailFormView
            key="email"
            onBack={handleBackClick}
            onContinue={handleContinue}
            onRegister={handleRegister}
          />
        ) : currentView === "password" ? (
          <PasswordFormView
            key="password"
            onBack={handleBackClick}
            onContinue={handleContinue}
            onRegister={handleRegister}
          />
        ) : (
          <RegisterFormView
            key="register"
            onBack={handleBackClick}
            onContinue={handleContinue}
            onLogin={handleLogin}
          />
        )}
      </AnimatePresence>
    </div>
  );

  // Versión para escritorio (Dialog)
  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className="sm:max-w-md overflow-hidden p-6">
          <DialogClose className="absolute top-4 right-4 sr-only">
            Cerrar
          </DialogClose>
          {sharedContent}
        </DialogContent>
      </Dialog>
    );
  }

  // Versión para móvil (Drawer)
  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent className="px-4 pb-8">
        <DrawerClose className="sr-only">Cerrar</DrawerClose>
        <div className="pt-4">{sharedContent}</div>
      </DrawerContent>
    </Drawer>
  );
}
