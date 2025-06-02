import './globals.css';
import type { Metadata } from 'next';
import SplashScreen from './components/SplashScreen';

export const metadata: Metadata = {
  title: 'Server Active Cron Job Monitor',
  description: 'Monitor your server cron job status',
  icons: {
    icon: '/cron.png',
    shortcut: '/cron.png',
    apple: '/cron.png',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/cron.png" />
      </head>
      <body>
        <SplashScreen />
        {children}
      </body>
    </html>
  )
}
