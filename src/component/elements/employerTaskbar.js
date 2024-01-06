import React, { useContext, useEffect, useState } from "react";
import Button from "./button";
import "../../css/employerTaskbar.css";
import { STATECONTEXT } from "../../App";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useRole } from "../../service/authenticate";
import { useCookies } from "react-cookie";
import Notifications from "./notifications";


function EmployerTaskbar(props) {
    const [globalState, setGlobalState] = useContext(STATECONTEXT);
    const [notReadMailNum, setNotReadMailNum] = useState(0);
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const user = useRole();
    const [cookies, setCookies, removeCookie] = useCookies();

    const getNotifications = () => {
        axios.get(globalState.appServer + globalState.api.employerGetNotifications, { withCredentials: true })
            .then(response => response.data ? response.data : [])
            .then(data => {
                setNotifications(data);
                console.log(data);
            });
    }

    useEffect(() => {
        if (user && user.role !== "ROLE_EMPLOYER") {
            navigate(globalState.links.homeLink);
        }
        if (user && user.role === "ROLE_EMPLOYER") {
            getNotifications();
        }
    }, [user])

    const logout = () => {
        if (window.confirm("bạn có muốn đăng xuất không?")) {
            removeCookie("Authorization");
            setGlobalState({ ...globalState, user: {} });
            navigate(globalState.links.loginLink);
        }
    }

    return (
        <div className="employer-taskbar">
            <div className="employer-taskbar-left">
                <Link to={globalState.links.employerHomeLink}>
                    <div className="employer-taskbar-home">
                        <div className="employer-taskbar-logo"></div>
                    </div>
                </Link>
                <Link to={globalState.links.recruitmentManagementLink}>
                    <button id="employer-taskbar-recruitment">
                        <i className="bi bi-receipt"></i>
                        Tin tuyển dụng
                    </button>
                </Link>
                <Link to={globalState.links.employerApplicationManagementLink}>
                    <button id="employer-taskbar-mail">
                        <i className="bi bi-envelope"></i>
                        Hòm thư
                        {notReadMailNum > 0 ?
                            <div className="not-read-mail-number">{notReadMailNum}</div>
                            : undefined}
                    </button>
                </Link>
                {/* <button id="employer-taskbar-cv">
                <i className="bi bi-person-lines-fill"></i>
                CV đã lưu
            </button> */}
                <div className="employer-taskbar-notifications">
                    {
                        notifications.map(notification =>
                            <Link to={notification.link}>
                                <div>
                                    <div>notification.message</div>
                                    <div>notification.time</div>
                                </div>
                            </Link>
                        )
                    }
                </div>
            </div>
            <div className="employer-taskbar-right">
                <Notifications />
                <div className="employer-taskbar-account"
                // onMouseOver={() => { document.getElementsByClassName("task-bar-account-options")[0].style.visibility = "visible" }}
                // onMouseOut={() => { document.getElementsByClassName("task-bar-account-options")[0].style.visibility = "hidden" }}
                >
                    <i id="employer-taskbar-account-avatar" className="bi bi-person-circle"></i>
                    {
                        user && user.role === "ROLE_EMPLOYER" &&
                        <>
                            <div className="task-bar-username">
                                {user && user.profile.firstName + " " + user.profile.lastName}
                            </div>
                            <i className="bi bi-box-arrow-right logout-icon" onClick={logout}></i>
                        </>
                    }
                </div>
            </div>

        </div>
    );
}

export default EmployerTaskbar;