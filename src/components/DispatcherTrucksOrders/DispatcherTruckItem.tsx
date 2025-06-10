import type { Truck } from "../../interfaces/TruckInterface";
import styles from './dispatcherTruckItem.module.css'
import { useState } from "react";
import type { Order } from "../../interfaces/OrderInterface";


interface TruckItemProps {
    truckItem: Truck;
    truckOrders: Order[];
    onDragStart:(event: React.DragEvent<HTMLDivElement>, order:Order) => void;
    onDropToTrucks:(event: React.DragEvent<HTMLDivElement> , truck: Truck) => void;

}



export default function DispatcherTruckItem({ truckItem, truckOrders,onDragStart,onDropToTrucks }: TruckItemProps) {
    const [expand, setExpand] = useState(false);   
    
    function displayTruckOrders() {
        return truckOrders.map(order => <div className={styles.divOrder} draggable = "true" onDragStart={(ev) =>onDragStart(ev,order)}>
            Dest: {order.destination} &nbsp;
            W: {order.weight}
        </div>)
    }

    function onDragOver(ev : React.DragEvent<HTMLDivElement>){
        ev.preventDefault();
    }

    const currentCapacity = truckItem.capacity - truckOrders.reduce((acc, it) => acc+ it.weight,0);

    return (
        <>
            <div className={currentCapacity<0?styles.divOverload:''}  onDragOver={onDragOver} onDrop={(ev)=> onDropToTrucks(ev,truckItem)} >
                <button onClick={() => { setExpand(s => !s) }}>{!expand ? '⇓' : '⇑'}</button>
                {truckItem.licensePlate} &nbsp;
                TC: {truckItem.capacity} &nbsp;
                CC: {currentCapacity}
                {expand && displayTruckOrders()}
            </div>

        </>
    )
}