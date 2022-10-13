/**
 * Footer component
 * @summary Viewport Width가 500px 미만에서만 보임
 */
export default function Footer() {
  return (
    <footer className="flex h-14 border-t border-gray-400 xs:hidden">
      <div>Item1</div>
      <div>Item2</div>
      <div>Item3</div>
      <div>Item4</div>
      <div>Item5</div>
      {/* <FooterTapItem icon="home" to="/" />
      <FooterTapItem icon="search" to="/search" />
      <FooterTapItem icon="plus" to="/write" />
      <FooterTapItem icon="bookmark" to="/bookmarks" />
      <FooterTapItem icon="setting" to="/setting" /> */}
    </footer>
  );
}
