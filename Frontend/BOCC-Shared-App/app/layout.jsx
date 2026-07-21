import { Inter, Poppins } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { ThemeProvider } from '@/components/ui/ThemeProvider';

/**
 * Inter loaded via next/font/google — self-hosted by Next.js, zero extra
 * network request, no layout shift. The `variable` option injects a CSS
 * custom property (--font-inter) onto the <html> element, which globals.css
 * then references inside @theme: `--font-sans: var(--font-inter), system-ui, sans-serif`.
 */
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata = {
  title: 'BOCC — Business Orbit Campus Clubs',
  description: 'Turn a student startup idea into a working business, guided step by step by mentors, incubators, and investors.',
};

/**
 * Inline theme-initialization script injected into <head> BEFORE paint.
 * Reads localStorage then system preference to add .dark on <html> when
 * appropriate — prevents the white flash on dark-mode preference.
 * Must be a plain string (no module scope) so it runs synchronously.
 */
const themeScript = `(function(){
  try {
    var s = localStorage.getItem('theme');
    var q = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (s === 'dark' || (!s && q)) document.documentElement.classList.add('dark');
  } catch (_) {}
  })();`;

export default function RootLayout({ children }) {
  return (
    /**
     * suppressHydrationWarning: The inline themeScript may add/remove .dark
     * on <html> before React hydrates. Without this, React would warn about
     * the class mismatch between server HTML and client DOM.
     */
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${poppins.variable}`}>
      <head>
        {/* Next.js built-in Script component with strategy="beforeInteractive"
            runs synchronously before paint/hydration in <head> without triggering
            React 19 inline script warnings. */}
        <Script id="theme-init" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body><ThemeProvider>{children}</ThemeProvider></body>
    </html>
  );
}
