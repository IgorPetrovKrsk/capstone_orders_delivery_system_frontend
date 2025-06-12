import { useEffect, useState } from "react";
import DispatcherNav from "../../components/Nav/DispatcherNav";
import { useAuth } from "../../context/authContext/authContext";
import styles from './dashboard.module.css'
import type { Truck } from "../../interfaces/TruckInterface";
import api from "../../api";
import TruckItem from "../../components/TruckItem/TruckItem";

export default function DispatcherDashBoardTrucks() {
    const { cookies } = useAuth();
    const [trucks, setTrucks] = useState<Truck[] | null>([]);
    const [updateTrucks, setUpdateTrucks] = useState(false)

    useEffect(() => {
        async function getTrucks() {
            try {
                const res = await api.get(`/trucks`, {
                    headers: { 'token': cookies.token }
                });
                setTrucks(res.data);
            } catch (err) {
                console.error(err);
            }
        }
        getTrucks();
    }, [updateTrucks])

    const loading = () => {
        return (
            <tbody>
                <tr>
                    <td>loading...</td>
                    <td>loading...</td>
                    <td>loading...</td>
                    <td>loading...</td>
                    <td>loading...</td>
                    <td>loading...</td>                    
                </tr>
            </tbody>
        )
    }

    const loaded = () => {
        return (
            <tbody>
                {trucks?.map((it) => <TruckItem truckItem={it} setUpdateTrucks={setUpdateTrucks} key={it._id} />)}
                {/* adding another element for the new truck */}
                <TruckItem truckItem={{_id:'',licensePlate:'',imgUrl:'',capacity:0,status:'available'}} setUpdateTrucks={setUpdateTrucks} key={'new truck'}/> 
            </tbody>
        )
    }

    return (
        <>
            <DispatcherNav />
            <div className={styles.divMain}>
                <table className={styles.tableTrucks}>
                    <thead >
                        <tr >
                            <th ></th> 
                            <th>Licence plate</th>
                            <th>Capacity</th>
                            <th>Status</th>                            
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    {(trucks?.length != 0) ? loaded() : loading()}
                </table>
            </div>
        </>
    )
}