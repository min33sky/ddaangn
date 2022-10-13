import React from 'react';
import Footer from '../base/Footer';
import FullHeightPage from '../system/FullHeightPage';

interface Props {
  children: React.ReactNode;
  header?: React.ReactNode; // TODO: Mobile, Desktop Header
}

export default function TabLayout({ header, children }: Props) {
  return (
    <FullHeightPage>
      <header>헤더 자리</header>

      <main className="flex flex-1 flex-col overflow-y-scroll pt-4 pl-4 pr-4">
        {children}
      </main>

      <Footer />
    </FullHeightPage>
  );
}
