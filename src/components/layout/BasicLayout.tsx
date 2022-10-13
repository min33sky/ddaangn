import useGoBack from '@/hooks/useGoBack';
import HeaderBackButton from '../base/HeaderBackButton';
import MobileHeader from '../base/MobileHeader';
import FullHeightPage from '../system/FullHeightPage';

interface Props {
  hasBackButton?: boolean;
  title?: React.ReactNode;
  children?: React.ReactNode;
  headerRight?: React.ReactNode;
  onGoBack?: () => void;
  desktopHeaderVisible?: boolean;
}

export default function BasicLayout({
  hasBackButton,
  title,
  children,
  onGoBack,
  headerRight,
  desktopHeaderVisible = true, //? 로그인, 회원가입 페이지를 제외하고 기본적으로 헤더가 필요함
}: Props) {
  const goBack = useGoBack();

  return (
    <FullHeightPage>
      <MobileHeader
        title={title}
        headerLeft={
          hasBackButton ? (
            <HeaderBackButton onClick={onGoBack ?? goBack} />
          ) : undefined
        }
        headerRight={headerRight}
      />
      {/* {desktopHeaderVisible ? <DesktopHeader /> : null} */}
      <main className="flex flex-1 flex-col overflow-y-scroll">{children}</main>
    </FullHeightPage>
  );
}
