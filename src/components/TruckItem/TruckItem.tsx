import { useState } from "react";
import api from "../../api";
import { useAuth } from "../../context/authContext/authContext";
import styles from './truckItem.module.css'
import type { Truck } from "../../interfaces/TruckInterface";
import comradeCodichTrucksNotFound from '../../assets/Comrade Codich Trucks not found.png';
import Modal from 'react-modal';
import TruckItemAddModify from "./TrucksItemAddModify";


interface TruckItemProps {
    truckItem: Truck;
    setUpdateTrucks: React.Dispatch<React.SetStateAction<boolean>>
}

export default function TruckItem({ truckItem, setUpdateTrucks }: TruckItemProps) {

    const { cookies } = useAuth();
    const [modify, setModify] = useState(false);


    async function onDelete() {
        const confirmDelete = confirm(`Are you sure you want to delete truck ${truckItem.licensePlate}?`);
        if (confirmDelete) {
            try {
                await api.delete(`/trucks/${truckItem._id}`, {
                    headers: { 'token': cookies.token }
                });
                setUpdateTrucks(state => !state)
            } catch (err) {
                console.error(err);
            }
        }
    }
    function onEdit() {
        setModify(true);
    }

    return (
        <>
            <tr>
                <td>{(truckItem._id != '') ? <img className={styles.imgTruck} src={truckItem.imgUrl || comradeCodichTrucksNotFound} alt={`Image of truck with the license plate ${truckItem.licensePlate}`} /> : null}</td>
                <td>{truckItem.licensePlate}</td>
                <td>{(truckItem._id != '') ? truckItem.capacity : null}</td>
                <td>{(truckItem._id != '') ? truckItem.status : null}</td>

                <td><button onClick={onEdit}>{(truckItem._id == '') ? 'Add' : 'Edit'}</button></td>
                <td>{(truckItem._id != '') ? <button onClick={onDelete}>Delete</button> : null}</td>
            </tr>
            {modify && <TruckItemAddModify truckItem={truckItem} setModify={setModify} setUpdateTrucks={setUpdateTrucks} />}            
        </>
    )
}