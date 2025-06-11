import type { Truck } from "../../interfaces/TruckInterface";
import styles from './dispatcherTruckItem.module.css'
import { useState } from "react";
import type { Order } from "../../interfaces/OrderInterface";
import openEye from '../../assets/Open_eye.png'
import closedEye from '../../assets/Closed_eye.png'


interface TruckItemProps {
    truckItem: Truck;
    truckOrders: Order[];
    onDragStart: (event: React.DragEvent<HTMLDivElement>, order: Order) => void;
    onDropToTrucks: (event: React.DragEvent<HTMLDivElement>, truck: Truck) => void;
    ordersToShowRoute: Order[];
    setOrdersToShowRoute: React.Dispatch<React.SetStateAction<Order[]>>
}



export default function DispatcherTruckItem({ truckItem, truckOrders, onDragStart, onDropToTrucks, ordersToShowRoute, setOrdersToShowRoute }: TruckItemProps) {
    const [expand, setExpand] = useState(false);
    const [message, setMessage] = useState('')

    function onChangeMessage(ev: React.ChangeEvent<HTMLInputElement>) {
        setMessage(ev.target.value);
    }

    function toggleOrdersToShow(newOrder: Order) {
        setOrdersToShowRoute(prevOrders => {
            if (prevOrders.find(order => order == newOrder)) {
                return prevOrders.filter(order => order != newOrder);
            } else {
                return [...prevOrders, newOrder];
            }
        });
    }

    function displayTruckOrders() {
        return truckOrders.map(order => <>
            <div className={styles.divTruckOrder} draggable="true" onDragStart={(ev) => onDragStart(ev, order)} key={order._id}>
                Dest: {order.destination} &nbsp;
                W: {order.weight}
                <button className={styles.btnEye} onClick={() => toggleOrdersToShow(order)}>
                    <img className={styles.imgEye} src={ordersToShowRoute.find(it => it == order) ? closedEye : openEye} alt="" />
                </button>
            </div>
        </>)
    }

    function onDragOver(ev: React.DragEvent<HTMLDivElement>) {
        ev.preventDefault();
    }

    const currentCapacity = truckItem.capacity - truckOrders.reduce((acc, it) => acc + it.weight, 0);

    return (
        <>
            <div className={currentCapacity < 0 ? styles.divOverload : ''} onDragOver={onDragOver} onDrop={(ev) => onDropToTrucks(ev, truckItem)} >
                <button onClick={() => { setExpand(s => !s) }}>{!expand ? '⇓' : '⇑'}</button>
                {truckItem.licensePlate} &nbsp;
                TC: {truckItem.capacity} &nbsp;
                CC: {currentCapacity}
                {expand && displayTruckOrders()}
                {expand && <div className={styles.divTruckMessage}>
                    <input className={styles.inputMessage} type="text" id="message" placeholder="Message to driver" onChange={onChangeMessage}/>
                    <button className={styles.btnEye}>⇒</button>
                </div>}
            </div>

        </>
    )
}