import { useEffect } from "react";
import { useParams } from "react-router-dom";
import "../../css/mailDetail.css";

export default function MailDetail(props) {
    return (
        <div className="mail-detail">
            <div className="mail-detail-main">
                <div className="mail-top">
                    <div className="mail-detail-object">
                        {
                            props.direction === 0 ? props.employee.firstName + " " + props.employee.lastName : undefined
                        }
                        {
                            props.direction === 1 ? props.employer.firstName + " " + props.employer.lastName : undefined
                        }
                        {/* Nguyễn Văn Lâm */}
                    </div>
                    <div className="mail-detail-time">
                        {props.mail !== undefined ? new Date(props.mail.time).toLocaleString() : undefined}
                        {/* 03/04/2023 18:00:00 */}
                    </div>
                </div>
                <div className="mail-detail-content">
                    <div className="mail-detail-header">
                        {props.mail !== undefined ? props.mail.head : undefined}
                        {/* MAIL HEADER */}
                    </div>
                    <div className="mail-detail-body">
                        {props.mail !== undefined ? props.mail.body : undefined}
                        {/* <p>Dear bro,</p>
                    <p>tôi là lâm</p>
                    <p>tôi viết mail...</p> */}
                    </div>
                </div>
                <div className="mail-detail-attached-files">
                    {
                        props.mail !== undefined && props.mail.attachments !== undefined &&
                        props.mail.attachments.map(
                            file =>
                                <div className="mail-detail-attached-file">
                                    {file.originalName}
                                    <a className="mail-detail-attached-file-link" href={file.source} download>
                                        <i class="bi bi-cloud-download"></i>
                                    </a>
                                </div>
                        )
                    }
                </div>
            </div>
            {
                props.mail !== undefined && props.mail.responses != undefined &&
                <div className="mail-detail-responses">
                    {
                        props.mail.responses.map(mail =>
                            <div className="mail-detail-response-item">
                                <div className="mail-top">
                                    <div className="mail-detail-object">
                                        {
                                            mail.direction === 0 ? props.employee.firstName + " " + props.employee.lastName : undefined
                                        }
                                        {
                                            mail.direction === 1 ? props.employer.firstName + " " + props.employer.lastName : undefined
                                        }
                                    </div>
                                    <div className="mail-detail-time">
                                        {new Date(mail.time).toLocaleString()}
                                    </div>
                                </div>
                                <div className="mail-detail-content">
                                    <div className="mail-detail-body">
                                        {mail.body}
                                    </div>
                                </div>
                                <div className="mail-detail-attached-files">
                                    {
                                        mail.attachments !== undefined && mail.attachments !== null &&
                                        mail.attachments.map(
                                            file =>
                                                <div className="mail-detail-attached-file">
                                                    {file.originalName}
                                                    <a className="mail-detail-attached-file-link" href={file.source} download>
                                                        <i class="bi bi-cloud-download"></i>
                                                    </a>
                                                </div>
                                        )
                                    }
                                </div>
                            </div>
                        )
                    }
                </div>
            }
        </div>
    )
}