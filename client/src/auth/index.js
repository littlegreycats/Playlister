import React, { createContext, useEffect, useState } from "react";
import { useHistory } from 'react-router-dom'
import api from './auth-request-api'

const AuthContext = createContext();
console.log("create AuthContext: " + AuthContext);

// THESE ARE ALL THE TYPES OF UPDATES TO OUR AUTH STATE THAT CAN BE PROCESSED
export const AuthActionType = {
    GET_LOGGED_IN: "GET_LOGGED_IN",
    LOGIN_USER: "LOGIN_USER",
    LOGOUT_USER: "LOGOUT_USER",
    REGISTER_USER: "REGISTER_USER",
    OPEN_LOGIN_ERR_MODAL: 'OPEN_LOGIN_ERR_MODAL',
    CLOSE_LOGIN_ERR_MODAL: 'CLOSE_LOGIN_ERR_MODAL',
    LOGIN_GUEST: 'LOGIN_GUEST',
}

function AuthContextProvider(props) {
    const [auth, setAuth] = useState({
        user: null,
        loggedIn: false,
        modalMessage: null,
        guestMode: false,
    });
    const history = useHistory();

    useEffect(() => {
        auth.getLoggedIn();
    }, []);

    const authReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case AuthActionType.GET_LOGGED_IN: {
                return setAuth({
                    user: payload.user,
                    loggedIn: payload.loggedIn,
                    modalMessage: null,
                    guestMode: payload.guestMode,
                });
            }
            case AuthActionType.LOGIN_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true,
                    modalMessage: null,
                    guestMode: false,
                })
            }
            case AuthActionType.LOGOUT_USER: {
                return setAuth({
                    user: null,
                    loggedIn: false,
                    modalMessage: null,
                    guestMode: false,
                })
            }
            case AuthActionType.REGISTER_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true,
                    modalMessage: null,
                    guestMode: false,
                })
            }
            case AuthActionType.OPEN_LOGIN_ERR_MODAL: {
                return setAuth({
                    user: auth.user,
                    loggedIn: false,
                    modalMessage: payload.message,
                    guestMode: false,
                })
            }
            case AuthActionType.CLOSE_LOGIN_ERR_MODAL: {
                return setAuth({
                    user: auth.user,
                    loggedIn: false,
                    modalMessage: null,
                    guestMode: false,
                })
            }
            case AuthActionType.LOGIN_GUEST: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true,
                    modalMessage: null,
                    guestMode: true,
                })
            }
            default:
                return auth;
        }
    }

    auth.getLoggedIn = async function () {
        const response = await api.getLoggedIn();
        if (response.status === 200) {
            authReducer({
                type: AuthActionType.SET_LOGGED_IN,
                payload: {
                    loggedIn: response.data.loggedIn,
                    user: response.data.user
                }
            });
        }
    }

    auth.registerUser = async function(firstName, lastName, email, password, passwordVerify) {
        try {
            const response = await api.registerUser(firstName, lastName, email, password, passwordVerify);      
            if (response.status === 200) {
                authReducer({
                    type: AuthActionType.REGISTER_USER,
                    payload: {
                        user: response.data.user
                    }
                })
                auth.loginUser(email, password)
            }
        } catch (err) {
            authReducer({
                type: AuthActionType.OPEN_LOGIN_ERR_MODAL,
                payload: { message: err.response.data.errorMessage },
            })
        }
    }

    auth.loginUser = async function(email, password) {
        try { 
            const response = await api.loginUser(email, password);
            if (response.status === 200) {
                authReducer({
                    type: AuthActionType.LOGIN_USER,
                    payload: {
                        user: response.data.user
                    }
                })
                history.push("/");
            } else {
                console.log('failed')
                history.push("/");
            }
        } catch (err) {
            authReducer({
                type: AuthActionType.OPEN_LOGIN_ERR_MODAL,
                payload: { message: err.response.data.errorMessage },
            })
        }
    }

    auth.continueAsGuest = async function() {
        console.log('continue as guest')
        try {
            const response = await api.continueAsGuest()
            console.log(response)
            if (response.status === 200) {
                console.log('logging in guest...')
                authReducer({
                    type: AuthActionType.LOGIN_GUEST,
                    payload: {
                        user: response.data.user
                    }
                })
                history.push("/");
            } else {
                console.log('failed')
                history.push("/");
            }
        } catch (err) {
            console.log(err)
        }
        history.push(`/`)
    }

    auth.logoutUser = async function() {
        const response = await api.logoutUser();
        console.log(response.status)
        if (response.status === 200) {
            authReducer( {
                type: AuthActionType.LOGOUT_USER,
                payload: null
            })
            history.push("/");
        }
    }

    auth.getUserInitials = function() {
        let initials = "";
        if (auth.user) {
            initials += auth.user.firstName.charAt(0);
            initials += auth.user.lastName.charAt(0);
        }
        console.log("user initials: " + initials);
        return initials;
    }

    auth.closeModal = function() {
        authReducer({
            type: AuthActionType.CLOSE_LOGIN_ERR_MODAL,
            payload: null,
        })
    }

    return (
        <AuthContext.Provider value={{
            auth
        }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
export { AuthContextProvider };