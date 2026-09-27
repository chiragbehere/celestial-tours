import "./globals.css";
import "./home.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { AuthProvider } from '@/lib/context/AuthContext';
import PWAInstallPrompt from '@/components/ui/PWAInstallPrompt';

export const metadata = {
  title: "CelestialTours | Personalized Dynamic Tour Platform",
  description: "AI-powered personalized dynamic tour planning, constraint-aware optimization, and real-time tour operations management.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Celestial",
  },
};

export const viewport = {
  themeColor: "#4f46e5",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
                  navigator.serviceWorker.getRegistrations().then(function(registrations) {
                    for (var reg of registrations) {
                      reg.unregister();
                    }
                  });
                }
                if (typeof window !== 'undefined' && window.caches) {
                  caches.keys().then(function(names) {
                    for (var name of names) {
                      caches.delete(name);
                    }
                  });
                }
              } catch(e) {}
            `,
          }}
        />
      </head>
      <body>
        <AuthProvider>
          <div className="app-wrapper">
            {children}
          </div>
          <PWAInstallPrompt mode="floating" />
        </AuthProvider>
      </body>
    </html>
  );
}
