"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";
import { DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterFormData, registerSchema } from "@/lib/validations";
import { useState } from "react";

interface RegisterFormViewProps {
  onBack: () => void;
  onContinue: (data: RegisterFormData) => void;
  onLogin: () => void;
  direction: "forward" | "backward";
  email?: string;
  error?: string;
  isLoading?: boolean; // Hacer opcional para que coincida con AuthDialog
}

export default function RegisterFormView({
  onBack,
  onContinue,
  onLogin,
  direction,
  email = "",
  error = "",
  isLoading: externalLoading, // Renombrar para evitar confusión con el estado interno
}: RegisterFormViewProps) {
  const [internalLoading, setInternalLoading] = useState(false);

  // No creamos una variable loading separada

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: email,
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setInternalLoading(true);

    try {
      await onContinue(data);
    } catch (err) {
      console.error("Error en el formulario de registro:", err);
    } finally {
      setInternalLoading(false);
    }
  };

  // Variantes de animación
  const variants = {
    enter: (direction: string) => ({
      x: direction === "forward" ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: string) => ({
      x: direction === "forward" ? "-100%" : "100%",
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

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-neutral-700 mb-2"
          >
            Nombre
          </label>
          <Input
            id="name"
            type="text"
            {...register("name")}
            placeholder="Tu nombre"
            className="w-full py-6 rounded-md border-neutral-300 focus:border-neutral-700 focus:ring-0 focus-visible:border-neutral-700 focus-visible:ring-0"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="register-email"
            className="block text-sm font-medium text-neutral-700 mb-2"
          >
            Correo electrónico
          </label>
          <Input
            id="register-email"
            type="email"
            {...register("email")}
            placeholder="tucorreo@ejemplo.com"
            className="w-full py-6 rounded-md border-neutral-300 focus:border-neutral-700 focus:ring-0 focus-visible:border-neutral-700 focus-visible:ring-0"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="register-password"
            className="block text-sm font-medium text-neutral-700 mb-2"
          >
            Contraseña
          </label>
          <Input
            id="register-password"
            type="password"
            {...register("password")}
            placeholder="••••••••"
            className="w-full py-6 rounded-md border-neutral-300 focus:border-neutral-700 focus:ring-0 focus-visible:border-neutral-700 focus-visible:ring-0"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">
              {errors.password.message}
            </p>
          )}
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
            {...register("confirmPassword")}
            placeholder="••••••••"
            className="w-full py-6 rounded-md border-neutral-300 focus:border-neutral-700 focus:ring-0 focus-visible:border-neutral-700 focus-visible:ring-0"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">
              {errors.confirmPassword.message}
            </p>
          )}
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>

        <Button
          type="submit"
          className="w-full bg-neutral-700 text-white hover:bg-neutral-800 py-6 cursor-pointer"
          disabled={
            externalLoading !== undefined ? externalLoading : internalLoading
          }
        >
          {externalLoading !== undefined
            ? externalLoading
              ? "Cargando..."
              : "Crear cuenta"
            : internalLoading
            ? "Cargando..."
            : "Crear cuenta"}
        </Button>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onLogin();
            }}
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
