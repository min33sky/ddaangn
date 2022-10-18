import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';
import DialogProvider from '@/contexts/DialogContext';

import Router from 'next/router';
import NProgress from 'nprogress';
import { Toaster } from 'react-hot-toast';
import getQueryClient from '@/lib/queryClient';
import { Hydrate, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
// import 'nprogress/nprogress.css'; //styles of nprogress

NProgress.configure({ showSpinner: false });

//Route Events.
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

function MyApp({
  Component,
  pageProps: { session, dehydratedState, ...pageProps },
}: AppProps<{
  session: Session;
  dehydratedState: any;
}>) {
  const queryClient = getQueryClient();

  return (
    <>
      <DialogProvider>
        <SessionProvider session={session}>
          <QueryClientProvider client={queryClient}>
            <Hydrate state={dehydratedState}>
              <Component {...pageProps} />
            </Hydrate>
            <Toaster />
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </SessionProvider>
      </DialogProvider>
    </>
  );
}

export default MyApp;
