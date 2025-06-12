import { useEffect, useRef, useState } from "react";
import DispatcherNav from "../../components/Nav/DispatcherNav";
import styles from './dashboard.module.css'
import type { Truck } from "../../interfaces/TruckInterface";
import type { Order } from "../../interfaces/OrderInterface";
import { useAuth } from "../../context/authContext/authContext";
import api from "../../api";
import DispatcherTruckItem from "../../components/DispatcherTrucksOrders/DispatcherTruckItem";
import DispatcherOrderItem from "../../components/DispatcherTrucksOrders/DispatcherOrderItem";
import GoogleMap from "../../components/Map/GoogleMap";
import { useError } from "../../context/globalErrorContext/globalErrorContext";
import { useUser } from "../../context/userContext/userContext";


export default function DispatcherDashBoard() {

    const { showError } = useError(); //for showing messages from web socket
    const { user } = useUser(); //to send to the web socket server current user

    const { cookies } = useAuth();
    const [trucks, setTrucks] = useState<Truck[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [updateTrucksOrders, setUpdateTrucksOrders] = useState(false)
    const [draggingOrder, setDraggingOrder] = useState<Order | null>(null)
    const [ordersToShowRoute, setOrdersToShowRoute] = useState<Order[]>([]);
    const [routesToShowOnMap, setRoutesToShowOnMap] = useState<{ lat: number; lng: number }[][]>([]);
    const ws = useRef<WebSocket | null>(null);

    async function getOrderPath(service: google.maps.DirectionsService, order: Order) {
        return new Promise((resolve) => {
            service.route(
                {
                    origin: new google.maps.LatLng(order.originCoordinates.latitude, order.originCoordinates.longitude),
                    destination: new google.maps.LatLng(order.destinationCoordinates.latitude, order.destinationCoordinates.longitude),
                    travelMode: window.google.maps.TravelMode.DRIVING,
                },
                (result, status) => {
                    if (status === 'OK') {
                        const routePath = result?.routes[0].overview_path.map((p) => ({
                            lat: p.lat(),
                            lng: p.lng(),
                        }));
                        resolve(routePath);
                    } else {
                        console.error('Route error:', status);
                        resolve(null);
                    }
                }
            );
        });
    };

    useEffect(() => { //useEffect for web socket
        ws.current = new WebSocket(import.meta.env.VITE_WEBSOCKET_URL);
        ws.current.onopen = () => {
            if (ws.current && ws.current.readyState === WebSocket.OPEN) {
                ws.current.send(JSON.stringify({ user: user })); //sending current to the web socket server
            }
        };
        ws.current.onmessage = async (event) => {
            const data = await JSON.parse(event.data.toString());
            showError({ title: `Message from ${data.from ?? '!Unknown!'}`, errors: [{ msg: data.message }] });
        };
        ws.current.onclose = () => {
            console.log('WebSocket disconnected');
        };
        return () => {
            ws.current?.close();
        };
    }, []);

    useEffect(() => { //this use effect will fetch routes for selected orders using google DirectionsService
        async function getRoutes() {
            const service = new window.google.maps.DirectionsService();
            const results = await Promise.all(
                ordersToShowRoute.map((order) => getOrderPath(service, order))
            );
            setRoutesToShowOnMap(results as { lat: number; lng: number }[][]);
        }
        getRoutes();
    }, [ordersToShowRoute])

    useEffect(() => {
        async function getTrucksOrders() {
            try {
                const [resTrucks, resOrders] = await Promise.all([
                    api.get(`/trucks/available`, { headers: { token: cookies.token } }), //getting only available trucks
                    api.get(`/orders/pendingassignedorders`, { headers: { token: cookies.token } }) //getting all pending and assigned orders
                ]);
                setOrders(resOrders.data);
                setTrucks(resTrucks.data);
            } catch (err) {
                console.error(err);
            }
        }
        getTrucksOrders();
    }, [updateTrucksOrders])

    function displayTrucks() {
        return trucks?.map(truck => {

            return <DispatcherTruckItem
                truckItem={truck}
                truckOrders={orders?.filter(order => order.truck?._id == truck._id)}
                onDropToTrucks={(ev) => onDropToTrucks(ev, truck)}
                onDragStart={(ev, order) => onDragStart(ev, order)}
                ordersToShowRoute={ordersToShowRoute}
                setOrdersToShowRoute={setOrdersToShowRoute}
                sendWebSocketMessageToDriver={(ev, truck, message) => sendWebSocketMessageToDriver(ev, truck, message)}
                key={truck._id}
            />
        })
    }

    function displayOrders() {
        return orders.filter(it => !it.truck).map(it =>
            <DispatcherOrderItem
                orderItem={it}
                onDragStart={(ev) => onDragStart(ev, it)}
                ordersToShowRoute={ordersToShowRoute}
                setOrdersToShowRoute={setOrdersToShowRoute}
                key={it._id}
            />)
    }

    function onDragStart(_ev: React.DragEvent<HTMLDivElement>, it: Order) { //_ev - to show typescript that parametr ev is nessesary, but never used
        setDraggingOrder(it);
    }

    async function onDropToTrucks(ev: React.DragEvent<HTMLDivElement>, truck: Truck) {
        ev.preventDefault();
        if (draggingOrder) {
            try {
                await api.put(`/orders/${draggingOrder._id}`,
                    { truck: truck._id, status: 'assigned' },
                    {
                        headers: { token: cookies.token }
                    });
                setDraggingOrder(null);
                setUpdateTrucksOrders(c => !c);
                if (ws.current && ws.current.readyState === WebSocket.OPEN) { //sending a webSocket to the truck to forse update the orders
                    ws.current.send(JSON.stringify({ truck: truck , command: 'OrderAdded'}));
                }
            } catch (err) {
                console.error(err);
            }
        }
    }

    async function onDropToOrders(ev: React.DragEvent<HTMLDivElement>) {
        ev.preventDefault();
        if (draggingOrder) {
            try {
                const currentTruck = draggingOrder.truck;
                await api.put(`/orders/${draggingOrder._id}`,
                    { truck: null, status: 'pending' },
                    {
                        headers: { token: cookies.token }
                    });
                setDraggingOrder(null);
                setUpdateTrucksOrders(c => !c);
                  if (ws.current && ws.current.readyState === WebSocket.OPEN) { //sending a webSocket to the truck to forse update the orders
                    ws.current.send(JSON.stringify({ truck:currentTruck, command: 'OrderRemoved'}));
                }
            } catch (err) {
                console.error(err);
            }
        }
    }


    function onDragOver(ev: React.DragEvent<HTMLDivElement>) {
        ev.preventDefault();
    }

    function sendWebSocketMessageToDriver(ev: React.FormEvent<HTMLFormElement>, truck: Truck, message: string) {
        ev.preventDefault();
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify({ from: user, truck: truck, message: message }));
        }
    };




    return (
        <>
            <DispatcherNav />
            <div className={styles.divMain}>
                <div className={styles.divTrucksOrders}>
                    <div className={`${styles.divTrucks} ${styles.resizable}`}>
                        <h4>Trucks</h4> {!trucks.length ? <h2>Loading...</h2> : displayTrucks()}
                    </div>
                    <div className={`${styles.divOrders} ${styles.resizable}`} onDragOver={onDragOver} onDrop={onDropToOrders} >
                        <h4>Orders</h4>
                        {!orders.length ? <h2>Loading...</h2> : displayOrders()}
                    </div>
                </div>
                <div className={`${styles.divMap} ${styles.resizable}`}>
                    <GoogleMap routes={routesToShowOnMap} />

                </div>
            </div>

        </>
    )
}