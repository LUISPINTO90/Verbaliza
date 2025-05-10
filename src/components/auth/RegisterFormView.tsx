"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";
import { DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface RegisterFormViewProps {
  onBack: () => void;
  onContinue: () => void;
  onLogin: () => void;
}

export default function RegisterFormView({
  onBack,
  onContinue,
  onLogin,
}: RegisterFormViewProps) {
  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "-100%" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="w-full"
    >
      <div className="flex items-center mb-4">
        <button
          onClick={onBack}
          className="text-neutral-800 hover:text-neutral-600 transition-colors"
          aria-label="Volver atrás"
        >
          <ChevronLeft size={20} strokeWidth={2} className="cursor-pointer" />
        </button>

        <DialogTitle className="text-2xl font-bold ml-2">
          Regístrate
        </DialogTitle>
      </div>

      <DialogDescription className="text-neutral-700 mb-6">
        Crea una nueva cuenta para acceder a todas las funciones.
      </DialogDescription>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onContinue();
        }}
      >
        <div className="mb-6">
          <label
            htmlFor="register-email"
            className="block text-sm font-medium text-neutral-700 mb-2"
          >
            Correo electrónico
          </label>
          <Input
            id="register-email"
            type="email"
            placeholder="tucorreo@ejemplo.com"
            className="w-full py-6 rounded-md border-neutral-300 focus:border-neutral-700 focus:ring-0 focus-visible:border-neutral-700 focus-visible:ring-0"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="register-password"
            className="block text-sm font-medium text-neutral-700 mb-2"
          >
            Contraseña
          </label>
          <Input
            id="register-password"
            type="password"
            placeholder="••••••••"
            className="w-full py-6 rounded-md border-neutral-300 focus:border-neutral-700 focus:ring-0 focus-visible:border-neutral-700 focus-visible:ring-0"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="confirm-password"
            className="block text-sm font-medium text-neutral-700 mb-2"
          >
            Confirma tu contraseña
          </label>
          <Input
            id="confirm-password"
            type="password"
            placeholder="••••••••"
            className="w-full py-6 rounded-md border-neutral-300 focus:border-neutral-700 focus:ring-0 focus-visible:border-neutral-700 focus-visible:ring-0"
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-neutral-700 text-white hover:bg-neutral-800 py-6 cursor-pointer"
        >
          Crear cuenta
        </Button>

        <div className="mt-6 text-center">
          <button
            onClick={onLogin}
            className="text-sm text-neutral-600 hover:text-neutral-800 transition-all duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
          >
            ¿Ya tienes una cuenta?{" "}
            <span className="text-neutral-800 font-medium">Inicia sesión</span>
          </button>
        </div>
      </form>
    </motion.div>
  );
}
