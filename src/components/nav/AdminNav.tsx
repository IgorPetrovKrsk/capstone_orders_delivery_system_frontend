import { Link, useLocation } from "react-router-dom";
import styles from './nav.module.css'
import LogoutButton from "./LogoutButton";

export default function AdminNav() {
    const location = useLocation();
    return (
        <div className={styles.divNavigation}>
            <img className={styles.img}src="src\assets\Comrade Codich Trucks.png" alt="Comrade Codich Trucks logo" />
            <Link to="/admindashboard" className={location.pathname === "/admindashboard" ? styles.active : ""}>Users</Link>           
            <LogoutButton />
        </div>
    );
}