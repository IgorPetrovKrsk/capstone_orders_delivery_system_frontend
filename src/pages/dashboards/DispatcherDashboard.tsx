import DispatcherNav from "../../components/Nav/DispatcherNav";
import styles from './dashboard.module.css'

export default function DispatcherDashBoard() {
    return (
        <>
            <DispatcherNav />
             <div className={styles.divMain}>
                <div className={`${styles.divTrucks} ${styles.resizable}`}>Trucks</div>
                <div className={`${styles.divTrucks} ${styles.resizable}`}>Orders</div>
                <div className={`${styles.divTrucks} ${styles.resizable}`}>Map</div>     

            </div>
        </>
    )
}