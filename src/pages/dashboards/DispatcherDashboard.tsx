import DispatcherNav from "../../components/Nav/DispatcherNav";
import styles from './dashboard.module.css'

export default function DispatcherDashBoard() {
    return (
        <>
            <DispatcherNav />
             <div className={styles.divMain}>
                <h1>Dispatcher Dashboard</h1>
            </div>
        </>
    )
}