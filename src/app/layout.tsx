import type { Metadata } from "next";
import { Nunito, Plus_Jakarta_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

// Títulos: Nunito · Texto: Plus Jakarta Sans (ver globals.css)
const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
});
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
      className={`${nunito.variable} ${jakarta.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider>
          {process.env.NEXT_PUBLIC_DEMO_MODE === "true" && (
            <div className="bg-amber-100 px-4 py-2 text-center text-xs text-amber-950">
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
