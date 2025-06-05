import type { User } from "../../context/userContext/userContext";
import styles from './userItem.module.css'

interface UserItemProps {
    userItem: User;    
}

export default function UserItem({userItem}:UserItemProps){
    function onDelete(){
        alert(`On delete clicked on User ${userItem._id}`)
    }
    function onEdit(){
        alert(`On edit clicked on User ${userItem._id}`)
    }  
    async function onActiveChange(ev){
        //alert(`On active change on user ${userItem._id}`)
        userItem.isActive = !userItem.isActive;
    }  
    
    return (
        <>
            <tr>
                <td><img className={styles.imgUser} src={userItem.imgUrl || 'src/assets/user image not found.png'} alt={`Image of ${userItem.username}`} /></td>
                <td>{userItem.username}</td>
                <td>{userItem.role}</td>
                <td>{userItem.truck}</td>
                <td><input type="checkbox" checked={userItem.isActive} onChange={onActiveChange}/></td>
                <td><button onClick={onEdit}>Edit</button></td>
                <td><button onClick={onDelete}>Delete</button></td>
            </tr>
        </>
    )
}