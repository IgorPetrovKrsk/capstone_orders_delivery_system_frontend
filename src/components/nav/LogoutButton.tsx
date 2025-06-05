import { useAuth } from '../../context/authContext/authContext';
import { useNavigate } from 'react-router-dom';

export default function LogoutButton() {
    const { logout } = useAuth();
    const nav = useNavigate();

    function onLogout() {
        logout();
        nav('/');
    }
    return (
        <>
            <button onClick={onLogout}>Logout</button>
        </>
    )
}