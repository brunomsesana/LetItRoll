import { useContext, useEffect, useState } from "react";
import styles from "./Notification.module.css";
import { AppContext } from "../../contexts/AppContext";

export default function Notification() {
    const {
        notificationText,
        setNotificationText,
        notificationSubText,
        setNotificationSubText,
        notificationTitle,
        setNotificationTitle
    } = useContext(AppContext);

    const [isFading, setIsFading] = useState(false);

    useEffect(() => {
        if (!notificationText && !notificationSubText && !notificationTitle) return;
    
        // Cancela qualquer fade atual e mostra direto
        setIsFading(false);
    
        let fadeTimer;
        let fadeOutTimer : any;
    
        // Começa contagem de exibição
        fadeTimer = setTimeout(() => {
            setIsFading(true); // aplica fade-out
            fadeOutTimer = setTimeout(() => {
                // limpa tudo depois do fade-out
                setNotificationText("");
                setNotificationSubText("");
                setNotificationTitle("");
                setIsFading(false);
            }, 900); // tempo do fade-out
        }, 5000); // tempo que fica visível
    
        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(fadeOutTimer);
        };
    }, [notificationText, notificationSubText, notificationTitle]);
    

    if (!notificationText) return null;

    return (
        <div
            className={`${styles.notification} ${isFading ? styles.fading : ""}`}
        >
            <p>{notificationTitle}</p>
            <h2>{notificationText}</h2>
            <p
                style={{ fontSize: "small", color: "#242424" }}
                dangerouslySetInnerHTML={{
                    __html: notificationSubText ?? ""
                }}
            />
        </div>
    );
}
