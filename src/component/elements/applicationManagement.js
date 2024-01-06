import { useContext, useEffect, useRef, useState } from "react";
import "../../css/applicationManagement.css";
import MailSummary from "./mailSummary";
import MultiObjectsInput from "./multiObjectsInput";
import { STATECONTEXT } from "../../App";
import axios from "axios";

export default function ApplicationManagement(props) {
    const [mails, setMails] = useState([]);
    const [filterMails, setFilterMails] = useState([]);
    const [filterRecruitments, setFilterRecruitments] = useState([]);
    const filterRecruitmentContainer = useRef();
    const filterRecruitmentDropList = useRef();
    const [globalState, setGlobalState] = useContext(STATECONTEXT);


    useEffect(() => {
        document.addEventListener("click", (event) => {
            if (filterRecruitmentContainer.current !== null && !filterRecruitmentContainer.current.contains(event.target)) {
                filterRecruitmentDropList.current.style.display = "none";
            }
        });
    }, []);


    useEffect(() => {
        let mails = [...props.mails];
        mails.sort((a, b) => {
            if (a.currentMail.time >= b.currentMail.time)
                return -1
            else
                return 1
        });
        setMails(mails);
        setFilterMails(mails);
        // filter(mails);
    }, [props.mails]);

    useEffect(() => {
        setFilterRecruitments(props.recruitments);
    }, [props.recruitments]);

    const inputRecruitmentName = (event) => {
        let text = event.target.value.toLowerCase();
        var filterRecruitments1 = props.recruitments.filter(name => name.toLowerCase().includes(text));
        setFilterRecruitments(filterRecruitments1);
    }

    const selectRecruitment = (event) => {
        event.preventDefault();
        Array.from(document.getElementsByClassName("filter-recruitment-option")).forEach(element => {
            element.classList.remove("selected");
        })
        event.target.classList.add("selected");
        document.getElementsByName("recruitment-name")[0].value = event.target.textContent;
        filter();
        document.getElementsByClassName("recruitment-name-drop-list")[0].style.display = "none";
    }

    const filter = () => {
        let filterMails1 = [...mails];
        let phase = document.getElementsByName("phase")[0].value;
        filterMails1 = filterMails1.filter(mail => mail.currentMail.phase.includes(phase));

        //status
        let status = document.getElementsByName("status")[0].value;
        filterMails1 = filterMails1.filter(mail => mail.currentMail.status.includes(status));

        //recruitment
        let recruitment = document.getElementsByName("recruitment-name")[0].value;
        filterMails1 = filterMails1.filter(mail => mail.recruitment.name.toLowerCase().includes(recruitment.toLowerCase()));

        setFilterMails(filterMails1);
    }

    const sortByDateTime = (type) => {
        let filterMails1 = [...filterMails];
        filterMails1.sort((a, b) => {
            if (type === "new") {
                if (a.currentMail.time >= b.currentMail.time)
                    return -1
                else
                    return 1
            }
            else {
                if (a.currentMail.time <= b.currentMail.time)
                    return -1
                else
                    return 1
            }
        });
        setFilterMails(filterMails1);
    }

    return (
        <div className="application-management">
            <div className="mail-filter-container">
                <label className="mail-filter-item"
                    onChange={event => sortByDateTime(event.target.value)}>
                    Thời gian
                    <select name="date">
                        <option value={"new"}>Mới nhất</option>
                        <option value={"old"}>Cũ nhất</option>
                    </select>
                </label>
                <label className="mail-filter-item mail-filter-item">
                    Tin tuyển dụng
                    <div className="mail-filter-item-recruitment-container" ref={filterRecruitmentContainer}>
                        <input name="recruitment-name" type="text"
                            onFocus={() => filterRecruitmentDropList.current.style.display = "block"}
                            onInput={(event) => inputRecruitmentName(event)}
                            onChange={filter} />
                        <div className="recruitment-name-drop-list"
                            ref={filterRecruitmentDropList}
                            style={{ 'display': "none" }}>
                            <div className="filter-recruitment-option selected" onClick={selectRecruitment}></div>
                            {
                                filterRecruitments.map(recruitment => <div className="filter-recruitment-option" onClick={selectRecruitment}>{recruitment}</div>)
                            }
                        </div>
                    </div>

                </label>
                <label className="mail-filter-item mail-filter-item-phase" onChange={filter}>
                    Phase
                    <select name="phase">
                        <option></option>
                        <option>ứng tuyển</option>
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
                </label>
                <label className="mail-filter-item" onChange={filter}>
                    Status
                    <select name="status">
                        <option></option>
                        <option>processing</option>
                        <option>failed</option>
                        <option>done</option>
                    </select>
                </label>
            </div>
            <div className="application-management-page-mail-list">
                {filterMails.map(mail => <MailSummary host={props.host} mail={mail} />)}
            </div>
        </div>
    )
}