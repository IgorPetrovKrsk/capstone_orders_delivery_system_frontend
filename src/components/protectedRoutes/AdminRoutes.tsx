import { useAuth } from "../../context/authContext/authContext";
import { Outlet } from "react-router-dom";

export default function AdminRoutes(){
    const {cookies} = useAuth();
    return cookies.token? <Outlet />: <h1>You are not Authorized! SCRAM!!!</h1>
}