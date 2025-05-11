"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";
import { DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { checkEmail } from "@/app/actions/auth";

// Esquema sólo para el correo
const emailSchema = z.object({
  email: z.string().email("Correo electrónico inválido"),
});

type EmailFormData = z.infer<typeof emailSchema>;

interface EmailFormViewProps {
  onBack: () => void;
  onContinue: (email: string) => void;
  onRegister: () => void;
  direction: "forward" | "backward";
}

export default function EmailFormView({
  onBack,
  onContinue,
  onRegister,
  direction,
}: EmailFormViewProps) {
  const [emailError, setEmailError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: EmailFormData) => {
    setIsLoading(true);
    setEmailError("");

    try {
      // Comprobar si el correo existe
      const result = await checkEmail(data.email);

      if (result.error) {
        setEmailError("Error al verificar el correo");
        return;
      }

      if (result.exists && result.provider === "google") {
        setEmailError(
          "Ya existe una cuenta con este correo asociada a Google. Inicia sesión con Google"
        );
        return;
      }

      // Continuar al siguiente paso
      onContinue(data.email);
    } catch {
      setEmailError("Error al verificar el correo");
    } finally {
      setIsLoading(false);
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
          Ingresa tu correo
        </DialogTitle>
      </div>

      <DialogDescription className="text-neutral-700 mb-6">
        Ingresa tu correo electrónico para continuar.
      </DialogDescription>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-6">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-neutral-700 mb-2"
          >
            Correo electrónico
          </label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            placeholder="tucorreo@ejemplo.com"
            className="w-full py-6 rounded-md border-neutral-300 focus:border-neutral-700 focus:ring-0 focus-visible:border-neutral-700 focus-visible:ring-0"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
          {emailError && (
            <p className="mt-1 text-sm text-red-600">{emailError}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full bg-neutral-700 text-white hover:bg-neutral-800 py-6 cursor-pointer"
          disabled={isLoading}
        >
          {isLoading ? "Verificando..." : "Continuar"}
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
