import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/authContext/authContext";
import style from './login.module.css'

export default function Login() {

    const nav = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    function onChange(ev: React.ChangeEvent<HTMLInputElement>) {
        setFormData({ ...formData, [ev.target.name]: ev.target.value });
    }

    async function onSubmit(ev: React.FormEvent<HTMLFormElement>) {
        ev.preventDefault();
        try {
            await login(formData);
            nav('/dashboard');
        } catch (err) {
            console.error(err);
        }

    }

    return (
        <div className={style.login}>
            <div>
                <img src="src\assets\Comrade Codich Trucks.png" alt="Comrade Codich Trucks Logo" width={'70%'} />
            </div>
            <h2>Login</h2>
            <form autoComplete='off' onSubmit={onSubmit}>
                <div >
                    <label  htmlFor='username'>Username: </label>
                    <input type='username' onChange={onChange} id='username' name='username' placeholder='Username' />
                    <br />
                </div>
                <div >
                    <label className={style.label} htmlFor='password'>Password: &nbsp;</label>
                    <input
                        onChange={onChange}
                        type='password'
                        id='password'
                        name='password'
                        placeholder='Password'
                    />
                </div>
                <br />
                <br />
                <button type='submit'>
                    Log In
                </button>
            </form>
        </div>
    );
}


