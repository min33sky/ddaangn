import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';
import DialogProvider from '@/contexts/DialogContext';

import Router from 'next/router';
import NProgress from 'nprogress';
// import 'nprogress/nprogress.css'; //styles of nprogress

NProgress.configure({ showSpinner: false });

//Route Events.
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

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
