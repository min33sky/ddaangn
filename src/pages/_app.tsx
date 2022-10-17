import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';
import DialogProvider from '@/contexts/DialogContext';

function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{
  session: Session;
}>) {
  return (
    <>
      <SessionProvider session={session}>
        <DialogProvider>
          <Component {...pageProps} />
        </DialogProvider>
      </SessionProvider>
    </>
  );
}

export default MyApp;
