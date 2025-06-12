import { Link, useLocation } from "react-router-dom";
import styles from './nav.module.css'
import LogoutButton from "./LogoutButton";
import comradeCodichTrucksLogo from '../../assets/Comrade Codich Trucks.png';

export default function DispatcherNav() {
    const location = useLocation();
    return (
        <div className={styles.divNavigation}>
            <img className={styles.img}src={comradeCodichTrucksLogo} alt="Comrade Codich Trucks logo" />
            <Link to="/dispatcherdashboard" className={location.pathname === "/dispatcherdashboard" ? styles.active : ""}>Dashboard</Link>
            <Link to="/dispatcherdashboard/trucks" className={location.pathname === "/dispatcherdashboard/trucks" ? styles.active : ""}>Trucks</Link>
            <Link to="/dispatcherdashboard/orders" className={location.pathname === "/dispatcherdashboard/orders" ? styles.active : ""}>Orders</Link>
            <LogoutButton />
        </div>
    );
}