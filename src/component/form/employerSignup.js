import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../css/employerSignup.css";
import PasswordRegister from "../elements/passwordRegister.js";
import { useContext } from "react";
import { STATECONTEXT } from "../../App";

function EmployerSignup(props) {
    const [globalState, setGlobalState] = useContext(STATECONTEXT);
    const navigate = useNavigate();

    const submit = (event) => {
        let formData = new FormData(document.employerSignupForm);
        if (validateForm()) {
            event.target.disabled = true;
            axios({
                method: 'post',
                url: globalState.appServer + globalState.api.employerSignup,
                data: formData
            }).then((response) => {
                if (response.data === 1) {
                    alert("Thành công");
                    navigate(globalState.links.loginLink);
                }
                else if (response.data === -2) {
                    var emailElement = document.getElementsByName("email")[0];
                    emailElement.setCustomValidity("Email đã tồn tại. Vui lòng thử email khác");
                    emailElement.reportValidity();
                }
            }).catch((error) => {
                alert("Có lỗi xảy ra. Vui lòng thử lại sau");
            }).finally(() => {
                event.target.disabled = false;
            })
        }
    }

    const validateForm = () => {
        const inputNames = ["firstName", "lastName", "areaCode", "phoneNumber", "email", "password"];
        for (var name of inputNames) {
            var input = document.getElementsByName(name)[0];
            if (input.validity.patternMismatch || input.validity.patternMismatch || input.validity.valueMissing) {
                input.setCustomValidity("Giá trị không hợp lệ!");
                input.reportValidity();
                return false;
            }
        }
        return true;
    }

    return (
        <div className="employer-signup">
            <form name="employerSignupForm">
                <div className="employer-signup-first-name">
                    <label>Họ và tên đệm</label>
                    <input type="text" name="firstName" pattern=".{1,45}" required></input>
                </div>
                <div className="employer-signup-last-name">
                    <label>Tên</label>
                    <input type="text" name="lastName" pattern=".{1,45}" required></input>
                </div>
                <div className="employer-signup-phone-number">
                    <label>Số điện thoại</label>
                    <br />
                    <select className="employer-signup-phone-number-area-code" name="areaCode">
                        {/* {
                            globalState.countries.map(
                                country => <option>{country.areaCode}</option>
                            )
                        } */}
                        <option>+84</option>
                    </select>
                    <input type="text" className="employer-signup-phone-number-1" name="phoneNumber" pattern="[0-9]{1,15}" required></input>
                </div>
                <div className="employer-signup-email">
                    <label>Email</label>
                    <input type="email" name="email" required></input>
                </div>
                <PasswordRegister id="employer-signup-password-register" name="password" />
                <button className="employer-signup-button" type="button" onClick={submit}>Đăng ký</button>
            </form>
            <div className="employer-signup-extra-services">
                <a href="">Bạn đã có tài khoản?</a>
            </div>
        </div>
    )

}

export default EmployerSignup;