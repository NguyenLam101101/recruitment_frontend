import React, { useEffect, useState } from "react";
import "../../css/taskbar.css"
import { useContext } from "react";
import { STATECONTEXT } from "../../App";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useRole } from "../../service/authenticate";
import axios from "axios";
import Notifications from "./notifications";

function TaskBar(props) {
    const [globalState, setGlobalState] = useContext(STATECONTEXT);
    const [cookies, setCookies, removeCookie] = useCookies();
    const navigate = useNavigate();
    const user = useRole();

    const logout = () => {
        if (window.confirm("Bạn có muốn đăng xuất không?")) {
            removeCookie("Authorization");
            setGlobalState({ ...globalState, user: {} });
            navigate(globalState.links.loginLink);
        }
    }

    return (
        <div className="taskbar">
            <div className="taskbar-home">
                <Link to={globalState.links.homeLink}>
                    <div className="taskbar-logo"></div>
                </Link>
            </div>
            {/* <Button id="taskbar-news" icon="bi bi-receipt" text="Tin tức" href={globalState.links.newsLink} /> */}
            <div className="taskbar-left">
                <Link to={globalState.links.cvPageLink}>
                    <button id="taskbar-cv">
                        <i className="bi bi-clipboard-check"></i>
                        CV của tôi
                    </button>
                </Link>
                <Link to={globalState.links.employeeApplicationManagementLink}>
                    <button id="taskbar-mail">
                        <i className="bi bi-envelope"></i>
                        Đã ứng tuyển
                    </button>
                </Link>
                <Link to={globalState.links.savedRecruitmentsLink}>
                    <button id="taskbar-saved-recruitments">
                        <i className="bi bi-envelope"></i>
                        Tin đã lưu
                    </button>
                </Link>
            </div>
            <div className="taskbar-right">
                {
                    user && user.role === "ROLE_EMPLOYEE" &&
                    <Notifications />
                }
                <div className="taskbar-account">
                    <i id="taskbar-account-avatar" className="bi bi-person-circle"></i>
                    {
                        user && user.role &&
                        <>
                            <div className="task-bar-username">
                                {user && user.profile.firstName + " " + user.profile.lastName}
                            </div>
                            <i className="bi bi-box-arrow-right logout-icon" onClick={logout}></i>
                        </>
                    }
                    {
                        user && !user.role &&
                        <>
                            <div className="taskbar-account-options">
                                <Link to={globalState.links.signupLink}>
                                    <button className="taskbar-account-signup">
                                        <i className="bi bi-person-add"></i>
                                        Đăng ký
                                    </button>
                                </Link>
                                <Link to={globalState.links.loginLink}>
                                    <button className="taskbar-account-signup">
                                        <i className="bi bi-box-arrow-in-right"></i>
                                        Đăng nhập
                                    </button>
                                </Link>
                            </div>
                        </>
                    }
                </div>
            </div>

        </div>
    )
}

export default TaskBar;