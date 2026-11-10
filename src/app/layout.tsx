import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

// Inter para toda la interfaz; Lora solo para palabras editoriales del hero.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});
const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  style: ["italic"],
  weight: ["500"],
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
      className={`${inter.variable} ${lora.variable} h-full antialiased`}
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
