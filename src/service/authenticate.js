import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { STATECONTEXT } from "../App";

export function useRole() {
    const [globalState, setGlobalState] = useContext(STATECONTEXT);
    const [user, setUser] = useState();

    useEffect(() => {
        if (globalState.user) {
            setUser(globalState.user);
        }
        else {
            axios.get(globalState.appServer + globalState.api.hasLoggedIn, { withCredentials: true })
                .then(response => response.data)
                .then(data => {
                    setUser(data);
                    setGlobalState({ ...globalState, user: data});
                })
                .catch(error => {
                    setUser({})
                    setGlobalState({ ...globalState, user: {}});
                });
        }
    }, [globalState.user]);

    return user;
}