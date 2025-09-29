import React from "react";
import style from './loading.module.css'
import ReactDOM from "react-dom";
import loadingGif from '../assets/loading.webp'

const LoadingModal: React.FC = () => {
    return ReactDOM.createPortal(
        <div className={style.loadingOverlay}>
            <div className={style.loading}>
                <div className={style.loadingContext}>
                    <h2>Loading...</h2>
                    <img src={loadingGif} alt="Loading gif" width={'70%'} />
                </div>
            </div>
        </div>
    ,document.getElementById("modal-root")??document.createDocumentFragment());
};

export default LoadingModal;