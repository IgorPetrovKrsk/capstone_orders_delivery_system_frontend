import type { Truck } from "../../interfaces/TruckInterface";
import styles from './dispatcherTruckItem.module.css'
import { useState } from "react";
import type { Order } from "../../interfaces/OrderInterface";


interface OrdersItemProps {
    orderItem: Order;
    setUpdateTrucksOrders: React.Dispatch<React.SetStateAction<boolean>>
}



export default function DispatcherOrderItem({ orderItem, setUpdateTrucksOrders }: OrdersItemProps) {
    
    const [expand, setExpand] = useState(false);
    
    return (
        <>
            <div className={styles.divOrder}>
                <button onClick={() => { setExpand(s => !s) }}>{!expand ? '⇓' : '⇑'}</button>
                Dest: {orderItem.destination} &nbsp;
                W: {orderItem.weight}
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