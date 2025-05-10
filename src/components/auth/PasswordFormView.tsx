"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";
import { DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface PasswordFormViewProps {
  onBack: () => void;
  onContinue: () => void;
  onRegister: () => void;
}

export default function PasswordFormView({
  onBack,
  onContinue,
  onRegister,
}: PasswordFormViewProps) {
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
          Ingresa tu contraseña
        </DialogTitle>
      </div>

      <DialogDescription className="text-neutral-700 mb-6">
        Ingresa tu contraseña para acceder a tu cuenta.
      </DialogDescription>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onContinue();
        }}
      >
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-neutral-700 mb-2"
          >
            Contraseña
          </label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            className="w-full py-6 rounded-md border-neutral-300 focus:border-neutral-700 focus:ring-0 focus-visible:border-neutral-700 focus-visible:ring-0"
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-neutral-700 text-white hover:bg-neutral-800 py-6 cursor-pointer"
        >
          Iniciar sesión
        </Button>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onRegister();
            }}
            className="text-sm text-neutral-600 hover:text-neutral-800 transition-all duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
          >
            ¿No tienes una cuenta?{" "}
            <span className="text-neutral-800 font-medium">Regístrate</span>
          </button>
        </div>
      </form>
    </motion.div>
  );
}
