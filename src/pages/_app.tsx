import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { AuthProvider } from "../contexts/AuthContext";
import { Rubik } from "next/font/google";

// Load Rubik font
const rubik = Rubik({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      {/* Apply font globally by wrapping inside a div */}
      <main className={rubik.className}>
        <Component {...pageProps} />
      </main>
    </AuthProvider>
  );
}
