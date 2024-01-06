import React, { useContext, useEffect, useRef, useState } from "react";
import TaskBar from "../elements/taskbar";
import "../../css/cvManagementPage.css";
import UploadCv from "../form/uploadCv";
import axios from "axios";
import { STATECONTEXT } from "../../App";
import CvSummary from "../elements/cvSummary";
import { useRole } from "../../service/authenticate";
import { Link, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import PopUp from "../elements/popUp";


export default function CvManagementPage(props) {
    const [globalState, setGlobalState] = useContext(STATECONTEXT);
    const navigate = useNavigate();
    const uploadCvElement = useRef();
    const [isShowUploadCV, setIsShowUploadCV] = useState(false);
    const user = useRole();
    const [cvs, setCvs] = useState([]);
    const [curViewTab, setCurViewTab] = useState("myCVs");


    const getCvs = () => {
        axios.get(globalState.appServer + "/employee/get-cvs", { withCredentials: true })
            .then(response => response.data !== undefined ? response.data : [])
            .then(data => {
                setCvs(data);
                setGlobalState({ ...globalState, cvs: data });
            });
    }

    useEffect(() => {
        // check role
        if (user && user.role !== "ROLE_EMPLOYEE") {
            if (window.confirm("Vui lòng đăng nhập!")) {
                navigate(globalState.links.loginLink);
            }
            else {
                navigate(globalState.links.homeLink);
            }
        } else {
            if (globalState.cvs !== undefined) {
                setCvs(globalState.cvs);
            }
            else {
                getCvs();
            }
        }

    }, [user]);

    return (
        <div className="cv-management-page">
            <TaskBar />
            <div className="cv-management-page-content">
                <div className="cv-management-page-content-menu">
                    <button className="menu-my-cvs"
                        onClick={() => setCurViewTab("myCVs")}>
                        <i className="bi bi-arrow-up-square"></i>
                        CV của tôi
                    </button>
                    <button className="menu-cv-template"
                        onClick={() => setCurViewTab("createCV")}>
                        <i className="bi bi-pencil-square"></i>
                        Tạo CV từ mẫu
                    </button>
                </div>
                {
                    curViewTab === "myCVs" &&
                    <div className="cv-management-page-content-myCVs">
                        <button className="cv-management-page-content-upload-cv-button"
                            onClick={() => setIsShowUploadCV(true)}>
                            <i className="bi bi-arrow-up-square"></i>
                            Tải lên CV
                        </button>
                        <div className="cv-management-page-content-cvs">
                            {
                                cvs.length === 0 ?
                                    <span style={{ fontSize: '20px' }}>Bạn chưa tải lên CV nào</span>
                                    : cvs.map(cv =>
                                        <CvSummary cv={cv}
                                            handleClick={() => {
                                                if (cv.file.originalName.trim().toLowerCase().endsWith("html"))
                                                    navigate(globalState.links.editCVLink + "?id=" + cv.id)
                                                else
                                                    navigate(globalState.links.cvContentLink + "/" + cv.id);
                                            }}
                                            deleteHandle={getCvs}
                                        />)
                            }
                        </div>
                        <PopUp
                            isDisplay={isShowUploadCV}
                            title="Tải lên CV"
                            content={
                                <UploadCv
                                    success={() => {
                                        getCvs();
                                        setIsShowUploadCV(false);
                                    }}
                                />
                            }
                            close={() => setIsShowUploadCV(false)}
                        />
                    </div>
                }
                {
                    curViewTab === "createCV" &&
                    <div className="cv-management-page-cv-template">
                        <Link to={globalState.links.editCVLink}>
                            <div>Template1</div>
                        </Link>
                    </div>
                }
            </div>
        </div>
    );
}