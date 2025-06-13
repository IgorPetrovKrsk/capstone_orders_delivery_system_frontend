import { useState } from "react";
import api from "../../api";
import { useAuth } from "../../context/authContext/authContext";
import type { User } from "../../interfaces/UserInterface";
import styles from './userItem.module.css'
import UserItemAddModify from "./UserItemAddModify";
import userNotFoundImage from '../../assets/user image not found.png'

interface UserItemProps {
    userItem: User;
    setUpdateUsers: React.Dispatch<React.SetStateAction<boolean>>
}

export default function UserItem({ userItem, setUpdateUsers }: UserItemProps) {
    
    const { cookies } = useAuth();
    const [modify,setModify] = useState(false);


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
        setModify(true);
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
                <td>{(userItem._id!='')?<img className={styles.imgUser} src={userItem.imgUrl || userNotFoundImage} alt={`Image of ${userItem.username}`} />:null}</td>
                <td className={styles.tdUsernameRole}>{userItem.username}</td>
                <td className={styles.tdUsernameRole}>{(userItem._id!='')?userItem.role:null}</td>
                <td>{userItem.truck?.licensePlate}</td>
                <td>{(userItem._id!='')?<input type="checkbox" checked={userItem.isActive} onChange={onActiveChange} />:null}</td>
                <td><button onClick={onEdit}>{(userItem._id=='')?'Add':'Edit'}</button></td>
                <td>{(userItem._id!='')?<button onClick={onDelete}>Delete</button>:null}</td>                
            </tr>
            {modify && <UserItemAddModify userItem = {userItem} setModify={setModify} setUpdateUsers={setUpdateUsers}/>}
        </>
    )
}