import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { SocketProvider } from "@/context/SocketContext";

export const metadata: Metadata = {
  title: "ChillZone",
  description: "Realtime chat, minus the clutter.",
};

const noFlashScript = `(function () {
  var t = localStorage.getItem('theme');
  if (t !== 'light') document.documentElement.classList.add('dark');
})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFlashScript }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        <div id="root">
          <AppProvider>
            <SocketProvider>{children}</SocketProvider>
          </AppProvider>
        </div>
      </body>
    </html>
  );
}
