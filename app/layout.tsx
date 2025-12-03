import '../ui/globals.css';
import type { Metadata } from 'next';
import { localGreatOutdoors } from '../ui/fonts';
import Link from 'next/link';
import Image from 'next/image';
import logoImage from '../public/images/logo.png';
import searchIcon from '../public/images/search-icon.png';
import profileIcon from '../public/images/profile-icon.png';
import Dropdown from '@/ui/components/Dropdown/Dropdown';
import CartIndicator from '../ui/components/CartIndicator/CartIndicator';
import { QueryProvider } from './QueryProvider';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export const metadata: Metadata = {
  title: 0,
  description: 'Created by Surya Consulting for Pluralsight',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={localGreatOutdoors.className}>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <QueryProvider>
          <header>
            <div className="site-header-wrapper">
              <h1>
                <Link href="/">
                  <Image src={logoImage} alt="Bethany's Pie Shop Logo" />
                </Link>
              </h1>
              <Dropdown />
              <div className="header-icons">
                <ul>
                  <li>
                    <Link href="search">
                      <Image src={searchIcon} alt="search icon" />
                    </Link>
                  </li>
                  <li>
                    <Link href="/profile">
                      <Image src={profileIcon} alt="profile icon" />
                    </Link>
                  </li>
                  <li>
                    <CartIndicator />
                  </li>
                </ul>
              </div>
            </div>
          </header>
          <main>{children}</main>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryProvider>
      </body>
    </html>
  );
}
