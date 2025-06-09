import { useEffect, useState } from "react"
import AdminNav from "../../components/Nav/AdminNav"
import styles from './dashboard.module.css'
import api from "../../api";
import { useAuth } from "../../context/authContext/authContext";
import type { User } from "../../interfaces/UserInterface";
import UserItem from "../../components/UserItem/UserItem";

export default function AdminDashBoardUsers() {
    const { cookies } = useAuth();
    const [users, setUsers] = useState<User[] | null>([]);
    const [updateUsers, setUpdateUsers] = useState(false)

    useEffect(() => {
        async function getUsers() {
            try {
                const res = await api.get(`/users`, {
                    headers: { 'token': cookies.token }
                });
                setUsers(res.data);
            } catch (err) {
                console.error(err);
            }
        }
        getUsers();
    }, [updateUsers])

    const loading = () => {
        return (
            <tbody>
                <tr>
                    <td>loading...</td>
                    <td>loading...</td>
                    <td>loading...</td>
                    <td>loading...</td>
                    <td>loading...</td>
                    <td>loading...</td>
                    <td>loading...</td>
                </tr>
            </tbody>
        )
    }

    const loaded = () => {
        return (
            <tbody>
                {users?.map((it) => <UserItem userItem={it} setUpdateUsers={setUpdateUsers} key={it._id} />)}
                {/* adding another element for the new user */}
                <UserItem userItem={{_id:'',username:'',isActive:true,role:'driver',imgUrl:''}} setUpdateUsers={setUpdateUsers} key={'new user'}/> 
            </tbody>
        )
    }

    return (
        <>
            <AdminNav />
            <div className={styles.divMain}>
                <h2>Users</h2>
                <table className={styles.tableUsers}>
                    <thead >
                        <tr >
                            <th ></th>
                            <th>Username</th>
                            <th>Role</th>
                            <th>Truck</th>
                            <th>Active</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    {(users?.length != 0) ? loaded() : loading()}
                </table>
            </div>
        </>
    )
}