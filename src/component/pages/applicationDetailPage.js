import axios from "axios";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"
import { STATECONTEXT } from "../../App";
import MailDetail from "../elements/mailDetail";
import ApprovalMail from "../form/approvalMail";
import "../../css/applicationDetailPage.css";
import RecruitmentPipeline from "../elements/recruitmentPipeline";
import TaskBar from "../elements/taskbar";
import CvSummary from "../elements/cvSummary";
import { useRole } from "../../service/authenticate";
import RecruitmentSummary from "../elements/recruitmentSummary";
import PopUp from "../elements/popUp";

export default function ApplicationDetailPage(props) {
    const [globalState, setGlobalState] = useContext(STATECONTEXT);
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const appId = params.get("id");
    const [application, setApplication] = useState();
    const navigate = useNavigate();
    const user = useRole();
    const replyElement = useRef();
    const [isShowCV, setIsShowCV] = useState(false);
    const [isShowApproveMail, setIsShowApproveMail] = useState(false);
    const [isShowRejectMail, setIsShowRejectMail] = useState(false);

    const getApplication = () => {
        axios.get(globalState.appServer + globalState.api.getApplicationById + appId, { withCredentials: true })
            .then(response => response.data)
            .then(data => {
                setApplication(data);
                console.log(data);
            })
            .catch(error => {
                if (error.response.status === 401) {
                    navigate(globalState.links.loginLink);
                }
                console.error(error);
            });
    }

    useEffect(() => {
        getApplication();
    }, []);


    const showHistory = () => {
        let historyElement = document.getElementById("application-history");
        let expandButton = document.getElementById("expand-button");
        if (historyElement.style.display === "none") {
            historyElement.style.display = "block";
            expandButton.style.transform = "rotate(180deg)";
        } else {
            historyElement.style.display = "none";
            expandButton.style.transform = "rotate(0deg)";
        }
    }

    const finishApplication = () => {
        if (window.confirm("Bạn muốn kết thúc tuyển dụng ứng viên này?")) {
            axios.post(globalState.appServer + globalState.api.finishApplication + "?applicationId=" + application.id, {}, { withCredentials: true })
                .then(response => alert(response.data))
                .then(() => getApplication())
                .catch(error => console.log(error));
        }
    }

    const replyMail = () => {
        let formData = new FormData();
        formData.set("applicationId", application.id);
        formData.set("body", document.getElementById("reply-body").value);
        let attachmentsElement = document.getElementById("reply-attachments");
        for (var file of attachmentsElement.files) {
            formData.append("attachments", file);
        }
        axios.post(globalState.appServer + globalState.api.replyMail, formData, { withCredentials: true })
            .then(response => {
                alert("Đã gửi");
                getApplication();
            })
            .catch(error => {
                console.log(error);
            })
    }

    return (
        application !== undefined &&
        <div className="application-detail-page">
            <div className="application-detail-main-information">
                <div className="application-detail-page-cv">
                    <div className="application-detail-page-title white-title">CV ứng tuyển</div>
                    {
                        application.cv !== undefined &&
                        <CvSummary cv={application.cv} editable={false}
                            handleClick={() => setIsShowCV(true)} />
                    }
                </div>
                {
                    isShowCV &&
                    <div className="application-detail-page-cv-container">
                        <div className="application-detail-page-cv-close">
                            <i class="bi bi-x-circle" onClick={() => setIsShowCV(false)}></i>
                        </div>
                        <iframe src={application.cv.file.source}></iframe>
                    </div>
                }
                <div className="application-detail-page-recruitment">
                    <div className="application-detail-page-title white-title">Tin tuyển dụng</div>
                    <RecruitmentSummary recruitment={application.recruitment} />
                </div>
            </div>
            <div className="application-detail-flow">
                <RecruitmentPipeline
                    mails={application.applicationHistories ? [...application.applicationHistories, application.currentMail]
                        : [application.currentMail]} />
                <div className="current-phase">
                    <div className="current-mail">
                        <MailDetail
                            mail={application.currentMail}
                            direction={application.currentMail.phase === "application" ? 0 : 1}
                            employee={application.cv.employee}
                            employer={application.recruitment.employer} />
                        <i className="bi bi-reply-fill reply-button" title="Trả lời thư này"
                            onClick={() => {
                                replyElement.current.style.display = "flex";
                                replyElement.current.focus();
                            }}>
                        </i>
                    </div>
                    <div className="reply-mail-container" ref={replyElement} style={{ display: "none" }}>
                        <div className="reply-mail" >
                            <div className="close-button">
                                <i class="bi bi-x-lg" onClick={() => replyElement.current.style.display = "none"}></i>
                            </div>
                            <textarea id="reply-body" defaultValue="..."></textarea>
                            <div className="reply-services">
                                <input type="file" id="reply-attachments" multiple="multiple"></input>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-send-fill" viewBox="0 0 16 16" onClick={replyMail}>
                                    <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    {
                        user && user.role === "ROLE_EMPLOYER" &&
                        <div className="application-approval">
                            <div className="current-phase-buttons">
                                {
                                    application.currentMail.status !== "failed" && application.currentMail.status !== "done" &&
                                    <>
                                        <button className="reject" onClick={() => setIsShowRejectMail(true)}>Từ chối</button>
                                        <button onClick={() => setIsShowApproveMail(true)}>Vòng tiếp</button>
                                        <button className="done" onClick={finishApplication}>Kết thúc</button>
                                    </>
                                }
                            </div>
                            <PopUp
                                isDisplay={isShowApproveMail}
                                close={() => setIsShowApproveMail(false)}
                                title="Qua vòng tiếp theo"
                                content={
                                    <ApprovalMail
                                        type="next-phase"
                                        application={application}
                                        success={() => {
                                            getApplication();
                                            setIsShowApproveMail(false);
                                        }}/>
                                }
                            />
                            <PopUp
                                isDisplay={isShowRejectMail}
                                close={() => setIsShowRejectMail(false)}
                                title="Từ chối ứng viên"
                                content={
                                    <ApprovalMail
                                        type="reject"
                                        application={application}
                                        success={() => {
                                            getApplication();
                                            setIsShowRejectMail(false);
                                        }}/>
                                }
                            />
                        </div>
                    }
                </div>
                <div className="application-detail-page-history">
                    <div className="application-detail-page-title">Lịch sử tuyển dụng:</div>
                    <div id="expand-button" className="application-detail-page-expand" onClick={showHistory}>
                        <i class="bi bi-chevron-compact-down"></i>
                    </div>
                    <div id="application-history" className="application-history" style={{ display: "none" }}>
                        <ul>
                            {
                                application.applicationHistories && application.applicationHistories.length > 0 &&
                                <>
                                    <li>
                                        <div className="phase-note">{new Date(application.applicationHistories[0].time).toLocaleString()}<br />{application.applicationHistories[0].phase}</div>
                                        <div className={"mark status--" + application.applicationHistories[0].status}></div>
                                        <MailDetail
                                            mail={application.applicationHistories[0]}
                                            direction={0}
                                            employee={application.cv.employee}
                                            employer={application.recruitment.employer} />
                                    </li>
                                    {
                                        application.applicationHistories.slice(1, application.applicationHistories.length).map(
                                            mail => <li>
                                                <div className="phase-note"> {new Date(mail.time).toLocaleString()}<br /> {mail.phase}</div>
                                                <div className={"mark status--" + mail.status}></div>
                                                <MailDetail
                                                    mail={mail}
                                                    direction={1}
                                                    employee={application.cv.employee}
                                                    employer={application.recruitment.employer} />
                                            </li>)
                                    }
                                </>
                            }
                            <li>
                                <div className="phase-note">{new Date(application.currentMail.time).toLocaleString()} <br /> {application.currentMail.phase}</div>
                                <div className={"mark status--" + application.currentMail.status}></div>
                                <MailDetail
                                    mail={application.currentMail}
                                    direction={application.currentMail.phase === "application" ? 0 : 1}
                                    employee={application.cv.employee}
                                    employer={application.recruitment.employer} />
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}