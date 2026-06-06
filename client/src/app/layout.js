import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "KingTech | Câbles & Accessoires Tech Premium",
  description:
    "Découvrez les câbles et accessoires tech de qualité professionnelle. USB-C, HDMI, Lightning, Ethernet, Audio — Performance et durabilité garanties.",
  keywords: "câbles, tech, USB-C, HDMI, Lightning, Ethernet, audio, accessoires, premium",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="page-wrapper">{children}</main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

