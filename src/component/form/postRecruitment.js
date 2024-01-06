import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import MultiObjectsInput from "../elements/multiObjectsInput";
import Button from "../elements/button";
import ImageUpload from "../elements/imageUpload";
import AddressInput from "../elements/addressInput";
import "../../css/postRecruitment.css";
import { STATECONTEXT } from "../../App";
import { useNavigate } from "react-router-dom";

function PostRecruitment(props) {
    const [globalState, setGlobalState] = useContext(STATECONTEXT);
    const [skills, setSkills] = useState([]);
    const [domains, setDomains] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const postRecruitmentForm = useRef();
    const navigate = useNavigate();
    const skillElement = useRef();
    const domainElement = useRef();
    const [validation, setValidation] = useState({
        name: true,
        position: true,
        workType: true,
        experience: true,
        employeeNumber: true,
        province: true,
        detail: true,
        wage: true,
        endDate: true,
        description: true,
        requirement: true,
        interest: true
    });

    useEffect(() => {
        //province
        if (globalState.provinces)
            setProvinces(globalState.provinces);
        else
            axios.get(globalState.appServer + globalState.api.getProvinces)
                .then(response => response.data ? response.data : [])
                .then(data => {
                    setProvinces(data);
                    setGlobalState({ ...globalState, provinces: data });
                })

        //skill
        if (globalState.skills !== undefined)
            setSkills(globalState.skills);
        else {
            axios.get(globalState.appServer + "/get-skills")
                .then(response => (response.data !== undefined) ? response.data : [])
                .then(data => {
                    setGlobalState({ ...globalState, skills: data });
                    setSkills(data);
                })
        }

        //domain
        if (globalState.domains !== undefined)
            setDomains(globalState.domains);
        else {
            axios.get(globalState.appServer + "/get-domains")
                .then(response => (response.data !== undefined) ? response.data : [])
                .then(data => {
                    setGlobalState({ ...globalState, domains: data });
                    setDomains(data);
                })
        }
    }, []);

    const submit = () => {
        if (validateForm()) {
            let formData = new FormData(postRecruitmentForm.current);
            formData.set("domains", domainElement.current.getValue());
            formData.set("skills", skillElement.current.getValue());

            // formData.set("wage", postRecruitmentForm.current.wage.value.trim() + " " + postRecruitmentForm.current.currency.value.trim())
            axios.post(globalState.appServer + "/employer/post-recruitment",
                formData,
                { withCredentials: true })
                .then(response => response.data)
                .then(data => {
                    if (data === 1) {
                        alert("Đã đăng thành công");
                        props.success();
                    } else if (data === -1) {
                        alert("Vui lòng đăng nhập");
                        navigate(globalState.links.homeLink);
                    }
                })
                .catch(error => {
                    console.error(error);
                    alert("Có lỗi xảy ra. Vui lòng thử lại");
                    props.cancel();
                });
        }
    }

    const updateRecruitment = () => {
        if (validateForm()) {
            let formData = new FormData(postRecruitmentForm.current);

            formData.set("recruitmentId", props.recruitment.id);
            formData.set("domains", domainElement.current.getValue());
            formData.set("skills", skillElement.current.getValue());

            axios.post(globalState.appServer + "/employer/update-recruitment",
                formData,
                { withCredentials: true })
                .then(response => {
                    alert("Đã cập nhật!");
                    props.success();
                })
                .catch(error => {
                    console.error(error);
                    alert("Có lỗi xảy ra. Vui lòng thử lại");
                    props.cancel();
                });
        }
    }

    const validateForm = () => {
        let validation1 = { ...validation };
        let valid = true;
        for (let key in validation1) {
            validation1[key] = true;
            if (!postRecruitmentForm.current[key].checkValidity()) {
                validation1[key] = false;
                valid = false;
            }
        }
        setValidation(validation1);
        return valid;
    }

    return (
        <div className="post-recruitment">
            <form name="postRecruitmentForm" ref={postRecruitmentForm}>
                <div className="post-recruitment-name">
                    <label className="required-label">Đặt tên cho tin tuyển dụng</label>
                    <input type="text" name="name" pattern=".{1,200}" required
                        defaultValue={props.recruitment !== undefined ? props.recruitment.name : ""} />
                    {!validation.name && <p className="error-message">Trường này không được bỏ trống</p>}
                </div>
                <div className="post-recruitment-main-information">
                    <div className="post-recruitment-main-information-title">THÔNG TIN CHÍNH</div>
                    <div className="post-recruitment-item post-recruitment-item--address">
                        <label className="required-label">Địa chỉ</label>
                        <div className="post-recruitment-address-input-container">
                            <select name="province" required>
                                {
                                    provinces.map(province => <option>{province.name}</option>)
                                }
                            </select>
                            {!validation.province && <p className="error-message">Trường này không được bỏ trống</p>}
                            <input type="text" name="detail" placeholder="phường/xã, đường, số nhà,..." required></input>
                            {!validation.detail && <p className="error-message">Trường này không được bỏ trống</p>}
                        </div>
                    </div>
                    <div className="post-recruitment-item post-recruitment-item--position">
                        <label className="required-label">Vị trí công việc</label>
                        <input type="text" name="position" pattern=".{1,200}" required
                            defaultValue={props.recruitment !== undefined ? props.recruitment.position : ""} />
                        {!validation.position && <p className="error-message">Trường này không được bỏ trống</p>}
                    </div>
                    <div className="post-recruitment-item post-recruitment-item--type">
                        <label className="required-label">Loại hình làm việc</label>
                        <select name="workType"
                            defaultValue={props.recruitment !== undefined ? props.recruitment.workType : ""}>
                            <option>Thực tập</option>
                            <option>Bán thời gian</option>
                            <option>Toàn thời gian</option>
                            <option>Freelance</option>
                        </select>
                        {!validation.workType && <p className="error-message">Trường này không được bỏ trống</p>}
                    </div>
                    <div className="post-recruitment-item post-recruitment-item--experience">
                        <label className="required-label">Số năm kinh nghiệm</label>
                        <input type="number" name="experience" min="0" max="50" required
                            defaultValue={props.recruitment !== undefined ? props.recruitment.experience : 0} />
                        {!validation.experience && <p className="error-message">Trường này không được bỏ trống</p>}
                    </div>
                    <div className="post-recruitment-item post-recruitment-item--employee-number">
                        <label className="required-label">Số lượng tuyển dụng</label>
                        <input type="number" name="employeeNumber" min="1" max="100000" required
                            defaultValue={props.recruitment !== undefined ? props.recruitment.employeeNumber : 1} />
                        {!validation.employeeNumber && <p className="error-message">Trường này không được bỏ trống</p>}
                    </div>
                    <div className="post-recruitment-item post-recruitment-item--wage">
                        <label className="required-label">Mức lương cho công việc</label>
                        <div className="post-recruitment-wage-input-container">
                            <input className="post-recruitment-wage-input" name="wage" type="text" required
                                defaultValue={props.recruitment !== undefined ? props.recruitment.wage : "Thỏa thuận"} />
                            {/* <select className="post-recruitment-wage-currency" name="currency">
                                <option></option>
                                <option>triệu</option>
                                <option>USD</option>
                            </select> */}
                            <select className="post-recruitment-wage-selection"
                                required
                                onChange={(event) => {
                                    var element = document.getElementsByClassName("post-recruitment-wage-input")[0];
                                    element.value = event.target.value;
                                    element.focus();
                                }}>
                                <option>Thỏa thuận</option>
                                <option>1 - 3</option>
                                <option>3 - 5</option>
                                <option>5 - 7</option>
                                <option>7 - 10</option>
                                <option>10 - 15</option>
                                <option>15 - 25</option>
                                <option>Trên 25 </option>
                            </select>
                        </div>
                        {!validation.wage && <p className="error-message">Trường này không được bỏ trống</p>}
                    </div>
                    <div className="post-recruitment-item post-recruitment-item--date">
                        <label className="required-label">Thời hạn tuyển dụng</label>
                        <input className="post-recruitment-end-date" name="endDate" type="date" required
                            defaultValue={props.recruitment !== undefined ? props.recruitment.endDate : ""} />
                        {!validation.endDate && <p className="error-message">Trường này không được bỏ trống</p>}
                    </div>
                    <MultiObjectsInput id="post-recruitment-domains"
                        objects={domains.map(domain => domain.name)}
                        label="Công việc phù hợp với lĩnh vực nào?"
                        name="domains"
                        ref={domainElement}
                        defaultValue={props.recruitment !== undefined ? props.recruitment.domains : []} />
                    {!validation.domain && <p className="error-message"></p>}
                    <MultiObjectsInput id="post-recruitment-skills"
                        objects={skills.map(skill => skill.name)}
                        label="Công việc yêu cầu những kỹ năng nào?"
                        name="skills"
                        ref={skillElement}
                        defaultValue={props.recruitment !== undefined ? props.recruitment.skills : []} />
                    {!validation.skills && <p className="error-message"></p>}
                </div>
                <div className="post-recruitment-detail-information">
                    <div className="post-recruitment-detail-information-title">THÔNG TIN CHI TIẾT</div>
                    <div className="post-recruitment-description">
                        <label className="required-label">Mô tả công việc</label>
                        <br />
                        <textarea id="post-recruitment-description-input" name="description" pattern='.{1,65000}' required
                            defaultValue={props.recruitment !== undefined ? props.recruitment.description : ""} />
                        {!validation.description && <p className="error-message">Trường này không được bỏ trống</p>}
                    </div>
                    <div className="post-recruitment-requirement">
                        <label className="required-label">Yêu cầu với ứng viên</label>
                        <br />
                        <textarea id="post-recruitment-requirement-input" name="requirement" pattern='.{1,65000}' required
                            defaultValue={props.recruitment !== undefined ? props.recruitment.requirement : ""} />
                        {!validation.requirement && <p className="error-message">Trường này không được bỏ trống</p>}
                    </div>
                    <div className="post-recruitment-interest">
                        <label className="required-label">Các quyền lợi của nhân viên</label>
                        <br />
                        <textarea id="post-recruitment-interest-input" name="interest" pattern='.{1,65000}' required
                            defaultValue={props.recruitment !== undefined ? props.recruitment.interest : ""} />
                        {!validation.interest && <p className="error-message">Trường này không được bỏ trống</p>}
                    </div>
                </div>
            </form>
            <div className="post-recruitment-button">
                {
                    props.type !== "edit" &&
                    <button className="post-recruitment-button-post" type="button" onClick={submit}>Đăng</button>
                }
                {
                    props.type === "edit" &&
                    <button className="post-recruitment-button-post" type="button" onClick={updateRecruitment}>Lưu</button>
                }
            </div>
        </div>
    )
}
export default PostRecruitment;