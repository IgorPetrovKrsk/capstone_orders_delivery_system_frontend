import { useState } from "react";
import api from "../../api";
import { useAuth } from "../../context/authContext/authContext";
import type { Coordinates, Order } from "../../interfaces/OrderInterface";
import type { Truck } from "../../interfaces/TruckInterface";

interface OrderItemProps {
    orderItem: Order;
    setUpdateOrders: React.Dispatch<React.SetStateAction<boolean>>
}

 interface OrderForm {
    _id: string | null;
    origin: string;
    originCoordinates: Coordinates;
    destination: string;
    destinationCoordinates: Coordinates;
    status: string;
    weight: number;
    truck?:Truck;
}

export default function OrderItem({ orderItem, setUpdateOrders }: OrderItemProps) {

    const { cookies } = useAuth();
    const [modify, setModify] = useState(false);
    const [formData,setFormData] = useState<OrderForm|null>(null) //will populate use state only then modifying to save a litle bit of memory
 
    async function onDelete() {
        const confirmDelete = confirm(`Are you sure you want to delete order?`);
        if (confirmDelete) {
            try {
                await api.delete(`/orders/${orderItem._id}`, {
                    headers: { 'token': cookies.token }
                });
                setUpdateOrders(state => !state)
            } catch (err) {
                console.error(err);
            }
        }
    }
    function onEdit() {
        setModify(true);
        setFormData({...orderItem});
    }
    function onCancel(){
        setModify(false);
    }
    function onSave(){
        setModify(false);
        setUpdateOrders(state => !state);
    }

    return (
        <>
            {!modify ?
                <tr>
                    <td>{orderItem.origin}</td>
                    <td>{orderItem.originCoordinates.latitude || null}</td>
                    <td>{orderItem.originCoordinates.longitude || null}</td>
                    <td>{orderItem.destination}</td>
                    <td>{orderItem.destinationCoordinates.latitude || null}</td>
                    <td>{orderItem.destinationCoordinates.longitude || null}</td>
                    <td>{orderItem._id != '' ? orderItem.status : null}</td>
                    <td>{orderItem.weight || null}</td>
                    <td>{orderItem.truck?.licensePlate}</td>
                    <td><button onClick={onEdit}>{(orderItem._id == '') ? 'Add' : 'Edit'}</button></td>
                    <td>{(orderItem._id != '') ? <button onClick={onDelete}>Delete</button> : null}</td>
                </tr>
                : <tr>
                    <td><input type='text'></input></td>
                    <td>{orderItem.originCoordinates.latitude || null}</td>
                    <td>{orderItem.originCoordinates.longitude || null}</td>
                    <td>{orderItem.destination}</td>
                    <td>{orderItem.destinationCoordinates.latitude || null}</td>
                    <td>{orderItem.destinationCoordinates.longitude || null}</td>
                    <td>{orderItem._id != '' ? orderItem.status : null}</td>
                    <td>{orderItem.weight || null}</td>
                    <td>{orderItem.truck?.licensePlate}</td>
                    <td><button onClick={onSave}>Save</button></td>
                    <td><button onClick={onCancel}>Cancel</button></td>
                </tr>
            }
        </>
    )
}