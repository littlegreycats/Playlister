import { useContext } from 'react'
import HomeScreen from './HomeScreen'
import SplashScreen from './SplashScreen'
import AuthContext from '../auth'
import GuestHomeScreen from './GuestHomeScreen'

export default function HomeWrapper() {
    const { auth } = useContext(AuthContext);
    console.log("HomeWrapper auth.loggedIn: " + auth.loggedIn);
    console.log("HomeWrapper auth.guestMode: " + auth.guestMode);
    
    if (auth.guestMode)
        return <GuestHomeScreen />
    else if (auth.loggedIn)
        return <HomeScreen />
    else
        return <SplashScreen />
}