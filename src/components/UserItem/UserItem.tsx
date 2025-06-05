import api from "../../api";
import { useAuth } from "../../context/authContext/authContext";
import type { User } from "../../context/userContext/userContext";
import styles from './userItem.module.css'

interface UserItemProps {
    userItem: User;
    setUpdateUsers: React.Dispatch<React.SetStateAction<boolean>>
}



export default function UserItem({ userItem, setUpdateUsers }: UserItemProps) {
    const { cookies } = useAuth();
    async function onDelete() {
        const confirmDelete = confirm(`Are you sure you want to delete user ${userItem.username}?`);
        if (confirmDelete) {
            try {
                await api.delete(`/users/${userItem._id}`, {
                    headers: { 'token': cookies.token }
                });
                setUpdateUsers(state => !state)
            } catch (err) {
                console.error(err);
            }
        }
    }
    function onEdit() {
        alert(`On edit clicked on User ${userItem._id}`)
    }
    async function onActiveChange() {
        try {
            await api.put(`/users/${userItem._id}`,
                { ...userItem, isActive: !userItem.isActive },
                { headers: { 'token': cookies.token } }
            );
            setUpdateUsers(state => !state)
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <>
            <tr>
                <td><img className={styles.imgUser} src={userItem.imgUrl || 'src/assets/user image not found.png'} alt={`Image of ${userItem.username}`} /></td>
                <td>{userItem.username}</td>
                <td>{userItem.role}</td>
                <td>{userItem.truck}</td>
                <td><input type="checkbox" checked={userItem.isActive} onChange={onActiveChange} /></td>
                <td><button onClick={onEdit}>Edit</button></td>
                <td><button onClick={onDelete}>Delete</button></td>
            </tr>
        </>
    )
}