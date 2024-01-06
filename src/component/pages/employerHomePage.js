import { useState, useEffect, useRef, useContext, useLayoutEffect } from "react";
import EmployerTaskbar from "../elements/employerTaskbar";
import "../../css/employerHomePage.css";
import PostRecruitment from "../form/postRecruitment";
import axios from "axios";
import { STATECONTEXT } from "../../App";
import { useNavigate } from "react-router-dom";
import { useRole } from "../../service/authenticate";
import CvSearch from "../form/cvSearch";


function EmployerHomePage(props) {
    const [globalState, setGlobalState] = useContext(STATECONTEXT);
    const navigate = useNavigate();
    const user = useRole();

    useEffect(() => {
        if (user && user.role !== "ROLE_EMPLOYER") {
            navigate(globalState.links.loginLink);
        }
    }, [user]);

    return (
        <div className="employer-home-page">
            <EmployerTaskbar />
            <div className="employer-home-page-content">
                <CvSearch />
            </div>
        </div>
    )
}

export default EmployerHomePage;