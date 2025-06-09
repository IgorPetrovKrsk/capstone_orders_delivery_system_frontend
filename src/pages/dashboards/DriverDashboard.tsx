import DriverNav from "../../components/Nav/DriverNav";
import styles from './dashboard.module.css'
import DriverDashBoardOrders from "./DriverDashboardOrders";



export default function DriverDashBoard() {
    return (
        <>
            <DriverNav />
            <DriverDashBoardOrders />
        </>)
}