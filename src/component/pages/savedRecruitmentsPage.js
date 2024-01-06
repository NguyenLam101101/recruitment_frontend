import { useContext, useEffect, useState } from "react";
import TaskBar from "../elements/taskbar";
import { STATECONTEXT } from "../../App";
import axios from "axios";
import Recruitment from "../elements/recruitment";
import "../../css/savedRecruitmentsPage.css";

export default function SavedRecuitmentsPage(props){
    const [globalState, setGlobalState] = useContext(STATECONTEXT);
    const [recruitments, setRecruitments] = useState([]);

    useEffect(() => {
        axios.get(globalState.appServer + globalState.api.getSavedRecruitments, {withCredentials: true})
        .then(response => response.data ? response.data : [])
        .then(data => setRecruitments(data));
    }, []);

    return(
        <div className="saved-recruitments-page">
            <TaskBar />
            <div className="saved-recruitments-page-content">
            {
                recruitments.map(recruitment => <Recruitment recruitment={recruitment} />)
            }
            </div>
        </div>
    )
}