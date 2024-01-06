import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import { STATECONTEXT } from "../../App";
import Button from "../elements/button";

export default function CvContentPage(props) {
    const [globalState, setGlobalState] = useContext(STATECONTEXT);
    const {id} = useParams();
    const [src, setSrc] = useState("");
    
    useEffect(() => {
        axios.get(globalState.appServer + globalState.api.getCvById + "?id=" + id, {withCredentials: true})
            .then(response => setSrc(response.data));
    }, [])


    return (
        <div className="cv-content-page" 
            style={{position: "fixed", top: '0', left: '0', right: '0', bottom: '0'}}>
            <iframe src={src} width="100%" height="100%"></iframe>
        </div>
    );
}
