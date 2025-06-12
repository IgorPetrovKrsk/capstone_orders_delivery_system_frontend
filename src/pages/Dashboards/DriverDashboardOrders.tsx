import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/authContext/authContext";
import api from "../../api";
import type { Order } from "../../interfaces/OrderInterface";
import OrderItemDriver from "../../components/OrderItemDriver/OrderItemDriver";
import { useError } from "../../context/globalErrorContext/globalErrorContext";
import { useUser } from "../../context/userContext/userContext";


export default function DriverDashBoardOrders() {
    const { cookies } = useAuth();
    const [orders, setOrders] = useState<Order[] | null>(null);
    const [updateOrders, setUpdateOrders] = useState(false)
    const ws = useRef<WebSocket | null>(null);
    const { showError } = useError(); //for showing messages from web socket
    const { user } = useUser(); //to send to the web socket server current user

    useEffect(() => { //useEffect for web socket
        ws.current = new WebSocket(import.meta.env.VITE_WEBSOCKET_URL);
        ws.current.onopen = () => {
            if (ws.current && ws.current.readyState === WebSocket.OPEN) {
                ws.current.send(JSON.stringify({ user: user })); //sending current to the web socket server
            }
        };
        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data.toString());
            if (data.command) {
                if (data.command=='OrderAdded' || data.command=='OrderRemoved'){
                    setUpdateOrders(state => !state);
                }
            } else {
                showError({ title: `Message from ${data.from ?? '!Unknown!'}`, errors: [{ msg: data.message }] });
            }
        };
        ws.current.onclose = () => {
            console.log('WebSocket disconnected');
        };
        return () => {
            ws.current?.close();
        };
    }, []);

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