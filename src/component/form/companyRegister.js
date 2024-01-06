import React, { useContext, useRef } from "react";
import AddressInput from "../elements/addressInput";
import ImageUpload from "../elements/imageUpload";
import "../../css/companyRegister.css"
import { STATECONTEXT } from "../../App";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CompanyRegister(props) {
    const [globalState, setGlobalState] = useContext(STATECONTEXT);
    const companyRegisterForm = useRef();
    const logoElement = useRef();
    const navigate = useNavigate();

    const submit = () => {
        let formData = new FormData(companyRegisterForm.current);
        logoElement.current.toBlob(blob => {
            let file = new File([blob], "logo.png", { type: "image/png" });
            formData.append("logo", file);
            axios.post(globalState.appServer + "/employer/register-company", formData, { withCredentials: true })
                .then(response => {
                    alert("Thành công");
                    navigate(globalState.links.employerHomeLink);

                })
                .catch(error => {
                    if (error.response.status === 401) {
                        alert("Vui lòng đăng nhập");
                        navigate(globalState.links.loginLink);
                    } else {
                        console.error(error);
                        alert("Có lỗi xảy ra. Vui lòng thử lại sau!");
                    }
                });
        }, "image/png");
    }

    return (
        <div className="company-register">
            <div className="company-register-title">Công ty của bạn</div>
            <form ref={companyRegisterForm}>
                <ImageUpload ref={logoElement} width="100" height="100" />
                <div className="company-register-information">
                    <div className="company-register-name">
                        <label>Tên công ty</label>
                        <input type="text" name="name" required></input>
                    </div>
                    <div className="company-register-field">
                        <label>Lĩnh vực hoạt động</label>
                        <select name="field">
                            <option>Công nghệ thông tin</option>
                            <option>Bất động sản</option>
                            <option>Bán lẻ và phân phối</option>
                            <option>Vận tải và logistic</option>
                            <option>Nông nghiệp</option>
                            <option>Công nghiệp và dịch vụ</option>
                            <option>Tài chính</option>
                            <option>Ngân hàng</option>
                            <option>Giáo dục</option>
                            <option>Khác</option>
                        </select>
                    </div>
                    <AddressInput name="districtId" />
                    <div className="company-register-tax-code">
                        <label>Mã số thuế</label>
                        <input type="text" name="taxCode" required></input>
                    </div>
                    <div className="company-register-size">
                        <label>Quy mô</label>
                        <select name="size" required>
                            <option>&lt; 1000 người</option>
                            <option>1000 - 5000 người</option>
                            <option>5000 - 10000 người</option>
                            <option>10000 - 20000 người</option>
                            <option>20000 - 50000 người</option>
                            <option>&#62; 50000 người</option>
                        </select>
                    </div>
                    <div className="company-register-email">
                        <label>Email</label>
                        <input type="email" name="email"></input>
                    </div>
                    <div className="company-register-website">
                        <label>Link website</label>
                        <input type="text" name="website"></input>
                    </div>
                    <div className="company-register-description">
                        <label>Mô tả về công ty của bạn</label>
                        <textarea required name="description"></textarea>
                    </div>
                    <button className="company-register-button" type="button" onClick={submit}>Đăng ký</button>
                </div>
            </form>
        </div>
    )

}

export default CompanyRegister;