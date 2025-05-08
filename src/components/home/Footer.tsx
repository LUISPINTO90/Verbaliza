import Image from "next/image";
import Link from "next/link";
import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="container mx-auto w-full p-4 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center">
            <Button
              variant="outline"
              size="icon"
              asChild
              className="h-auto hover:bg-transparent"
            >
              <Image
                src="/logo-small.png"
                alt="Logo"
                width={32}
                height={32}
                className="h-8 w-auto p-2"
                priority
              />
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <span className="text-sm text-neutral-500">
              © {new Date().getFullYear()} Todos los derechos reservados.
            </span>

            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="h-8 w-8 text-neutral-500 hover:text-neutral-800 hover:bg-transparent"
              >
                <Link
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github size={18} />
                  <span className="sr-only">GitHub profile</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
