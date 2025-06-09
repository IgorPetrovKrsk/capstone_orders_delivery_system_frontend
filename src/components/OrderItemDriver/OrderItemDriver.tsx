import { useState } from "react";
import api from "../../api";
import { useAuth } from "../../context/authContext/authContext";
import type { Order } from "../../interfaces/OrderInterface";
import { useError } from "../../context/globalErrorContext/globalErrorContext";
import styles from './orderItemDriver.module.css'

interface OrderItemProps {
    orderItem: Order;
    setUpdateOrders: React.Dispatch<React.SetStateAction<boolean>>
}

export default function OrderItemDriver({ orderItem, setUpdateOrders }: OrderItemProps) {

    const { showError } = useError();
    const { cookies } = useAuth();
    const [expand, setExpand] = useState(false);

    async function onReturnOrder() {
        const confirmReturn = confirm(`Are you sure you want to return order?`);
        if (confirmReturn) {
            try {
                await api.put(`/orders/return/${orderItem._id}`, { status: 'returned' }, {
                    headers: { 'token': cookies.token }
                });
                setUpdateOrders(state => !state)
            } catch (err) {
                console.error(err);
            }
        }
    }

    async function onDeliverOrder() {
        const confirmReturn = confirm(`Are you sure you want to deliver order?`);
        if (confirmReturn) {
            try {
                await api.put(`/orders/deliver/${orderItem._id}`, { status: 'delivered' }, {
                    headers: { 'token': cookies.token }
                });
                setUpdateOrders(state => !state)
            } catch (err) {
                console.error(err);
            }
        }
    }

    function onDestinationMap() {
        const googleMapsUrl = `https://www.google.com/maps?q=${orderItem.destinationCoordinates.latitude},${orderItem.destinationCoordinates.longitude}`;
        window.open(googleMapsUrl, "_blank");
    }

    return (
        <>
            <div className={styles.order}>
                <button className={styles.button} onClick={() => { setExpand(s => !s) }}>{!expand ? '⇓' : '⇑'}</button>
                <h3 className={styles.orderDestination}>{orderItem.destination}</h3>
                <button className={styles.button} onClick={onReturnOrder}>Return</button>
                <button className={styles.button} onClick={onDeliverOrder}>Deliver</button>
                <button className={styles.button} onClick={onDestinationMap}>→</button>

            </div>
            {expand && <div className={styles.orderExpanded}>
                <h2>ID: {orderItem._id}</h2>
                <h2>Origin: {orderItem.origin} lat: {orderItem.originCoordinates.latitude} lon: {orderItem.originCoordinates.longitude}</h2>
                <h2>Destination: {orderItem.destination} lat: {orderItem.destinationCoordinates.latitude} lon: {orderItem.destinationCoordinates.longitude}</h2>
                <h2>Weight: {orderItem.weight}</h2>
            </div>
            }
        </>
    )
}