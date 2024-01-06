import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { STATECONTEXT } from "../../App";
import Recruitment from "../elements/recruitment";
import "../../css/recruitmentDetailPage.css";
import Mail from "../form/application";
import TaskBar from "../elements/taskbar";
import Application from "../form/application";
import { useRole } from "../../service/authenticate";

export default function RecruitmentDetailPage(props) {
    const [globalState, setGlobalState] = useContext(STATECONTEXT);
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const id = params.get("id");
    const [recruitment, setRecruitment] = useState();
    const mailElement = useRef();
    const user = useRole();
    const navigate = useNavigate();

    useEffect(() => {
        // setMail(defaultMail);
        axios.get(globalState.appServer + globalState.api.getRecruitmentById + id)
            .then(response => response.data)
            .then(data => setRecruitment(data))
    }, [])

    const willApply = function () {
        if (user.role !== "ROLE_EMPLOYEE") {
            navigate(globalState.links.loginLink);
        }
        mailElement.current.style.display = 'block';
    }

    return (
        <div className="recruitment-detail-page">
            <TaskBar />
            <div className="recruitment-detail-page-content">
                <Recruitment recruitment={recruitment} />
            </div>
        </div>
    )
}