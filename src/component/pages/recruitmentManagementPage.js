import { useContext, useEffect, useRef, useState } from "react";
import EmployerTaskbar from "../elements/employerTaskbar"
import { STATECONTEXT } from "../../App";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../../css/recruitmentManagementPage.css";
import EmployerReport from "../elements/employerReport";
import Prompt from "../elements/prompt";
import { Button } from "bootstrap";
import PostRecruitment from "../form/postRecruitment";
import PopUp from "../elements/popUp";
import Recruitment from "../elements/recruitment";

export default function RecruitmentManagementPage() {
    const [globalState, setGlobalState] = useContext(STATECONTEXT);
    const [recruitments, setRecruitments] = useState([]);
    const navigate = useNavigate();
    const { viewTab } = useParams();
    const [curViewTab, setcurViewTab] = useState(viewTab);
    const [updateEndDatePrompt, setUpdateEndDatePrompt] = useState(<></>);
    const updateEndDateInput = useRef();
    const [isShowPostRecruitment, setIsShowPostRecruitment] = useState(false);
    const [recruitmentView, setRecruitmentView] = useState("table");
    const defaultPostRecruitmentForm =
        <PostRecruitment
            success={() => {
                setIsShowPostRecruitment(false);
                setPostRecruitmentForm(defaultPostRecruitmentForm);
                getRecruitments();
            }}
        />;

    const [postRecruitmentForm, setPostRecruitmentForm] = useState(defaultPostRecruitmentForm);

    const getRecruitments = () => {
        axios.get(globalState.appServer + "/employer/get-recruitments", { withCredentials: true })
            .then(response => (response.data !== undefined) ? response.data : [])
            .then(data => {
                setRecruitments(data);
                setGlobalState({ ...globalState, myRecruitments: data });
            })
            .catch((error) => {
                console.log(error);
                if (error.response.status === 401)
                    navigate(globalState.links.loginLink);
            });
    }

    useEffect(() => {
        if (viewTab === undefined) {
            setcurViewTab("applications");
            navigate(globalState.links.recruitmentManagementLink + "/recruitments");
        }
        setcurViewTab(viewTab);
        if (viewTab === "recruitments") {
            if (globalState.myRecruitments !== undefined) {
                setRecruitments(globalState.myRecruitments);
            }
            else
                getRecruitments();
        }
    }, [viewTab]);


    const updateStatus = (status) => {
    }

    const willChangeStatus = (recruitment) => {
        if (recruitment.status === "active") {
            if (window.confirm("Bạn muốn kết thúc tin tuyển dụng này ngay bây giờ chứ?\n(Tin sẽ tự động kết thúc khi hết ngày đã định)"))
                updateStatus("expired");
        } else if (recruitment.status === "expired") {
            if (window.confirm("Bạn muốn bật lại tin tuyển dụng này?")) {
                let currentDate = new Date();
                let endDate = new Date(recruitment.endDate);
                if (currentDate > endDate) {
                    updateEndDate();
                }
            }
        }
    }

    const updateEndDate = () => {
        let newDate;
        setUpdateEndDatePrompt(<Prompt message="Cập nhật ngày kết thúc mới!"
            type="date"
            ref={updateEndDateInput}
            okHandle={() => {
                newDate = updateEndDateInput.current.value;
                setUpdateEndDatePrompt(<></>);
                //call api
            }}
            cancelHandle={() => setUpdateEndDatePrompt(<></>)} />);
    }

    const doSort = (event, field) => {
        let isDesc = true;
        if (event.target.classList.contains("sort--desc"))
            isDesc = false;
        Array.from(document.getElementsByClassName("td--sort")).forEach(element => {
            element.classList.remove("sort--desc");
            element.classList.remove("sort--asc");
        });
        if (isDesc)
            event.target.classList.add("sort--desc");
        else
            event.target.classList.add("sort--asc");
        let recruitments1 = [...recruitments];
        recruitments1.sort((a, b) => {
            if (isDesc) {
                if (a[field] < b[field])
                    return 1
                if (a[field] > b[field])
                    return -1
            }
            else {
                if (a[field] < b[field])
                    return -1
                if (a[field] > b[field])
                    return 1
            }
            if (a[field] === b[field])
                return 0
        });
        setRecruitments(recruitments1);
    }

    return (
        <div className="recruitment-management-page"
            onClick={(event) => {
                if (!event.target.classList.contains("show-recruitment-options")) {
                    Array.from(document.getElementsByClassName("recruitment-more-options")).forEach(element => element.style.display = "none");
                };
            }}>
            <EmployerTaskbar />
            <div className="recruitment-management-page-content">
                <div className="recruitment-management-page-menu">
                    <button className={"recruitment-management-curViewTab curViewTab-recruitments " + (curViewTab === "recruitments" ? "active" : "")}
                        onClick={() => navigate(globalState.links.recruitmentManagementLink + "/recruitments")}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-send" viewBox="0 0 16 16">
                            <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z" />
                        </svg>
                        Tin tuyển dụng
                    </button>
                    <button className={"recruitment-management-curViewTab curViewTab-report " + (curViewTab === "report" ? "active" : "")}
                        onClick={() => navigate(globalState.links.recruitmentManagementLink + "/report")}>
                        <i className="bi bi-journal-text"></i>
                        Báo cáo thống kê
                    </button>
                </div>
                <div className="recruitment-management-recruitment-container">
                    {
                        curViewTab === "recruitments" &&
                        <>
                            <div className="recruitment-management-page-new-recruitment"
                                onClick={() => setIsShowPostRecruitment(true)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-send" viewBox="0 0 16 16">
                                    <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z" />
                                </svg>
                                Đăng tin tuyển dụng ngay
                            </div>
                            <PopUp
                                isDisplay={isShowPostRecruitment}
                                content={postRecruitmentForm}
                                title="Đăng tin tuyển dụng"
                                close={() => setIsShowPostRecruitment(false)}
                            />
                            <button className="recruitment-management-change-recruitment-view" onClick={() => {
                                if (recruitmentView === "table")
                                    setRecruitmentView("list");
                                else
                                    setRecruitmentView("table");
                            }}>
                                {
                                    recruitmentView === 'table' ? <><i class="bi bi-table" style={{ marginRight: '5px' }}></i> Bảng tổng hợp</> :
                                        <> <i class="bi bi-list" style={{ marginRight: '5px' }}></i> Bài viết </>
                                }
                            </button>
                            {
                                recruitmentView === 'table' ?
                                    <table className="recruitment-management-table">
                                        <colgroup>
                                            <col></col>
                                            <col style={{ width: "15%" }}></col>
                                            <col style={{ width: "12%" }}></col>
                                            <col style={{ width: "10%" }}></col>
                                            <col style={{ width: "10%" }}></col>
                                            {/* <col style={{ width: "5px" }}></col> */}
                                        </colgroup>
                                        <thead>
                                            <tr>
                                                <td className="td--center td--sort" onClick={(event) => doSort(event, "name")}>
                                                    Tin tuyển dụng
                                                    <i className="bi bi-arrow-down"></i>
                                                </td>
                                                <td className="td--center td--sort sort--desc" onClick={(event) => doSort(event, "time")}>
                                                    Ngày đăng
                                                    <i className="bi bi-arrow-down"></i>
                                                </td>
                                                <td className="td--center td--sort" onClick={(event) => doSort(event, "endDate")}>
                                                    Ngày kết thúc
                                                    <i className="bi bi-arrow-down"></i>
                                                </td>
                                                <td className="td--center">Ứng tuyển</td>
                                                <td className="td--center">Trạng thái</td>
                                                {/* <td className="td--center"></td> */}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                recruitments.map(recruitment =>
                                                    <tr>
                                                        <td className="td--recruitment-name">
                                                            <Link to={globalState.links.recruitmentDetailLink + "?id=" + recruitment.id}>{recruitment.name}</Link>
                                                        </td>
                                                        <td className="td--center">{new Date(recruitment.time).toLocaleString()}</td>
                                                        <td className="td--center">{new Date(recruitment.endDate).toLocaleDateString()}</td>
                                                        <td className="td--center"><Link to={globalState.links.employerApplicationManagementLink + "?recruitment=" + recruitment.name} target="_blank">...</Link></td>
                                                        <td className={"td--recruitment-status td--center status--" + recruitment.status.trim()} onClick={() => willChangeStatus(recruitment)}>{recruitment.status}</td>
                                                    </tr>
                                                )
                                            }
                                        </tbody>
                                    </table>
                                    :
                                    <div className="recruitment-management-list">
                                        {
                                            recruitments.map(recruitment => <Recruitment recruitment={recruitment}></Recruitment>)
                                        }
                                    </div>
                            }
                        </>
                    }
                </div>
                {
                    curViewTab === "report" &&
                    <EmployerReport />
                }
            </div>
            {updateEndDatePrompt}
        </div>
    )
}