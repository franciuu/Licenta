import {createContext, useContext, useState, useEffect} from "react";
import axios from "axios";

export const UserContext = createContext();

export const UserProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    
    const login = async (email, password) => {
        try {
            const response = await axios.post("http://localhost:5000/login", {
                email,
                password,
            });

            setUser(response.data); 
            console.log(user);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.msg || "An unexpected error occurred");
            setUser(null);
        }
    };
    const fetchUser = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get("http://localhost:5000/me");
            setUser(response.data);
        } catch (err) {
            setUser(null); 
        } finally {
            setIsLoading(false); 
        }
    };
    const logout = async () => {
        try {
            await axios.delete("http://localhost:5000/logout");
            setUser(null);
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };
    useEffect(() => {
        fetchUser();
    }, []);
    return (
        <UserContext.Provider value={{ user, login, logout, error, isLoading }}>
            {children}
        </UserContext.Provider>
    );
};
export const useUser = () => useContext(UserContext);