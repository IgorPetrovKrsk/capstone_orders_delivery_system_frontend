import DispatcherNav from "../../components/nav/DispatcherNav";
import styles from './dashboard.module.css'

export default function DispatcherDashBoardOrders() {
    return (
        <>
            <DispatcherNav />
            <div className={styles.divMain}>
                <h1>Orders</h1>
            </div>
        </>
    )
}