import { Link, useLocation } from "react-router-dom";
import styles from './nav.module.css'
import LogoutButton from "./LogoutButton";
import comradeCodichTrucksLogo from '../../assets/Comrade Codich Trucks.png';

export default function DriverNav() {
    const location = useLocation();    
    return (
        <div className={styles.divNavigation}>
            <img className={styles.img}src={comradeCodichTrucksLogo} alt="Comrade Codich Trucks logo" />
            <Link to="/driverdashboard/orders" className={location.pathname === "/driverdashboard/orders" ? styles.active : ""}>Current orders</Link>           
            <LogoutButton />
        </div>
    );
}