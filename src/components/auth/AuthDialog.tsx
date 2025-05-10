"use client";

import { useState, useEffect } from "react";
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
// Añadimos la importación de cn desde utils
import { cn } from "@/lib/utils";

interface AuthDialogProps {
  trigger: React.ReactNode;
}

// Tipo que representa todas las posibles vistas
type AuthView = "main" | "email" | "password" | "register";

// Dirección de la animación
type AnimationDirection = "forward" | "backward";

export default function AuthDialog({ trigger }: AuthDialogProps) {
  const [open, setOpen] = useState(false);
  const [currentView, setCurrentView] = useState<AuthView>("main");
  const [previousView, setPreviousView] = useState<AuthView>("main");
  const [direction, setDirection] = useState<AnimationDirection>("forward");
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // Estado para controlar si el teclado está abierto
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  // Función para detectar cambios en la altura de la ventana (teclado virtual)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => {
        // Una manera simplificada de detectar si el teclado está abierto
        // en dispositivos móviles es verificar si la altura de la ventana
        // es significativamente menor que la altura del dispositivo
        const windowHeight = window.innerHeight;
        const documentHeight = window.document.documentElement.clientHeight;
        setIsKeyboardOpen(windowHeight < documentHeight * 0.8);
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  // Función para cambiar de vista manteniendo el registro de la vista anterior
  const navigateTo = (
    nextView: AuthView,
    animationDirection: AnimationDirection
  ) => {
    setPreviousView(currentView);
    setDirection(animationDirection);

    // Pequeño retraso para que la animación de salida complete antes de cambiar la vista
    // Esto evita la "doble animación" que se ve
    setTimeout(() => {
      setCurrentView(nextView);
    }, 50);
  };

  const handleEmailClick = () => {
    navigateTo("email", "forward");
  };

  // Se actualiza para usar la vista almacenada en previousView
  const handleBackClick = () => {
    setDirection("backward");

    // Pequeño retraso para que la animación de salida complete antes de cambiar la vista
    setTimeout(() => {
      if (currentView === "register") {
        // Si estamos en la vista de registro, regresamos a la vista anterior
        setCurrentView(previousView);
      } else if (currentView === "email") {
        setCurrentView("main");
      } else if (currentView === "password") {
        setCurrentView("email");
      }
    }, 50);
  };

  const handleContinue = () => {
    if (currentView === "email") {
      navigateTo("password", "forward");
    } else if (currentView === "password" || currentView === "register") {
      // Aquí iría la lógica para iniciar sesión o registrarse
      setOpen(false);
    }
  };

  // Navega a la vista de registro, guardando la vista actual como anterior
  const handleRegister = () => {
    navigateTo("register", "forward");
  };

  // Navega a la vista de email, guardando la vista actual como anterior
  const handleLogin = () => {
    navigateTo("email", "forward");
  };

  // Resetear la vista al cerrar el diálogo
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      // Pequeño retraso para que no se vea el cambio antes de cerrarse
      setTimeout(() => {
        setCurrentView("main");
        setPreviousView("main");
        setDirection("forward");
      }, 300);
    }
  };

  // Contenido compartido entre Dialog y Drawer
  const sharedContent = (
    <div className="relative overflow-hidden">
      <AnimatePresence mode="wait" initial={false} custom={direction}>
        {currentView === "main" ? (
          <MainAuthOptions
            key="main"
            onEmailClick={handleEmailClick}
            direction={direction}
          />
        ) : currentView === "email" ? (
          <EmailFormView
            key="email"
            onBack={handleBackClick}
            onContinue={handleContinue}
            onRegister={handleRegister}
            direction={direction}
          />
        ) : currentView === "password" ? (
          <PasswordFormView
            key="password"
            onBack={handleBackClick}
            onContinue={handleContinue}
            onRegister={handleRegister}
            direction={direction}
          />
        ) : (
          <RegisterFormView
            key="register"
            onBack={handleBackClick}
            onContinue={handleContinue}
            onLogin={handleLogin}
            direction={direction}
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
    <Drawer
      open={open}
      onOpenChange={handleOpenChange}
      // Deshabilitar el escalado de fondo cuando el teclado está abierto
      shouldScaleBackground={!isKeyboardOpen}
      // Evitar que el drawer se cierre con un deslizamiento accidental
      dismissible={!isKeyboardOpen}
      repositionInputs={false}
    >
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent
        className={cn(
          "px-4 pb-8",
          // Si el teclado está abierto, ajustamos las clases para mantener el drawer visible
          isKeyboardOpen && "h-auto max-h-none"
        )}
      >
        <DrawerClose className="sr-only">Cerrar</DrawerClose>
        <div className="pt-4">{sharedContent}</div>
      </DrawerContent>
    </Drawer>
  );
}
