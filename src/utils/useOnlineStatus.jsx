import { useEffect, useState } from "react"
import apiService from "../apiService"

const useOnlineStatus = () => {
    const [onlineStatus , setOnlineStatus] = useState(true)

    useEffect(()=>{
            window.addEventListener('offline',()=>{
                console.log('not working')

                apiService.get('updateOnlineStatus')
                setOnlineStatus(false)
            })
        window.addEventListener('online',()=>{
            console.log('working')
            setOnlineStatus(true)
        })
    },[])
    return onlineStatus
}

export default useOnlineStatus;