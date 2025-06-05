import { Outlet } from "react-router-dom";
import { useUser } from "../../context/userContext/userContext";

interface ProtectedRoutesProps {
    role: string;
}

export default function protectedRoutesRoutes({ role }: ProtectedRoutesProps) {
    const { user } = useUser();
    return (user?.role == role) ? <Outlet /> : <h1>You are not Authorized! SCRAM!!!</h1>
}