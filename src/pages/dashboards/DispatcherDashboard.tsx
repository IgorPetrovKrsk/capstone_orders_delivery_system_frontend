import { useEffect, useState } from "react";
import DispatcherNav from "../../components/Nav/DispatcherNav";
import styles from './dashboard.module.css'
import type { Truck } from "../../interfaces/TruckInterface";
import type { Order } from "../../interfaces/OrderInterface";
import { useAuth } from "../../context/authContext/authContext";
import api from "../../api";
import DispatcherTruckItem from "../../components/DispatcherTrucksOrders/DispatcherTruckItem";

export default function DispatcherDashBoard() {

    const { cookies } = useAuth();
    const [trucks, setTrucks] = useState<Truck[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [updateTrucksOrders, setUpdateTrucksOrders] = useState(false)

    useEffect(() => {
        async function getTrucksOrders() {
            try {
                const [resTrucks, resOrders] = await Promise.all([
                    api.get(`/trucks/available`, { headers: { token: cookies.token } }), //getting only available trucks
                    api.get(`/orders/pendingassignedorders`, { headers: { token: cookies.token } }) //getting all pending and assigned orders
                ]);
                setOrders(resOrders.data);
                setTrucks(resTrucks.data);
            } catch (err) {
                console.error(err);
            }
        }
        getTrucksOrders();
    }, [updateTrucksOrders])

    function displayTrucks() {
        return trucks?.map(truck => {

            return <DispatcherTruckItem
                truckItem={truck}
                truckOrders={orders?.filter(order => order.truck?._id == truck._id)}
                setUpdateTrucksOrders={setUpdateTrucksOrders}
                key={truck._id}
            />
        })
    }

    return (
        <>
            <DispatcherNav />
            <div className={styles.divMain}>
                <div className={`${styles.divTrucks} ${styles.resizable}`}>
                    Trucks
                    {!trucks?.length ? <h2>Loading...</h2> : displayTrucks()}

                </div>
                <div className={`${styles.divTrucks} ${styles.resizable}`}>
                    Orders
                </div>
                <div className={`${styles.divTrucks} ${styles.resizable}`}>
                    Map
                </div>

            </div>
        </>
    )
}