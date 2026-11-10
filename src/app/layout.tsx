import type { Metadata } from "next";
import { Fredoka, Nunito } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

// Fredoka (redondeada) para títulos; Nunito para lectura e interfaz.
const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});
const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  icons: {icon:"/huellas.svg"},
  title: {
    default: "HUELLAS — Gestión y apoyo para albergues",
    template: "%s | HUELLAS",
  },
  description:
    "Conecta con albergues, conoce a sus rescatados y acompaña su cuidado con donaciones y apadrinamientos.",
  keywords: [
    "adopción animales",
    "perros en adopción",
    "gatos en adopción",
    "Chiclayo",
    "Lambayeque",
    "Perú",
  ],
  openGraph: {
    siteName: "HUELLAS",
    locale: "es_PE",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${fredoka.variable} ${nunito.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider>
          {process.env.NEXT_PUBLIC_DEMO_MODE === "true" && (
            <div className="bg-warning-bg px-4 py-2 text-center text-xs text-warning-fg">
              DEMO LOCAL · Datos ficticios · No se realizan cobros ni
              transferencias
            </div>
          )}
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
