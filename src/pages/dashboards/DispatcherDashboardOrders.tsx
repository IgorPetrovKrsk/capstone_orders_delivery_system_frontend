import { useEffect, useState } from "react";
import DispatcherNav from "../../components/nav/DispatcherNav";
import { useAuth } from "../../context/authContext/authContext";
import styles from './dashboard.module.css'
import api from "../../api";
import type { Order } from "../../interfaces/OrderInterface";
import OrderItem from "../../components/OrderItem/OrderItem";


export default function DispatcherDashBoardOrders() {
    const { cookies } = useAuth();
    const [orders, setOrders] = useState<Order[] | null>([]);
    const [updateOrders, setUpdateOrders] = useState(false)

    useEffect(() => {
        async function getOrders() {
            try {
                const res = await api.get(`/orders`, {
                    headers: { 'token': cookies.token }
                });
                setOrders(res.data);
            } catch (err) {
                console.error(err);
            }
        }
        getOrders();
    }, [updateOrders])

    const loading = () => {
        return (
            <tbody>
                <tr>
                    <td>loading...</td>
                    <td>loading...</td>
                    <td>loading...</td>
                    <td>loading...</td>
                    <td>loading...</td>
                    <td>loading...</td>
                    <td>loading...</td>
                    <td>loading...</td>
                    <td>loading...</td>
                </tr>
            </tbody>
        )
    }

    const loaded = () => {
        return (
            <tbody>
                {orders?.map((it) => <OrderItem orderItem={it} setUpdateOrders={setUpdateOrders} key={it._id} />)}
                {/* adding another element for the new order */}
                <OrderItem orderItem={{_id:'',weight:0,status:'pending',origin:'',destination:'',originCoordinates:{latitude:0,longitude:0},destinationCoordinates:{latitude:0,longitude:0}}} setUpdateOrders={setUpdateOrders} key={'new order'}/> 
            </tbody>
        )
    }

    return (
        <>
            <DispatcherNav />
            <div className={styles.divMain}>
                <h2>Orders</h2>
                <table className={styles.tableOrders}>
                    <thead >
                        <tr >
                            <th>Origin</th>
                            <th>lat</th>
                            <th>lon</th>
                            <th>Destination</th>
                            <th>lat</th>
                            <th>lon</th>
                            <th>Status</th>
                            <th>Weight</th>
                            <th>Truck</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    {(orders?.length != 0) ? loaded() : loading()}
                </table>
            </div>
        </>
    )
}