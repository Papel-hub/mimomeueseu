import type { Metadata } from "next";
import localFont from "next/font/local";
import "./../styles/globals.css";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from '@/contexts/AuthContext';

const circularStd = localFont({
  src: [
    { path: "../fonts/Circular-Std-Book.ttf", weight: "400", style: "normal" },
    { path: "../fonts/Circular-Std-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-circular",
  display: "swap",
});

// ⚠️ Remova os espaços extras na URL!
const siteUrl = "https://mimomeueseu.com";

export const metadata: Metadata = {
  title: "Mimo Meu e Seu | Cestas e Cartões de Presente Personalizados",
  description:
    "Crie listas de presentes e cartões personalizados para surpreender quem você ama. Compartilhe carinho, memórias e momentos especiais de forma única.",
  authors: [{ name: "Marco Morais" }],
  keywords: [
    "presentes personalizados",
    "listas de presentes",
    "cartões de presente",
    "romance",
    "família",
    "amizade",
    "surpresas",
    "mimos criativos",
  ],
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: "Mimo Meu e Seu | Presentes que criam memórias inesquecíveis",
    description:
      "Transforme seus gestos de carinho em lembranças inesquecíveis. Crie, compartilhe e celebre com o Mimo Meu e Seu.",
    url: siteUrl,
    siteName: "Mimo Meu e Seu",
    locale: "pt_BR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={circularStd.variable}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-200">
        {/* Theme color via <meta> — permitido no body ou head implícito */}
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#ffffff" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#111827" />
        <meta name="color-scheme" content="light dark" />

        <AuthProvider> 
          <CartProvider>
            <div className="relative z-10">{children}</div>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}