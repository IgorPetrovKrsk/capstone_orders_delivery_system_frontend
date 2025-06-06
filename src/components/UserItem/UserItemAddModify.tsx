import React, { useEffect, useState } from "react";
import style from './userItem.module.css'
import type { User } from "../../interfaces/UserInterface";
import { useError } from "../../context/globalErrorContext/globalErrorContext";
import { useAuth } from "../../context/authContext/authContext";
import api from "../../api";
import ReactDOM from "react-dom";
import type { Truck } from "../../interfaces/TruckInterface";

interface UserItemProps {
    userItem: User;
    setModify: React.Dispatch<React.SetStateAction<boolean>>
    setUpdateUsers: React.Dispatch<React.SetStateAction<boolean>>
}

interface UserForm {
    _id: string;
    username: string;
    role?: string;
    isActive: boolean;
    truck?: Truck;
    password?: string;
    password2?: string;
    imgUrl?: string
}

const UserItemAddModify: React.FC<UserItemProps> = ({ userItem, setModify, setUpdateUsers }: UserItemProps) => {

    const { showError } = useError();
    const { cookies } = useAuth();

    const [formData, setFormData] = useState<UserForm>({ ...userItem });
    const [file, setFile] = useState<File | null>(null);
    const [trucks, setTrucks] = useState<Truck[]>([]);

    function trucksOptions() {
        return (
            trucks.map(it => <option value={it._id} key={it._id}>{it.licensePlate}</option>)
        )
    }


    useEffect(() => { //getting all the trucks to populate select
        async function getTrucks() {
            try {
                const res = await api('/trucks', {
                    headers: { 'token': cookies.token }
                });
                setTrucks(res.data);
            } catch (err) {
                console.error(err);
            }
        }
        getTrucks();
    }, [])

    function onFileChange(ev: React.ChangeEvent<HTMLInputElement>) {
        setFile(ev.target.files?.[0] || null);
    };

    function onClearImage(ev: React.MouseEvent<HTMLButtonElement>) {
        ev.preventDefault();
        setFile(null);
        setFormData({ ...formData, imgUrl: '' });
    }

    async function onUploadImg(ev: React.MouseEvent<HTMLButtonElement>) {
        ev.preventDefault();
        if (!file) {
            showError({ title: "Choose an image", errors: [] });
            return;
        }
        try {
            const res = await api.get(`/s3-url`, {
                headers: { 'token': cookies.token }
            });
            await api.put(res.data.url,
                file,
                {
                    headers: {
                        "Content-Type": file?.type
                    }
                });
            setFormData({ ...formData, imgUrl: res.data.staticUrl });
        } catch (err) {
            console.error(err);
        }

    }

    function onChange(ev: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        let value: any = ev.target.type === "checkbox" ? ev.target.checked : ev.target.value;
        value = ev.target.name === "truck" && ev.target.value == '' ? null : ev.target.value;
        setFormData({ ...formData, [ev.target.name]: value })
    }

    function onCancel(ev: React.MouseEvent<HTMLButtonElement>) {
        ev.preventDefault();
        setModify(false);
    }

    async function onSave(ev: React.MouseEvent<HTMLButtonElement>) {
        ev.preventDefault();
        if (formData.password != formData.password2 && formData.password?.trim()) {
            showError({ title: "Passwords should match", errors: [] });
            return;
        }
        if (formData._id == '' && !formData.password?.trim()) {
            showError({ title: "New user should have a password", errors: [] });
            return;
        }
        if (formData.password?.trim() == '' && formData.password2?.trim() == '') { //if passwords are empty we will not change passwors so sending put request without passwords
            delete formData.password;
            delete formData.password2;
        }

        try {
            if (formData._id == '') { //if no user id this means this is a new user so post request
                await api.post(`/users`,
                    { ...formData },
                    { headers: { 'token': cookies.token } }
                );
            } else {
                await api.put(`/users/${userItem._id}`,
                    { ...formData },
                    { headers: { 'token': cookies.token } }
                );
            }
            setModify(false);
            setUpdateUsers(state => !state);
        } catch (err) {
            console.error(err);
        }
    }


    return ReactDOM.createPortal(
        <div className={style.userOverlay}>
            <div className={style.user}>
                <div className={style.userContent}>
                    <h2>User {userItem.username || 'New User'}</h2>
                    <img className={style.imgUserModify} src={formData.imgUrl || 'src/assets/user image not found.png'} alt={`Image of ${userItem.username}`} />
                    <br />
                    <form >
                        <input type="file" onChange={onFileChange} />
                        <br />
                        <br />
                        <div className={style.btnSaveCancel}>
                            <button onClick={onUploadImg}>Upload new image</button>

                            <button onClick={onClearImage}>X</button>
                        </div>
                        <br />


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
                        <select name="truck" onChange={onChange} value={formData.truck?._id}>
                            <option value=''>------</option>
                            {trucksOptions()}
                        </select>
                        <br />
                        <label htmlFor="">User active: </label>
                        <input type="checkbox" name='isActive' checked={formData.isActive} onChange={onChange} />
                        <br />
                        <label htmlFor="">Password: </label>
                        <input type='password' name="password" value={formData.password} onChange={onChange} placeholder="Password" />
                        <br />
                        <label htmlFor="">Repeat password: </label>
                        <input type='password' name="password2" value={formData.password2} onChange={onChange} placeholder="Repeat password" />
                        <br />
                        <br />
                        <div className={style.btnSaveCancel}>
                            <button onClick={onSave} >Save</button>
                            <button onClick={onCancel}>Cancel</button>
                        </div>
                    </form>

                </div>
            </div>
        </div>,
        document.getElementById("modal-root") ?? document.createDocumentFragment());
};

export default UserItemAddModify;