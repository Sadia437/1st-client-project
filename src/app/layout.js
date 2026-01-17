import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  
  title: "Electric Doctor's | 24/7 National Dispatch",
  description: "Immediate electrical repair services. Licensed electricians available 24/7 in major US cities.",
  
  
  icons: {
    icon: "/images/1000010398.png",
    shortcut: "/images/1000010398.png",
    apple: "/images/1000010398.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}