import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import AddressInput from "../elements/addressInput";
import "../../css/employeeSignup.css";
import PasswordRegister from "../elements/passwordRegister";
import { Link, useNavigate } from "react-router-dom";
import { STATECONTEXT } from "../../App";

function EmployeeSignup(props) {
    const [globalState, setGlobalState] = useContext(STATECONTEXT);
    const navigate = useNavigate();

    const submit = (event) => {
        let formValidation = validateForm();
        if (formValidation) {
            event.target.disabled = true;
            let form = document.getElementById("employee-signup-form");
            let formData = new FormData(form);
            axios({
                method: 'post',
                url: globalState.appServer + globalState.api.employeeSignup,
                data: formData
            }).then((response) => {
                if (parseInt(response.data) === 1) {
                    alert("Thành công");
                    navigate(globalState.links.loginLink);
                } else if (response.data === -2) {
                    let email = document.getElementsByClassName("employee-signup-email-input")[0];
                    email.setCustomValidity("Email này đã được sử dụng, vui lòng chọn 1 email khác");
                    email.reportValidity();
                }
            }).catch((error) => {
                alert("Có lỗi xảy ra. Vui lòng thử lại sau!")
            }).finally(() => {
                event.target.disabled = false;
            })
        }
    }

    const validateForm = () => {
        let firstName = document.employeeSignupForm.firstName;
        let lastName = document.employeeSignupForm.lastName;
        // let dateOfBirth = document.employeeSignupForm.dateOfBirth;
        // let phoneNumber = document.employeeSignupForm.phoneNumber;
        let email = document.employeeSignupForm.email;
        let password = document.getElementsByClassName("password-register-password-input")[0];
        let confirmedPassword = document.getElementsByClassName("password-register-confirmed-password-input")[0];

        if (firstName.validity.valueMissing) {
            firstName.setCustomValidity("Không được để trống");
            firstName.reportValidity();
            return false;
        }
        if (firstName.validity.patternMismatch) {
            firstName.setCustomValidity("Chỉ bao gồm các chữ cái");
            firstName.reportValidity();
            return false;
        }

        if (lastName.validity.valueMissing) {
            lastName.setCustomValidity("Không được để trống");
            lastName.reportValidity();
            return false;
        }
        if (lastName.validity.patternMismatch) {
            lastName.setCustomValidity("Chỉ bao gồm các chữ cái");
            lastName.reportValidity();
            return false;
        }

        // if (dateOfBirth.validity.valueMissing) {
        //     dateOfBirth.setCustomValidity("Không được bỏ trống");
        //     dateOfBirth.reportValidity();
        //     return false;
        // }

        // if (phoneNumber.validity.valueMissing) {
        //     phoneNumber.setCustomValidity("Không được bỏ trống");
        //     phoneNumber.reportValidity();
        //     return false;
        // }
        // if (phoneNumber.validity.patternMismatch) {
        //     phoneNumber.setCustomValidity("Chỉ bao gồm các chữ số, không quá 15 ký tự");
        //     phoneNumber.reportValidity();
        //     return false;
        // }

        if (email.validity.valueMissing) {
            email.setCustomValidity("Không được bỏ trống");
            email.reportValidity();
            return false;
        }
        if (email.validity.patternMismatch) {
            email.setCustomValidity("Vui lòng nhập đúng định dạng");
            email.reportValidity();
            return false;
        }

        if (password.validity.valueMissing) {
            password.setCustomValidity("Không được bỏ trống");
            password.reportValidity();
            return false;
        }
        if (password.validity.patternMismatch) {
            return false;
        }

        if (confirmedPassword.value !== password.value) {
            return false;
        }
        return true;
    }

    return (
        <div className="employee-signup">
            <div className="employee-signup-title">Đăng ký ngay</div>
            <form id="employee-signup-form" name="employeeSignupForm">
                <div className="employee-signup-first-name">
                    <label>Họ và tên đệm</label>
                    <input type="text" pattern=".{1,45}" required name="firstName"></input>
                </div>
                <div className="employee-signup-last-name">
                    <label>Tên</label>
                    <input type="text" pattern=".{1,45}" required name="lastName"></input>
                </div>
                <div className="employee-signup-gender">
                    <label>Nam</label>
                    <input type="radio" name="gender" value="1" defaultChecked></input>
                    <label>Nữ</label>
                    <input type="radio" name="gender" value="0"></input>
                </div>
                <div className="employee-signup-year-of-birth">
                    <label>Năm sinh</label>
                    <select name="yearOfBirth" required>
                        {
                            Array.from({length: 100}).map((_, index) => <option>{index+new Date().getFullYear()-100}</option>)
                        }
                    </select>
                </div>
                {/* <div className="employee-signup-phone-number">
                        <label>Số điện thoại</label>
                        <br />
                        <select className="employee-signup-phone-number-area-code-input" name="areaCode">
                            {
                                globalState.countries.map(
                                    country => <option>{country.areaCode}</option>
                                )
                            }
                        </select>
                        <input type="text" pattern="[0-9]{1,15}" className="employee-signup-phone-number-input" name="phoneNumber" required></input>
                    </div>
                    <AddressInput id="employee-signup-address" name="districtId" /> */}
                <div className="employee-signup-email">
                    <label>Email</label>
                    <input type="email" className="employee-signup-email-input" name="email" required></input>
                </div>
                <PasswordRegister name="password" />
                <button className="employee-signup-button" type="button" onClick={submit}>Đăng ký</button>
            </form>
            <div className="employee-signup-extra-services">
                <div><Link to={globalState.links.loginLink}>Bạn đã có tài khoản?</Link></div>
                <div><Link to={globalState.links.employerSignupLink}>Bạn là nhà tuyển dụng?</Link></div>
            </div>
        </div>
    )
}

export default EmployeeSignup;