import React, { useState } from "react";
import ReactDOM from "react-dom";
import style from './truckItem.module.css'
import { useError } from "../../context/globalErrorContext/globalErrorContext";
import { useAuth } from "../../context/authContext/authContext";
import api from "../../api";
import comradeCodichTrucksNotFound from '../../assets/Comrade Codich Trucks not found.png';
import type { Truck } from "../../interfaces/TruckInterface";

interface TruckItemProps {
    truckItem: Truck;
    setModify: React.Dispatch<React.SetStateAction<boolean>>
    setUpdateTrucks: React.Dispatch<React.SetStateAction<boolean>>
}

interface TruckForm {
    _id: string | null;
    licensePlate: string;
    capacity: number;
    status: string;
    imgUrl?: string
}

export default function TruckItemAddModify({ truckItem, setModify, setUpdateTrucks }: TruckItemProps) {

    const { showError } = useError();
    const { cookies } = useAuth();

    const [formData, setFormData] = useState<TruckForm>({ ...truckItem });
    const [file, setFile] = useState<File | null>(null);

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
        setFormData({ ...formData, [ev.target.name]: ev.target.value })
    }

    function onCancel(ev: React.MouseEvent<HTMLButtonElement>) {
        ev.preventDefault();
        setModify(false);
    }

    async function onSave(ev: React.MouseEvent<HTMLButtonElement>) {
        ev.preventDefault();
        if (formData.licensePlate.trim() == '' ) {
            showError({ title: "Truck should have a license plate", errors: [] });
            return;
        }
        try {
            if (!formData._id) { //if no truck id this means this is a new truck so post request
                formData._id = null
                await api.post(`/trucks`,
                    { ...formData },
                    { headers: { 'token': cookies.token } }
                );
            } else {
                await api.put(`/trucks/${formData._id}`,
                    { ...formData },
                    { headers: { 'token': cookies.token } }
                );
            }
            setModify(false);
            setUpdateTrucks(state => !state);
        } catch (err) {
            console.error(err);
        }
    }


    return ReactDOM.createPortal(
        <div className={style.truckOverlay}>
            <div className={style.truck}>
                <div className={style.truckContent}>
                    <h2>Truck {truckItem.licensePlate || 'New Truck'}</h2>
                    <img className={style.imgTruckModify} src={formData.imgUrl || comradeCodichTrucksNotFound} alt={`Image of truck with the license plate ${truckItem.licensePlate}`} />
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


                        <label htmlFor="">License plate: </label>
                        <input type="text" name="licensePlate" value={formData.licensePlate} onChange={onChange} />
                        <br />
                        <label htmlFor="">Capacity: </label>
                        <input type='number' name="capacity" value={formData.capacity} onChange={onChange} />
                        <br />
                        <label htmlFor="">Status:</label>
                        <select name="status" onChange={onChange} value={formData.status}>
                            <option value="available">Available</option>
                            <option value="en route">En Route</option>
                            <option value="idle">Idle</option>
                            <option value="repairs">Repairs</option>
                        </select>
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
