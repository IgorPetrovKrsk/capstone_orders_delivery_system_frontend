import { useEffect, useState } from "react";
import DispatcherNav from "../../components/Nav/DispatcherNav";
import styles from './dashboard.module.css'
import type { Truck } from "../../interfaces/TruckInterface";
import type { Order } from "../../interfaces/OrderInterface";
import { useAuth } from "../../context/authContext/authContext";
import api from "../../api";
import DispatcherTruckItem from "../../components/DispatcherTrucksOrders/DispatcherTruckItem";
import DispatcherOrderItem from "../../components/DispatcherTrucksOrders/DispatcherOrderItem";
import GoogleMap from "../../components/Map/GoogleMap";


export default function DispatcherDashBoard() {

    const { cookies } = useAuth();
    const [trucks, setTrucks] = useState<Truck[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [updateTrucksOrders, setUpdateTrucksOrders] = useState(false)
    const [draggingOrder, setDraggingOrder] = useState<Order | null>(null)
    const [ordersToShowRoute, setOrdersToShowRoute] = useState<Order[]>([]);

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
                onDropToTrucks={(ev) => onDropToTrucks(ev, truck)}
                onDragStart={(ev, order) => onDragStart(ev, order)}
                ordersToShowRoute={ordersToShowRoute}
                setOrdersToShowRoute={setOrdersToShowRoute}
                key={truck._id}
            />
        })
    }

    function displayOrders() {
        return orders.filter(it => !it.truck).map(it =>
            <DispatcherOrderItem
                orderItem={it}
                onDragStart={(ev) => onDragStart(ev, it)}
                ordersToShowRoute={ordersToShowRoute}
                setOrdersToShowRoute={setOrdersToShowRoute}
                key={it._id}
            />)
    }

    function onDragStart(ev: React.DragEvent<HTMLDivElement>, it: Order) {
        setDraggingOrder(it);
    }

    async function onDropToTrucks(ev: React.DragEvent<HTMLDivElement>, truck: Truck) {
        ev.preventDefault();
        if (draggingOrder) {
            try {
                await api.put(`/orders/${draggingOrder._id}`,
                    { truck: truck._id },
                    {
                        headers: { token: cookies.token }
                    });
                setDraggingOrder(null);
                setUpdateTrucksOrders(c => !c);
            } catch (err) {
                console.error(err);
            }
        }
    }

    async function onDropToOrders(ev: React.DragEvent<HTMLDivElement>) {
        ev.preventDefault();
        if (draggingOrder) {
            try {
                await api.put(`/orders/${draggingOrder._id}`,
                    { truck: null },
                    {
                        headers: { token: cookies.token }
                    });
                setDraggingOrder(null);
                setUpdateTrucksOrders(c => !c);
            } catch (err) {
                console.error(err);
            }
        }
    }

    function onDragOver(ev: React.DragEvent<HTMLDivElement>) {
        ev.preventDefault();
    }




    return (
        <>
            <DispatcherNav />
            <div className={styles.divMain}>
                <div className={styles.divTrucksOrders}>
                    <div className={`${styles.divTrucks} ${styles.resizable}`}>
                        <h4>Trucks</h4> {!trucks.length ? <h2>Loading...</h2> : displayTrucks()}
                    </div>
                    <div className={`${styles.divOrders} ${styles.resizable}`} onDragOver={onDragOver} onDrop={onDropToOrders} >
                        <h4>Orders</h4>
                        {!orders.length ? <h2>Loading...</h2> : displayOrders()}
                    </div>
                </div>
                <div className={`${styles.divMap} ${styles.resizable}`}>
                    <GoogleMap />
                </div>
            </div>

        </>
    )
}