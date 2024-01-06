import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import "../../css/uploadCv.css"
import Button from "../elements/button";
import SelectMultiObjects from "../elements/multiObjectsInput";
import { useForm } from "react-hook-form";
import { useContext } from "react";
import { STATECONTEXT } from "../../App";
import { useNavigate } from "react-router-dom";
import SelectCv from "../elements/selectCv";
import { convertDOCToText, extractCv, extractFromFile } from "../../service/extractCV";

function UploadCv(props) {
    const [globalState, setGlobalState] = useContext(STATECONTEXT);
    const [provinces, setProvinces] = useState([]);
    const [skills, setSkills] = useState([]);
    const [domains, setDomains] = useState([]);
    const [defaultProvinces, setDefaultProvinces] = useState([]);
    const [defaultSkills, setDefaultSkills] = useState([]);
    const [defaultDomains, setDefaultDomains] = useState([]);
    const navigate = useNavigate();
    const fileElement = useRef();
    const selectProvincesElement = useRef();
    const selectDomainsElement = useRef();
    const selectSkillsElement = useRef();

    const [validation, setValidation] = useState(
        {
            file: { isValid: true, message: 'Vui lòng chọn 1 file kích thước không quá 2MB' }
        });

    useEffect(() => {
        if (globalState.provinces !== undefined) {
            setProvinces(globalState.provinces);
        } else {
            //get provinces
            axios.get(globalState.appServer + globalState.api.getProvinces)
                .then(response => response.data !== undefined ? response.data : [])
                .then(data => {
                    setProvinces(data)
                    setGlobalState({ ...globalState, provinces: data })
                });
        }
        if (globalState.domains !== undefined) {
            setDomains(globalState.domains);
        } else {
            axios.get(globalState.appServer + globalState.api.getDomains)
                .then(response => response.data !== undefined ? response.data : [])
                .then(data => {
                    setDomains(data)
                    setGlobalState({ ...globalState, domains: data })
                });
        }
        if (globalState.skills !== undefined) {
            setSkills(globalState.skills);
        } else {
            axios.get(globalState.appServer + globalState.api.getSkills)
                .then(response => response.data !== undefined ? response.data : [])
                .then(data => {
                    setSkills(data)
                    setGlobalState({ ...globalState, skills: data })
                });
        }
    }, []);

    const upload = () => {
        if (validateForm()) {
            let formData = new FormData(document.uploadCvForm);

            let provinces = selectProvincesElement.current.getValue();
            formData.set("provinces", provinces);

            let domains = selectDomainsElement.current.getValue();
            formData.set("domains", domains);

            let skills = selectSkillsElement.current.getValue()
            formData.set("skills", skills);

            if (props.type === "html") {
                if (props.file !== undefined)
                    formData.set("file", props.file);
                else{
                    alert("Không tìm thấy file!");
                    return;
                }
            }

            axios({
                method: 'post',
                url: globalState.appServer + globalState.api.uploadCv,
                data: formData,
                withCredentials: true
            }).then(response => {
                alert("Upload thành công!");
                resetForm();
                if (props.success) {
                    props.success();
                }
            }).catch(error => {
                if (error.response && error.response.status === 401)
                    navigate(globalState.links.loginLink);
                else
                    alert("Upload thất bại! Vui lòng thử lại sau");
            })
        }
    }

    const updateCV = () => {
        if (validateForm()) {
            let formData = new FormData(document.uploadCvForm);

            let provinces = selectProvincesElement.current.getValue();
            formData.set("provinces", provinces);

            let domains = selectDomainsElement.current.getValue();
            formData.set("domains", domains);

            let skills = selectSkillsElement.current.getValue()
            formData.set("skills", skills);

            formData.set("cvId", props.cvId);

            if (props.type === "html") {
                if (props.file !== undefined)
                    formData.set("html", props.file);
                else{
                    alert("Không tìm thấy file!");
                    return;
                }
            }

            axios({
                method: 'post',
                url: globalState.appServer + globalState.api.updateCV,
                data: formData,
                withCredentials: true
            }).then(response => {
                alert("Update thành công!");
                resetForm();
                if (props.success) {
                    props.success();
                }
            }).catch(error => {
                if (error.response.status === 401)
                    navigate(globalState.links.loginLink);
                else
                    alert("Thất bại! Vui lòng thử lại sau");
            })
        }
    }

    const resetForm = () => {
        document.uploadCvForm.reset();
        selectProvincesElement.current.clear();
        selectDomainsElement.current.clear();
        selectSkillsElement.current.clear();
    }

    const validateForm = () => {
        let newValidation = { ...validation };
        let valid = true;
        //file
        newValidation.file.isValid = true;
        if(!fileElement.current.validity.valid || fileElement.current.files[0].size > 2000000){
            fileElement.current = "";
            newValidation.file.isValid = false;
            valid = false;
        }
        setValidation(newValidation)
        return valid;
    }

    const SelectCvHandle = (event) => {
        if (event.target.files.length === 0) {
            resetForm();
            return;
        }
        let file = event.target.files[0];
        let newValidation = { ...validation };
        newValidation.file.isValid = true;
        if(fileElement.current.files[0].size > 2000000){
            fileElement.current.value = "";
            newValidation.file.isValid = false;
            setValidation(newValidation);
            return;
        }
        let fileNameSplit = file.name.split(".");
        let extension = fileNameSplit[fileNameSplit.length - 1].toLowerCase().trim();
        if (extension !== "pdf" && extension !== "doc" && extension !== "docx") {
            event.target.value = '';
            alert("CV chỉ được là file PDF, DOC hoặc DOCX");
            return;
        }
        extractFromFile(file)
            .then(profile => {
                setDefaultProvinces(profile.provinces);
                setDefaultDomains(profile.domains);
                setDefaultSkills(profile.skills);
            });
    }

    useEffect(() => {
        if (provinces && domains && skills) {
            if (props.type === "html" && props.file !== undefined) {
                extractFromFile(props.file)
                    .then(profile => {
                        setDefaultProvinces(profile.provinces);
                        setDefaultDomains(profile.domains);
                        setDefaultSkills(profile.skills);
                    });
            }
        }
    }, [provinces, domains, skills, props.type, props.file]);

    return (
        <div className="upload-cv">
            <form name="uploadCvForm">
                {
                    props.type !== "html" &&
                    <div className="upload-cv-content">
                        <label className="required-label">Chọn CV (.doc, .docx, .pdf)</label>
                        <input type="file"
                            name="file"
                            onChange={SelectCvHandle}
                            accept=".pdf, .docx, .doc"
                            ref={fileElement}
                            required />
                        {validation.file.isValid ? undefined : <small style={{ color: 'red' }}>{validation.file.message}</small>}
                    </div>
                }
                {
                    props.type === "html" &&
                    <div className="upload-cv-content">
                        <label>CV:</label>
                        <span>{props.file !== undefined && props.file.name}</span>
                    </div>
                }
                <div className="upload-cv-privacy">
                    <label>Bạn có muốn công khai CV này cho nhà tuyển dụng không?</label>
                    <div className="upload-cv-public-privacy">
                        <input type="radio"
                            name="privacy"
                            value="public"
                            defaultChecked />
                        <label>Public</label>
                    </div>
                    <div className="upload-cv-private-privacy">
                        <input type="radio" name="privacy" value="private" />
                        <label>Private</label>
                    </div>
                </div>
                <div className="upload-cv-extra-information">
                    <div className="cv-extra-information-title">
                        Cung cấp thêm một số thông tin để nhà tuyển dụng có thể tìm thấy bạn dễ hơn!
                    </div>
                    <div className="upload-cv-address">
                        {/* <div>Nơi làm việc phù hợp với bạn?</div> */}
                        <div className="upload-cv-address-1">
                            <SelectMultiObjects id="upload-cv-provinces"
                                objects={provinces.map(province => province.name)}
                                label="Tỉnh/thành phố"
                                name="provinces"
                                ref={selectProvincesElement}
                                defaultValue={defaultProvinces} />
                        </div>
                    </div>
                    <SelectMultiObjects
                        id="upload-cv-domains"
                        objects={domains.map(domain => domain.name)}
                        label="CV của bạn phù hợp với lĩnh vực nào?"
                        name="domains"
                        defaultValue={defaultDomains}
                        ref={selectDomainsElement} />
                    <SelectMultiObjects
                        id="upload-cv-skills"
                        objects={skills.map(skill => skill.name)}
                        label="Bạn có những kỹ năng nào?"
                        name="skills"
                        defaultValue={defaultSkills}
                        ref={selectSkillsElement} />
                    <div className="upload-cv-experience">
                        <label className="label">Số năm kinh nghiệm</label>
                        <input type="number" defaultValue="0" min="0" max="50" name="experience" />
                    </div>
                    <div className="upload-cv-wage">
                        <label className="label">Mức lương mong muốn</label>
                        <select name="wage">
                            <option></option>
                            <option>1 - 3 triệu đồng</option>
                            <option>3 - 5 triệu đồng</option>
                            <option>5 - 7 triệu đồng</option>
                            <option>7 - 10 triệu đồng</option>
                            <option>10 - 15 triệu đồng</option>
                            <option>15 - 30 triệu đồng</option>
                            <option>30 - 50 triệu đồng</option>
                            <option>trên 50 triệu đồng</option>
                        </select>
                    </div>
                </div>
            </form>
            <div className="upload-cv-button">
                {
                    props.tabView !== "edit" &&
                    <button className="upload-cv-upload-button" type="button" onClick={upload}>Tải lên</button>
                }
                {
                    props.tabView === "edit" &&
                    <button className="upload-cv-upload-button" type="button" onClick={updateCV}>Lưu</button>
                }
            </div>
        </div>
    )
}
export default UploadCv;