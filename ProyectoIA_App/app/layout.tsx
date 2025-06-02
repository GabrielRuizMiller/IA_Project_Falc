import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./header/page";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ProyectoIA - Cargador de Mamografías",
  description: "Clasificador de imágenes PGM con IA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-gradient-to-b from-white to-sky-100 min-h-screen`}>
        <Header />
        <main className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
          {children}
        </main>
      </body>
    </html>
  );
}
