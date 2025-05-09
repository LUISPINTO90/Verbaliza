import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <nav className="w-full border-b border-gray-100 bg-white">
      <div className="container mx-auto flex h-16 items-center px-4 sm:px-6 lg:px-8">
        <div className="w-full flex justify-center sm:justify-start items-center">
          <Link
            href="/"
            className="flex items-center transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            <Image
              src="/logo.png"
              alt="Logo"
              width={140}
              height={40}
              className="h-6 w-auto object-contain"
              priority
              quality={100}
            />
          </Link>

          <div className="hidden sm:flex items-center ml-auto">
            <Button
              variant="outline"
              size="lg"
              className="text-neutral-700 border-neutral-300 hover:bg-neutral-100 hover:border-neutral-400 transition-all duration-300 ease-in-out transform hover:scale-105 mr-3 cursor-pointer"
            >
              Iniciar sesión
            </Button>
            <Button
              size="lg"
              className="bg-neutral-700 text-white hover:bg-neutral-800 transition-all duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
            >
              Regístrate
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
