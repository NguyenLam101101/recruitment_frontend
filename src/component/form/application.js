import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom";
import { STATECONTEXT } from "../../App";
import "../../css/application.css"
import SelectCv from "../elements/selectCv";

export default function Application(props) {
    const [globalState, setGlobalState] = useContext(STATECONTEXT);
    const navigate = useNavigate();
    const [selectedCvId, setSelectedCvId] = useState();
    const [selectedCvName, setSelectedCvName] = useState("Chọn mẫu CV của bạn");
    const form = useRef();
    const applicationSelectCvElement = useRef();
    const attachedFiles = useRef();
    const [validation, setValidation] = useState({
        head: true,
        body: true,
        cv: true
    });

    const validateForm = () => {
        let validation1 = { ...validation };
        let valid = true;

        validation1.head = true;
        if (!form.current.head.value.trim()) {
            valid = false;
            validation1.head = false;
        }

        validation1.body = true;
        if (!form.current.body.value.trim()) {
            valid = false;
            validation1.body = false;
        }

        validation1.cv = true;
        if (!selectedCvId) {
            valid = false;
            validation1.cv = false;
        }

        setValidation(validation1);
        return valid;
    }

    const submit = () => {
        if (validateForm()) {
            let formData = new FormData(form.current);
            for (let i = 0; i < attachedFiles.current.files.length; i++) {
                formData.append('attachedFiles', attachedFiles.current.files[i]);
            }
            if (props.recruitment !== undefined) {
                formData.set("recruitmentId", props.recruitment.id);
            }
            if (selectedCvId !== undefined) {
                formData.set("cvId", selectedCvId);
            }
            axios.post(globalState.appServer + "/employee/apply", formData, { withCredentials: true })
                .then(response => {
                    alert("Thành công!");
                    if (props.success !== undefined)
                        props.success();
                }).catch(error => {
                    if (error.response.status === 401) {
                        alert("Vui lòng đăng nhập");
                        navigate(globalState.links.loginLink);
                    }
                    else {
                        alert("Không thể thực hiên. Vui lòng thử lại sau");
                        props.cancel();
                    }
                })
        }
    }

    const willSelectCv = () => {
        form.current.style.animationName = 'selectCV1';
        applicationSelectCvElement.current.style.animationName = 'selectCV1';
    }

    const selectCv = (cvId, cvName) => {
        form.current.style.animationName = 'selectCV2';
        applicationSelectCvElement.current.style.animationName = 'selectCV2';
        setSelectedCvId(cvId);
        setSelectedCvName(cvName);
    }

    return (
        <div className="application">
            <div className="application-1">
                <form ref={form}>
                    <div className="application-reciever">
                        Tới: {props.recruitment !== undefined ? props.recruitment.employer.company.name : undefined}
                    </div>
                    <input type="text"
                        placeholder={"Tiêu đề... thư ứng tuyển " + (props.recruitment ? props.recruitment.name : "")}
                        className="application-header"
                        name="head"
                        required></input>
                    {!validation.head && <p className="error-message">Vui lòng điền tiêu đề thư</p>}
                    <textarea
                        className="application-body"
                        placeholder="Soạn thư..."
                        required
                        name="body"></textarea>
                    {!validation.body && <p className="error-message">Bạn chưa soạn thư</p>}
                    <div className="application-cv" name="cv" onClick={willSelectCv}>
                        {selectedCvName}
                    </div>
                    {!validation.cv && <p className="error-message">Vui lòng chọn 1 CV</p>}
                    <label className="application-attached-file" name="attachedFiles">
                        <input type="file" multiple ref={attachedFiles}></input>
                    </label>
                    <div className="application-button">
                        <button className="application-button-send" type="button" onClick={submit}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-send-fill" viewBox="0 0 16 16">
                                <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z" />
                            </svg>
                            Gửi
                        </button>
                    </div>
                </form>
                <div className="application-select-cv" ref={applicationSelectCvElement}>
                    <SelectCv select={selectCv} />
                </div>
            </div>
        </div>
    )
}