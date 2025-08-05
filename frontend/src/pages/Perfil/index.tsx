import { useContext } from "react";
import { Navbar } from "../../components";
import { AppContext } from "../../contexts/AppContext";

export default function Perfil(){
    const {setUser} = useContext(AppContext);
    return (
        <>
            <Navbar></Navbar>
            <button style={{marginTop: 125}} onClick={() => {localStorage.setItem('user', ""); setUser(undefined);}}>Logout</button>
        </>
    );
}