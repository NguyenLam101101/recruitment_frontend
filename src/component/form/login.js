import React, { useRef, useState } from "react";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { STATECONTEXT } from "../../App";
import "../../css/login.css";
import axios from "axios";
import { useCookies } from "react-cookie";

function Login(props) {
    const [globalState, setGlobalState] = useContext(STATECONTEXT);
    const [cookie, setCookie] = useCookies([])
    const loginForm = useRef();
    const navigate = useNavigate();
    const [isInvalid, setIsInValid] = useState(false);

    const doLogin = () => {
        let formData = new FormData(loginForm.current);
        axios.post(globalState.appServer + "/login", formData)
            .then(response => response.data)
            .then(data => {
                setCookie("Authorization", "Bearer " + data.token, { path: "/" });
                setGlobalState({ ...globalState, user: data.user });
                setIsInValid(false);
                if (data.user.role === "ROLE_EMPLOYEE")
                    navigate(globalState.links.homeLink);
                if (data.user.role === "ROLE_EMPLOYER")
                    axios.get(globalState.appServer + globalState.api.hasCompany, { withCredentials: true })
                        .then(response => response.data)
                        .then(data => {
                            if (data)
                                navigate(globalState.links.employerHomeLink);
                            else
                                navigate(globalState.links.companyRegisterLink);
                        })
            })
            .catch(error => setIsInValid(true));
    }

    return (
        <div className="login">
            <div className="login-logo">Đăng nhập vào TechCV</div>
            <form name="login-form" ref={loginForm} onKeyDown={(event) => {
                if(event.keyCode === 13)
                    doLogin();
            }}>
                <div className="login-email">
                    <input type="email" placeholder="Email" name="email" required></input>
                </div>
                <div className="login-password">
                    <input type="password" placeholder="Mật khẩu" name="password" required></input>
                </div>
                {
                    isInvalid &&
                    <div className="invalid-message">Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại!</div>
                }
                <button className="login-button"
                    type="button"
                    onClick={doLogin}
                    tabIndex="0"
                    onKeyDown={(event) => {
                        if (event.enterKey)
                            doLogin();
                    }}>Login</button>
            </form>
            <div className="login-extra-services">
                <div><a href="">Quên mật khẩu?</a></div>
                <div><Link to={globalState.links.signupLink}>Bạn chưa có tài khoản?</Link></div>
            </div>
        </div>
    )
}

export default Login;