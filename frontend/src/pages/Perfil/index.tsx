import { useContext, useEffect, useState } from "react";
import { Navbar } from "../../components";
import { AppContext } from "../../contexts/AppContext";
import { useParams } from "react-router-dom";
import { User } from "../../Interfaces";

export default function Perfil() {
    const { user, setUser } = useContext(AppContext);
    const { username } = useParams();
    const [userProfile, setUserProfile] = useState<User>();

    const handleLogout = async () => {
        try {
            const response = await fetch("https://localhost:5148/api/User/logout", {
                method: "POST",
                credentials: "include",
            });
            if (response.ok) {
                // Só executa se o status HTTP indicar sucesso (2xx)
                setUser(undefined);
                console.log("Logout realizado com sucesso!");
            } else {
                console.error("Falha ao fazer logout:", response.status);
            }
        } catch (err) {
            console.error("Erro ao fazer logout:", err);
        } finally {
            setUser(undefined);
        }
    };
    useEffect(() => {
        if (username == user?.username){
            setUserProfile(user);
        } else {
            fetch(`https://localhost:5148/api/User/${username}`, {
                method: "GET",
                credentials: "include",
            })
                .then((response) => response.json())
                .then((data) => setUserProfile(data))
                .catch((error) => console.error("Erro ao buscar perfil:", error));
        }
    }, [user, username])

    return (
        <>
            <Navbar />
            <h1>Perfil</h1>
            <h2>{username}</h2>
            <img src={userProfile?.profilePic} alt="" />
            <p>Nome: {userProfile?.name} {userProfile?.lastName}</p>
            <p>Email: {userProfile?.email}</p>
            <button style={{ marginTop: 125 }} onClick={handleLogout}>
                Logout
            </button>
        </>
    );
}
