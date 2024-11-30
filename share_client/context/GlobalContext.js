import { createContext, useContext, useEffect, useState } from "react";
import { GetCurrentUser } from "../lib/appwrite";
import { Alert } from "react-native";

const GlobalContext = createContext()

export const useGlobalContext = () => useContext(GlobalContext)

export const GlobalProvider = ({ children }) => {
    const [isLoggedIn, setIsLogged] = useState(false)
    const [user, setUser] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        GetCurrentUser().then((res) => {
            if (res) {
                setIsLogged(true)
                setUser(res)
            } else {
                setIsLogged(false)
                setUser(null)
            }
        }).catch((err) => {
            Alert.alert("Can't Get Current User", err.message || "Not Able to get the user")
            console.log(err)
        }).finally(() => {
            setIsLoading(false)
        })
    }, [])

    return (
        <GlobalContext.Provider
            value={{ isLoading, setIsLoading, isLoggedIn, setIsLogged, user, setUser }}>
            {children}
        </GlobalContext.Provider >
    )
}