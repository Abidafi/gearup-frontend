import './globals.css';
import Providers from '@/components/Providers'; 
import { Toaster } from 'sonner';

export const metadata = {
  title: 'GearUp',
  description: 'Rent Sports & Outdoor Gear Instantly',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}