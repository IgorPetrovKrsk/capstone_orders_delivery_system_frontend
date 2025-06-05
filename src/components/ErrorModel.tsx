import React from "react";
import style from './error.module.css'
import ReactDOM from "react-dom";

interface ErrorMsg {
  msg: string;
}

interface ErrorData {
    title: string;
    errors: ErrorMsg[];
}

interface ErrorModalProps {
    errorData: ErrorData;
    onClose: () => void;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ errorData, onClose }) => {
    const errorList = errorData.errors?.map(it => <li key={it.msg}>{it.msg}</li>)
    return ReactDOM.createPortal(
        <div className={style.errorOverlay}>
            <div className={style.error}>
                <div className={style.errorContext}>
                    <h2>{errorData.title}</h2>
                    <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
                        {errorList}
                    </ul>
                    <button className={style.errorButton} onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    ,document.getElementById("modal-root")??document.createDocumentFragment());
};

export default ErrorModal;