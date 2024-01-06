import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom";
import { STATECONTEXT } from "../../App";
import "../../css/approvalMail.css";

export default function ApprovalMail(props) {
    const [globalState, setGlobalState] = useContext(STATECONTEXT);
    const navigate = useNavigate();
    const form = useRef();
    const attachedFiles = useRef();

    const sendApprovalMail = () => {
        let formData = new FormData(form.current);
        for (var file of attachedFiles.current.files) {
            formData.append("attachments", file);
        }
        formData.set("applicationId", props.application.id);
        if (props.type === "reject")
            formData.set("action", "reject");

        axios.post(globalState.appServer + globalState.api.approveApplication, formData, { withCredentials: true })
            .then(response => {
                alert("Successful!");
                if (props.success !== undefined)
                    props.success();
            })
            .catch(error => {
                console.error(error);
                alert("Failed!");
                if (props.cancel !== undefined)
                    props.cancel();
            });
    }

    return (
        <div className="approvalMail">
            <div className="approvalMail-1">
                <form ref={form}>
                    <div className="approvalMail-reciever">
                        Tới: {props.application.cv.employee.firstName + " " + props.application.cv.employee.lastName}
                    </div>
                    {
                        props.type === "next-phase" &&
                        <div className="approvalMail-phase">
                            <label>Vòng: </label>
                            <select name='action'>
                                <option>Phỏng vấn qua điện thoại</option>
                                <option>Phỏng vấn trực tiếp</option>
                                <option>Phỏng vấn trực tiếp lần 2</option>
                                <option>Phỏng vấn trực tiếp lần 3</option>
                                <option>Làm bài test</option>
                                <option>Làm bài test lần 2</option>
                                <option>Làm bài test lần 3</option>
                                <option>Thực tập</option>
                                <option>On job training</option>
                                <option>Thử việc</option>
                                <option>Vào làm chính thức</option>
                            </select>
                        </div>
                    }
                    <input type="text"
                        placeholder="Tiêu đề thư"
                        defaultValue={props.type === "reject" ? "THƯ TỪ CHỐI ỨNG VIÊN" : ""}
                        className="approvalMail-header" name="head" required></input>
                    <textarea className="approvalMail-body" placeholder="Soạn thư..." required name="body"></textarea>
                    <label className="approvalMail-attached-file" name="attachments" required>
                        <input type="file" multiple ref={attachedFiles}></input>
                    </label>
                    <div className="approvalMail-button">
                        <button className="approvalMail-button-send" type="button" onClick={sendApprovalMail}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-send-fill" viewBox="0 0 16 16">
                                <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z" />
                            </svg>
                            Gửi
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}