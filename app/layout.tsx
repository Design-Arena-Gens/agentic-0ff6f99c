import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Agentic Social Manager',
  description: 'Automate content generation, scheduling and engagement across platforms'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b bg-white">
          <div className="container-max flex items-center justify-between py-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-brand-600" />
              <span className="font-semibold">Agentic Social Manager</span>
            </Link>
            <nav className="flex items-center gap-4 text-sm">
              <Link href="/dashboard" className="text-slate-600 hover:text-slate-900">
                Dashboard
              </Link>
              <a
                href="https://vercel.com"
                target="_blank"
                rel="noreferrer"
                className="text-slate-600 hover:text-slate-900"
              >
                Deploy
              </a>
            </nav>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}

