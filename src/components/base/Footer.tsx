import FooterTabItem from './FooterTabItem';

/**
 * Footer component
 * @summary Viewport Width가 500px 미만에서만 보임
 */
export default function Footer() {
  return (
    <nav
      aria-label="footer_tab_nav"
      className="flex h-14 border-t border-gray-400 xs:hidden"
    >
      <FooterTabItem icon="home" to="/" title="홈" />
      <FooterTabItem icon="community" to="/community" title="동네생활" />
      <FooterTabItem icon="live" to="/live" title="라이브" />
      <FooterTabItem icon="chat" to="/chats" title="채팅" />
      <FooterTabItem icon="me" to="/profile" title="나의 당근" />
    </nav>
  );
}
