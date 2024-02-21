import { Outfit, Montserrat } from "next/font/google";
import Script from "next/script";
import { ToastContainer } from "react-toastify";
import WhatsappFloatingButton from "../components/WhatsappFloatingButton/WhatsappFloatingButton";
import Footer from "../components/footer/Footer";
import Navbar from "../components/navbar/Navbar";
import { ReduxProvider } from "../redux/provider";
import Providers from "../utils/provider";
import "./global.css";

export const metadata = {
  title: "MedX",
  description: "",
};

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "600", "500", "700", "900"],
  variable: "--font-outfit",
});
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "600", "500", "700", "900"],
  variable: "--font-montserrat",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body className="font-outfit relative">
      
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-PNFH8YYRH"
        />
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-PNFH8YYRHV')
           `}
        </Script>

        <Script src="https://jsfiddle.net/fhpL678w/1/" defer />

        <ReduxProvider>
          <Providers>
            <Navbar />
            {children}
            <WhatsappFloatingButton />
            <Footer />
          </Providers>
        </ReduxProvider>
        <ToastContainer />
      </body>
    </html>
  );
}
