import styles from './dispatcherTruckItem.module.css'
import { useState } from "react";
import type { Order } from "../../interfaces/OrderInterface";
import openEye from '../../assets/Open_eye.png'
import closedEye from '../../assets/Closed_eye.png'


interface OrdersItemProps {
    orderItem: Order;
    onDragStart: (event: React.DragEvent<HTMLDivElement>) => void;
    ordersToShowRoute: Order[];
    setOrdersToShowRoute: React.Dispatch<React.SetStateAction<Order[]>>
}


export default function DispatcherOrderItem({ orderItem, onDragStart, ordersToShowRoute, setOrdersToShowRoute }: OrdersItemProps) {
    const [expand, setExpand] = useState(false);

    function toggleOrdersToShow() {
        setOrdersToShowRoute(prevOrders => {
            if (prevOrders.find(order => order == orderItem)) {
                return prevOrders.filter(order => order != orderItem);
            } else {
                return [...prevOrders, orderItem];
            }
        });
    }
    return (
        <>
            <div className={styles.divOrder} draggable='true' onDragStart={onDragStart}>
                <div className={styles.divOrderMain}>
                    <button onClick={() => { setExpand(s => !s) }}>{!expand ? '⇓' : '⇑'}</button>
                    Dest: {orderItem.destination} &nbsp;
                    W: {orderItem.weight}
                    <button className={styles.btnEye} onClick={toggleOrdersToShow}>
                        <img className={styles.imgEye} src={ordersToShowRoute.find(it => it == orderItem) ? closedEye : openEye} alt="" />
                    </button>
                </div>
                {expand && <div className={styles.divOrderExpanded}>
                    Lat: {orderItem.destinationCoordinates.latitude} Lon: {orderItem.destinationCoordinates.longitude}
                    <br />
                    Org: {orderItem.origin}
                    <br />
                    Lat: {orderItem.originCoordinates.latitude} Lon: {orderItem.originCoordinates.longitude}
                    <br />
                    Weight: {orderItem.weight}
                </div>}

            </div>


        </>
    )
}