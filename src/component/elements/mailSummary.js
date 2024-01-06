import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { STATECONTEXT } from "../../App";
import "../../css/mailSummary.css";

export default function MailSummary(props) {
    const [globalState, setGlobalState] = useContext(STATECONTEXT);
    const [currentMail, setCurrentMail] = useState();

    useEffect(() => {
        if (props.mail !== undefined) 
            setCurrentMail(props.mail.currentMail);
    }, [props.mail]) 

    return (
        <Link className="mail-summary-link" to={globalState.links.applicationDetailLink+"?id="+props.mail.id} target="_blank">
            <div className="mail-summary">
                <div className="mail-summary-item mail-summary-date">
                    {currentMail !== undefined ? new Date(currentMail.time).toLocaleDateString() : undefined}
                </div>
                <div className="mail-summary-item mail-summary-object">
                    {props.host === 1 ? props.mail.recruitment.employer.company.name
                        : props.mail.cv.employee.firstName + " " + props.mail.cv.employee.lastName}
                </div>
                <div className="mail-summary-item mail-summary-header">
                    {/* Nguyễn Văn Lâm - CV ứng tuyển intern front-end */}
                    {currentMail !== undefined ? currentMail.head : undefined}
                </div>
                <div className="mail-summary-item mail-summary-recruitment-name">
                    {/* TechCV tuyển dụng intern front-end */}
                    {props.mail.recruitment !== undefined ? props.mail.recruitment.name : undefined}
                </div>
                <div className="mail-summary-item mail-summary-phase">
                    {/* TechCV tuyển dụng intern front-end */}
                    {currentMail !== undefined ? currentMail.phase : undefined}
                </div>
                <div className={"mail-summary-item mail-summary-status " + (currentMail !== undefined ? "status--"+currentMail.status : "")}>
                    {/* TechCV tuyển dụng intern front-end */}
                    {currentMail !== undefined ? currentMail.status : undefined}
                </div>
            </div>
        </Link>
    )
}