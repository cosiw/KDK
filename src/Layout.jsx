import styles from './layout.module.css';
import Footer from './components/Footer';
const Layout = ({children}) => {
    return <div className={styles.mainLayout}>
        {children}
        <Footer />
        </div>;
};

export default Layout;