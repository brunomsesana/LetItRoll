import { useState, createContext, ReactNode, useEffect } from "react";
import { User } from "../Interfaces";


export const AppContext = createContext<{
    user: User | undefined,
    setUser: (user : User | undefined) => void,
    notificationTitle: string | undefined,
    setNotificationTitle: (title: string | undefined) => void,
    notificationText: string | undefined,
    setNotificationText: (text: string | undefined) => void,
    notificationSubText: string | undefined,
    setNotificationSubText: (text: string | undefined) => void;
}>({user: undefined, setUser: () => {}, notificationTitle: undefined, setNotificationTitle: () => {}, notificationText: undefined, setNotificationText: () => {}, notificationSubText: undefined, setNotificationSubText: () => {}});

export function AppProvider({children} : {children: ReactNode}){
    const [user, setUser] = useState<User | undefined>();
    const [notificationTitle, setNotificationTitle] = useState<string | undefined>();
    const [notificationText, setNotificationText] = useState<string | undefined>();
    const [notificationSubText, setNotificationSubText] = useState<string | undefined>();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, [])

    return(
        <AppContext.Provider value={{user, setUser, notificationTitle, setNotificationTitle, notificationText, setNotificationText, notificationSubText, setNotificationSubText}}>
            {children}
        </AppContext.Provider>
    )
}