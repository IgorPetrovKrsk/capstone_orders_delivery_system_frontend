import React, { useState } from "react";
import style from './userItem.module.css'
import type { User } from "../../context/userContext/userContext";
import { useError } from "../../context/globalErrorContext/globalErrorContext";
import { useAuth } from "../../context/authContext/authContext";
import api from "../../api";

interface UserItemProps {
    userItem: User;
    setModify: React.Dispatch<React.SetStateAction<boolean>>
}

interface UserForm {
    username: string;
    role: string;
    isActive: boolean;
    truck?:string;
    password?: string;
    password2?: string;
}


const UserItemAddModify: React.FC<UserItemProps> = ({ userItem, setModify }: UserItemProps) => {

    const { showError } = useError();
    const { cookies } = useAuth();

    const [formData, setFormData] = useState<UserForm>({ ...userItem});

    function onChange(ev: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        setFormData({ ...formData, [ev.target.name]: ev.target.value })
    }

    function onCancel(ev: React.MouseEvent<HTMLButtonElement>) {
        ev.preventDefault();
        setModify(false);
    }

    async function onSave(ev: React.MouseEvent<HTMLButtonElement>) {
        ev.preventDefault();
        if (formData.password != formData.password2 && formData.password?.trim()) {
            showError({ title: "Passwords should match", errors: [] });
        }
        if (formData.password?.trim()=='' && formData.password2?.trim()==''){ //if passwords are empty we will not change passwors so sending put request without passwords
            delete formData.password;
            delete formData.password2;
        }
        try {
            await api.put(`/users/${userItem._id}`,
                { ...formData },
                { headers: { 'token': cookies.token } }
            );
            setModify(false);
        } catch (err) {
            console.error(err);
        }
    }


    return (
        <div className={style.userOverlay}>
            <div className={style.user}>
                <div className={style.userContent}>
                    <h2>User {userItem.username || 'New User'}</h2>
                    <img className={style.imgUserModify} src={userItem.imgUrl || 'src/assets/user image not found.png'} alt={`Image of ${userItem.username}`} />
                    <br />
                    <button>Upload new image</button>
                    <br />
                    <form >
                        <label htmlFor="">Username: </label>
                        <input type="text" name="username" value={formData.username} onChange={onChange} />
                        <br />
                        <label htmlFor="">Role: </label>
                        <select name="role" onChange={onChange} value={formData.role}>
                            <option value="admin">Admin</option>
                            <option value="dispatcher">Dispatcher</option>
                            <option value="driver">Driver</option>
                        </select>
                        <br />
                        <label htmlFor="">Truck:</label>
                        <select name="truck" onChange={onChange} value={formData.truck}>
                            {/* Need to get all awailable trucks and generate dynamic options */}
                        </select>
                        <br />
                        <label htmlFor="">User active: </label>
                        <input type="checkbox" checked={formData.isActive} />
                        <br />
                        <label htmlFor="">Password: </label>
                        <input type='password' name="password" value={formData.password} onChange={onChange} placeholder="Password" />
                        <br />
                        <label htmlFor="">Repeat password: </label>
                        <input type='password' name="password2" value={formData.password2} onChange={onChange} placeholder="Repeat password" />
                        <div className={style.btnSaveCancel}>
                            <button className={style.saveCancelButton} onClick={onSave} >Save</button>
                            <button className={style.saveCancelButton} onClick={onCancel}>Cancel</button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    );
};

export default UserItemAddModify;