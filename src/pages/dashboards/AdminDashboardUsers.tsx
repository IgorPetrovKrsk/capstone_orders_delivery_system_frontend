import AdminNav from "../../components/nav/AdminNav"
import styles from './dashboard.module.css'

export default function AdminDashBoardUsers() {
    return (
        <>
            <AdminNav />
            <div className={styles.divMain}>
                <h2>Users</h2>
                <table className={styles.tableUsers}>
                    <thead >
                        <tr >
                            <th >img</th>
                            <th>Username</th>
                            <th>Role</th>
                            <th>Truck</th>
                            <th>Active</th>
                            <th></th> 
                            <th></th>
                        </tr>
                    </thead>
                </table>
            </div>
        </>
    )
}