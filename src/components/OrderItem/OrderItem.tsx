import { useState } from "react";
import api from "../../api";
import { useAuth } from "../../context/authContext/authContext";
import type { Coordinates, Order } from "../../interfaces/OrderInterface";
import type { Truck } from "../../interfaces/TruckInterface";
import { useError } from "../../context/globalErrorContext/globalErrorContext";

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
    truck?: Truck;
}

export default function OrderItem({ orderItem, setUpdateOrders }: OrderItemProps) {

    const { showError } = useError();
    const { cookies } = useAuth();
    const [modify, setModify] = useState(false);
    const [formData, setFormData] = useState<OrderForm>({ ...orderItem })
    const [trucks, setTrucks] = useState<Truck[]>([]);

    function trucksOptions() {
        return (
            trucks.map(it => <option value={it._id} key={it._id}>{it.licensePlate}</option>)
        )
    }

    async function getTrucks() {
        try {
            const res = await api('/trucks/available', { //getting only available trucks
                headers: { 'token': cookies.token }
            });
            setTrucks(res.data);
        } catch (err) {
            console.error(err);
        }
    }

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



    function onChange(ev: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        switch (ev.target.name) {
            case 'originCoordinates.latitude': //switch for all nest cases objects
                setFormData({ ...formData, originCoordinates: { ...formData.originCoordinates, latitude: parseFloat(ev.target.value) } })
                break;
            case 'originCoordinates.longitude':
                setFormData({ ...formData, originCoordinates: { ...formData.originCoordinates, longitude: parseFloat(ev.target.value) } })
                break;
            case 'destinationCoordinates.latitude':
                setFormData({ ...formData, destinationCoordinates: { ...formData.destinationCoordinates, latitude: parseFloat(ev.target.value) } })
                break;
            case 'destinationCoordinates.longitude':
                setFormData({ ...formData, destinationCoordinates: { ...formData.destinationCoordinates, longitude: parseFloat(ev.target.value) } })
                break;
            default:
                setFormData({ ...formData, [ev.target.name]: ev.target.value })
                break;
        }

    }

    function onEdit() {
        setModify(true);
        getTrucks();
        setFormData({ ...orderItem });
    }
    function onCancel() {
        setModify(false);
    }
    async function onSave(ev: React.MouseEvent<HTMLButtonElement>) {

        ev.preventDefault();
        if (!formData.origin.trim() || !formData.destination.trim()) {
            showError({ title: "Origin and Destination should be filled", errors: [] });
            return;
        }


        try {
            if (!formData._id) { //if no order id this means this is a new order so post request
                formData._id = null
                await api.post(`/orders`,
                    { ...formData },
                    { headers: { 'token': cookies.token } }
                );
            } else {
                await api.put(`/orders/${orderItem._id}`,
                    { ...formData },
                    { headers: { 'token': cookies.token } }
                );
            }
            setModify(false);
            setUpdateOrders(state => !state);
        } catch (err) {
            console.error(err);
        }
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
                    <td><input type='text' name='origin' value={formData.origin} onChange={onChange}></input></td>
                    <td><input type="number" name="originCoordinates.latitude" value={formData.originCoordinates.latitude} onChange={onChange} /></td>
                    <td><input type="number" name="originCoordinates.longitude" value={formData.originCoordinates.longitude} onChange={onChange} /></td>
                    <td><input type='text' name='destination' value={formData.destination} onChange={onChange}></input></td>
                    <td><input type="number" name="destinationCoordinates.latitude" value={formData.destinationCoordinates.latitude} onChange={onChange} /></td>
                    <td><input type="number" name="destinationCoordinates.longitude" value={formData.destinationCoordinates.longitude} onChange={onChange} /></td>
                    <td>
                        <select name="status" onChange={onChange} value={formData.status}>
                            <option value="pending">Pending</option>
                            <option value="assigned">Assigned</option>
                            <option value="delivered">Delivered</option>
                            <option value="returned">Returned</option>
                        </select>
                    </td>
                    <td><input type="number" name="weight" value={formData.weight} onChange={onChange} /></td>
                    <td><select name="truck" onChange={onChange} value={formData.truck?._id}>
                        <option value=''>------</option>
                        {trucksOptions()}
                    </select>
                    </td>
                    <td><button onClick={onSave}>Save</button></td>
                    <td><button onClick={onCancel}>Cancel</button></td>
                </tr>
            }
        </>
    )
}