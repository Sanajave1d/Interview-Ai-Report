import { useContext } from "react";
import { register, login , logout, getMe } from '../services/auth.api'
import { AuthContext } from "../auth.context";
import { useEffect } from "react";


export const useAuth =()=>{
    const context = useContext(AuthContext)
    const {user, setUser, loading, setLoading} = context

    const handleLogin = async({username, email , password})=>{
        setLoading(true)
        try{
            const data = await login({username, email , password})
        setUser(data)
        }catch(error){
            console.log(error)
        }finally{
            setLoading(false)
        }
    }

    const handleRegister = async ({username , email , password})=>{
        setLoading(true)
        console.log(username, email, password)
        try{
            const data = await register({username, email, password})
            setUser(data)
        }catch(error){
            console.log(error)
        }finally{
            setLoading(false)
        }
    }

    const handleLogout = async ()=>{
        setLoading(true)
        try{
            const data = await logout()
            setUser(null)
        }catch(error){
            console.log(error)
        }finally{
            setLoading(false)
        }
    }

    useEffect(()=>{
        const getAndSetUser = async()=>{
            try{
                const data = await getMe()
                setUser(data)
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        }
        getAndSetUser()
    },[])


    return {user, loading, handleLogin,handleRegister , handleLogout} 
}
