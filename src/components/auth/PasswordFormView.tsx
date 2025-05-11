"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";
import { DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormData, loginSchema } from "@/lib/validations";
import { useState } from "react";
import { loginWithCredentials } from "@/app/actions/auth";
import { signIn } from "next-auth/react";

interface PasswordFormViewProps {
  onBack: () => void;
  onContinue: () => void;
  onRegister: () => void;
  direction: "forward" | "backward";
  email: string;
}

export default function PasswordFormView({
  onBack,
  onContinue,
  onRegister,
  direction,
  email,
}: PasswordFormViewProps) {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: email,
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError("");

    try {
      // Validar credenciales en el servidor
      const result = await loginWithCredentials({
        email: data.email,
        password: data.password,
      });

      if (result.error) {
        if (result.error === "google-account") {
          setError(
            "Ya existe una cuenta con este correo asociada a Google. Inicia sesión con Google"
          );
          setIsLoading(false);
          return;
        } else {
          setError("Credenciales inválidas");
          setIsLoading(false);
          return;
        }
      }

      // Iniciar sesión con next-auth/react
      try {
        const signInResult = await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        });

        if (signInResult?.error) {
          console.error(
            "Error durante el inicio de sesión:",
            signInResult.error
          );
          setError("Error al iniciar sesión. Verifica tus credenciales.");
          setIsLoading(false);
          return;
        }

        // Cerrar modal y recargar la página
        onContinue();

        // Usar redirección directa
        window.location.href = "/";
      } catch (signInError) {
        console.error("Error durante signIn:", signInError);
        setError("Error al procesar la solicitud de inicio de sesión");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error general en inicio de sesión:", error);
      setError("Error al iniciar sesión");
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
          Ingresa tu contraseña
        </DialogTitle>
      </div>

      <DialogDescription className="text-neutral-700 mb-6">
        Ingresa tu contraseña para acceder a tu cuenta.
      </DialogDescription>

      <form onSubmit={handleSubmit(onSubmit)}>
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
            {...register("password")}
            placeholder="••••••••"
            className="w-full py-6 rounded-md border-neutral-300 focus:border-neutral-700 focus:ring-0 focus-visible:border-neutral-700 focus-visible:ring-0"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">
              {errors.password.message}
            </p>
          )}
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>

        <Button
          type="submit"
          className="w-full bg-neutral-700 text-white hover:bg-neutral-800 py-6 cursor-pointer"
          disabled={isLoading}
        >
          {isLoading ? "Cargando..." : "Iniciar sesión"}
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
