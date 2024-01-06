import React from "react";
import EmployerSignup from "../form/employerSignup";
import "../../css/employerSignupPage.css";

function EmployerSignupPage(props) {
    return (
        <div className="employer-signup-page">
            <div className="employer-signup-page-1">
                <div className="employer-signup-page-logo">
                    <img src={require("../../images/logo.png")}></img>
                    Trở thành nhà tuyển dụng ngay với TECHCV
                </div>
                <EmployerSignup />
            </div>
        </div>
    )
}

export default EmployerSignupPage;