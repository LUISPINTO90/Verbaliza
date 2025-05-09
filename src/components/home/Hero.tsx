"use client";

import { Button } from "@/components/ui/button";
import AuthDialog from "@/components/auth/AuthDialog";

export default function Hero() {
  return (
    <div className="w-full py-4 md:py-6 lg:py-8">
      <div className="container px-3 md:px-6 mx-auto">
        <div className="flex flex-col items-center mx-auto max-w-2xl">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4 md:mb-5 lg:mb-6 transition-all w-full text-left">
            <div className="flex flex-col">
              <span className="text-neutral-800 drop-shadow-md">
                <span className="bg-gradient-to-b from-neutral-500 to-neutral-800 bg-clip-text text-transparent">
                  Escribe
                </span>
              </span>
              <span className="text-neutral-600 drop-shadow-md">
                <span className="bg-gradient-to-b from-neutral-400 to-neutral-600 bg-clip-text text-transparent">
                  lo que piensas.
                </span>
              </span>
            </div>
            <div className="flex flex-col mt-1 md:mt-2">
              <span className="text-neutral-800 drop-shadow-md">
                <span className="bg-gradient-to-b from-neutral-500 to-neutral-800 bg-clip-text text-transparent">
                  Lee
                </span>
              </span>
              <span className="text-neutral-600 drop-shadow-md">
                <span className="bg-gradient-to-b from-neutral-400 to-neutral-600 bg-clip-text text-transparent">
                  lo que te inspira.
                </span>
              </span>
            </div>
          </h1>

          <p className="pb-4 pt-3 text-lg md:text-xl lg:text-2xl mb-4 md:mb-6 w-full text-left transition-all bg-gradient-to-b from-neutral-600 to-neutral-400 bg-clip-text text-transparent drop-shadow-sm">
            Con Verbaliza, lee y escribe contenido para compartir.
          </p>

          <div className="w-full flex justify-center">
            <AuthDialog
              trigger={
                <Button
                  size="lg"
                  className="cursor-pointer bg-neutral-700 text-white hover:bg-neutral-800 transition-all duration-300 ease-in-out transform hover:scale-105 px-6 py-6 text-lg w-full"
                >
                  Empieza ahora
                </Button>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
