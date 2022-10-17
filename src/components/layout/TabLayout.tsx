import React from 'react';
import Footer from '../base/Footer';
import MobileHeader from '../base/MobileHeader';
import FullHeightPage from '../system/FullHeightPage';

interface Props {
  children: React.ReactNode;
  header?: React.ReactNode; // TODO: Mobile, Desktop Header
}

/**
 * TabLayout
 * @summary 모바일 화면에서 하단에 탭을 보여주는 레이아웃
 * @param header
 */
export default function TabLayout({ header, children }: Props) {
  return (
    <FullHeightPage>
      {header ?? <MobileHeader />}

      <main className="flex flex-1 flex-col overflow-y-scroll pt-4 pl-4 pr-4">
        {children}
      </main>

      <Footer />
    </FullHeightPage>
  );
}
