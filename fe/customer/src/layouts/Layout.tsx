import AuthModal from "../components/AuthModal";
import ChatBox from "../components/ChatBox";
import Footer from "../components/Footer";
import Header from "../components/Header";
import styles from "../styles/layouts/layout.module.scss";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className={styles["wrapper-layout"]}>
      <header className={styles.header}>
        <Header />
      </header>
      <main className={`${styles["main-content"]}`}>{children}</main>
      <footer className={`${styles.footer} ${styles.center}`}>
        <Footer />
      </footer>
      {/* AuthModal */}
      <AuthModal />
      {/* Chat Box */}
      <ChatBox />
    </div>
  );
};

export default Layout;
