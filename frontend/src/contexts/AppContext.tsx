import { useState, createContext, ReactNode, useEffect } from "react";
import { User } from "../Interfaces";


export const AppContext = createContext<{
    user: User | undefined,
    setUser: (user : User) => void;
}>({user: undefined, setUser: () => {}});

export function AppProvider({children} : {children: ReactNode}){
    const [user, setUser] = useState<User>();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, [])

    return(
        <AppContext.Provider value={{user, setUser}}>
            {children}
        </AppContext.Provider>
    )
}