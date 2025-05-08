import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <div className="w-full py-4 md:py-6 lg:py-8">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center text-center mx-auto max-w-4xl">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4 md:mb-5 lg:mb-6 transition-all">
            <div className="flex flex-col">
              <span className="text-neutral-800/90">Escribe</span>
              <span className="text-neutral-600/90">lo que piensas.</span>
            </div>
            <div className="flex flex-col mt-1 md:mt-2">
              <span className="text-neutral-800/90">Lee</span>
              <span className="text-neutral-600/90">lo que te inspira.</span>
            </div>
          </h1>

          <p className="text-lg md:text-xl lg:text-2xl text-neutral-600 mb-4 md:mb-6 max-w-2xl transition-all">
            Con Verbaliza, lee y escribe contenido para compartir.
          </p>

          <Button
            size="lg"
            className="bg-neutral-700 text-white hover:bg-neutral-800 transition-colors px-6 py-3 text-lg"
          >
            Empieza ahora
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
