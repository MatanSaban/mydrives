import styles from "./popup.module.scss";
import { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";


export default function Popup(props) {
    const [showContent, setShowContent] = useState(true);
    const handleShowContent = () => {
        setShowContent(true);
    };

    return (
        <div
            className={`${styles.popupWrapper} ${
                props.show ? styles.show : ""
            }`}
        >
            <div
                className={styles.popupBackdrop}
                onClick={() => props.handlePopup(false)}
            >
                <div
                    className={`${styles.popupContentWrapper} ${
                        showContent ? styles.show : ""
                    }`}
                    onClick={(e) => e.stopPropagation()} 
                >
                    <i onClick={() => props.handlePopup(false, props.content)}><AiOutlineClose/></i>
                    {showContent && (
                        <div className={styles.popupContent}>
                            {props.content}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
