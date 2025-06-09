import type { Truck } from "../../interfaces/TruckInterface";
import styles from './dispatcherTruckItem.module.css'
import { useState } from "react";
import type { Order } from "../../interfaces/OrderInterface";


interface TruckItemProps {
    truckItem: Truck;
    truckOrders: Order[];
    onDrop:(event: React.DragEvent<HTMLDivElement> , truck: Truck) => void;
}



export default function DispatcherTruckItem({ truckItem, truckOrders,onDrop }: TruckItemProps) {
    const [expand, setExpand] = useState(false);   
    
    function displayTruckOrders() {
        return truckOrders.map(it => <div className={styles.divOrder}>
            Dest: {it.destination} &nbsp;
            W: {it.weight}
        </div>)
    }

    function onDragOver(ev : React.DragEvent<HTMLDivElement>){
        ev.preventDefault();
    }

    const currentCapacity = truckItem.capacity - truckOrders.reduce((acc, it) => acc+ it.weight,0);

    return (
        <>
            <div className={currentCapacity<0?styles.divOverload:''}  onDragOver={onDragOver} onDrop={(ev)=> onDrop(ev,truckItem)} >
                <button onClick={() => { setExpand(s => !s) }}>{!expand ? '⇓' : '⇑'}</button>
                {truckItem.licensePlate} &nbsp;
                TC: {truckItem.capacity} &nbsp;
                CC: {currentCapacity}
                {expand && displayTruckOrders()}
            </div>

        </>
    )
}