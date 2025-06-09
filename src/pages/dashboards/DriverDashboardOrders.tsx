import { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext/authContext";
import api from "../../api";
import type { Order } from "../../interfaces/OrderInterface";
import OrderItemDriver from "../../components/OrderItemDriver/OrderItemDriver";


export default function DriverDashBoardOrders() {
    const { cookies } = useAuth();
    const [orders, setOrders] = useState<Order[] | null>(null);
    const [updateOrders, setUpdateOrders] = useState(false)

    useEffect(() => {
        async function getOrders() {
            try {
                const res = await api.get(`/orders/undeliveredOrdersByUserId`, {
                    headers: { 'token': cookies.token }
                });
                setOrders(res.data);
            } catch (err) {
                console.error(err);
            }
        }
        getOrders();
    }, [updateOrders])

    const loading = () => {
        return (
            <h2>Loading....</h2>
        )
    }

    const loaded = () => {
        if (orders?.length == 0) {
            <h2>No current orders.</h2>
        } else {
            return (
                orders?.map(it => <OrderItemDriver orderItem={it} setUpdateOrders={setUpdateOrders} key={it._id} />)
            )
        }
    }

    return (
        <>
            {(orders) ? loaded() : loading()}
        </>
    )
}