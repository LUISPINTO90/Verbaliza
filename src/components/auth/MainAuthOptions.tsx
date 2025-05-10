"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { motion } from "framer-motion";
import { DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface MainAuthOptionsProps {
  onEmailClick: () => void;
  direction: "forward" | "backward";
}

export default function MainAuthOptions({
  onEmailClick,
  direction,
}: MainAuthOptionsProps) {
  // Simplificamos las variantes para el componente principal
  const variants = {
    enter: (direction: string) => ({
      x: direction === "backward" ? "-100%" : "100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: string) => ({
      x: direction === "backward" ? "100%" : "-100%",
      opacity: 0,
    }),
  };

  return (
    <motion.div
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="w-full"
    >
      <div className="mb-4">
        <DialogTitle className="text-2xl font-bold">
          Inicia sesión o regístrate en un momento
        </DialogTitle>
      </div>

      <DialogDescription className="text-neutral-700 mb-6">
        Usa tu correo electrónico o cuenta de Google para acceder a Verbaliza.
      </DialogDescription>

      <div className="mt-6">
        {/* Botón de Google */}
        <Button
          variant="outline"
          className="w-full mb-3 py-6 relative cursor-pointer"
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
          className="w-full py-6 relative cursor-pointer"
          onClick={onEmailClick}
        >
          <div className="absolute left-6">
            <Mail size={20} />
          </div>
          <span className="mx-auto">Usar un correo electrónico</span>
        </Button>
      </div>
    </motion.div>
  );
}
