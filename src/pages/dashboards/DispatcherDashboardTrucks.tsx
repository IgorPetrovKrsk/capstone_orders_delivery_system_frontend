import DispatcherNav from "../../components/nav/DispatcherNav";
import styles from './dashboard.module.css'

export default function DispatcherDashBoardTrucks() {
    return (
        <>
            <DispatcherNav />
            <div className={styles.divMain}>
                <h1>Trucks</h1>
            </div>
        </>
    )
}