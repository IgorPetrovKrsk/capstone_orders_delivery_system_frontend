import { Link, useLocation } from "react-router-dom";
import styles from './nav.module.css'
import LogoutButton from "./LogoutButton";

export default function DispatcherNav() {
    const location = useLocation();
    return (
        <div className={styles.divNavigation}>
            <img className={styles.img}src="src\assets\Comrade Codich Trucks.png" alt="Comrade Codich Trucks logo" />
            <Link to="/dispatcherdashboard" className={location.pathname === "/dispatcherdashboard" ? styles.active : ""}>Dashboard</Link>
            <Link to="/trucks" className={location.pathname === "/trucks" ? styles.active : ""}>Trucks</Link>
            <Link to="/orders" className={location.pathname === "/orders" ? styles.active : ""}>Orders</Link>
            <LogoutButton />
        </div>
    );
}