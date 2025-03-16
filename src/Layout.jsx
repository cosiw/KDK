import styles from './layout.module.css';

const Layout = ({children}) => {
    return <div className={styles.mainLayout}>{children}</div>;
};

export default Layout;