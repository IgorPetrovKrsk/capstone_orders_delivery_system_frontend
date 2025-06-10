import type { Truck } from "../../interfaces/TruckInterface";
import styles from './dispatcherTruckItem.module.css'
import { useState } from "react";
import type { Order } from "../../interfaces/OrderInterface";
import openEye from '../../assets/Open_eye.png'
import closedEye from '../../assets/Closed_eye.png'


interface OrdersItemProps {
    orderItem: Order;
    onDragStart: (event: React.DragEvent<HTMLDivElement>) => void;
}


export default function DispatcherOrderItem({ orderItem, onDragStart }: OrdersItemProps) {
    const [show, setShow] = useState(false);
    const [expand, setExpand] = useState(false);

    return (
        <>
            <div className={styles.divOrder} draggable='true' onDragStart={onDragStart}>
                <div className={styles.divOrderMain}>
                    <button onClick={() => { setExpand(s => !s) }}>{!expand ? '⇓' : '⇑'}</button>
                    Dest: {orderItem.destination} &nbsp;
                    W: {orderItem.weight}
                    <button className={styles.btnEye} onClick={() => { setShow(c => !c) }}>
                        <img className={styles.imgEye} src={show ? openEye : closedEye} alt="" />
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