import EmployerTaskbar from "../elements/employerTaskbar";
import MailSummary from "../elements/mailSummary";
import "../../css/employerApplicationManagementPage.css";
import { useContext, useEffect, useRef, useState } from "react";
import { STATECONTEXT } from "../../App";
import axios from "axios";
import MailDetail from "../elements/mailDetail";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Recruitment from "../elements/recruitment";
import EmployerReport from "../elements/employerReport";
import ApplicationManagement from "../elements/applicationManagement";
import MultiObjectsInput from "../elements/multiObjectsInput";

export default function EmployerApplicationManagementPage(props) {
    const [mails, setMails] = useState([]);
    const [filterMails, setFilterMails] = useState([]);
    const [recruitments, setRecruitments] = useState([]);
    const [globalState, setGlobalState] = useContext(STATECONTEXT);
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const recruitment = params.get("recruitment");
    const navigate = useNavigate();
    const [domains, setDomains] = useState([]);
    const [skills, setSkills] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const domainSelectElement = useRef();
    const skillSelectElement = useRef();
    const provinceSelectElement = useRef();

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

    const getMails = () => {
        axios.get(globalState.appServer + "/employer/get-applications", { withCredentials: true })
            .then(response => response !== undefined ? response.data : [])
            .then(data => {
                data.sort((a, b) => {
                    if (a.currentMail.time <= b.currentMail.time)
                        return 1
                    else
                        return -1
                });
                setMails(data);
                setFilterMails(data);
            })
            .catch((error) => {
                console.error(error);
                if (error.response.status === 401)
                    navigate(globalState.links.loginLink);
            })
    };

    useEffect(() => {
        if (recruitment !== null) {
            document.getElementsByName("recruitment-name")[0].value = recruitment;
        }
        getMails();
        getRecruitments();
        // setInterval(getMails, 15000);

        if (globalState.provinces)
            setProvinces(globalState.provinces);
        else
            axios.get(globalState.appServer + globalState.api.getProvinces)
                .then(response => response.data ? response.data : [])
                .then(data => {
                    setProvinces(data);
                    setGlobalState({ ...globalState, provinces: data });
                })

        if (globalState.domains)
            setDomains(globalState.domains);
        else
            axios.get(globalState.appServer + globalState.api.getDomains)
                .then(response => response.data ? response.data : [])
                .then(data => {
                    setDomains(data);
                    setGlobalState({ ...globalState, domains: data });
                })

        if (globalState.skills)
            setDomains(globalState.skills);
        else
            axios.get(globalState.appServer + globalState.api.getSkills)
                .then(response => response.data ? response.data : [])
                .then(data => {
                    setSkills(data);
                    setGlobalState({ ...globalState, skills: data });
                })
    }, []);

    const filterCV = () => {
        let selectedDomains = domainSelectElement.current.getValue();
        let selectedSkills = skillSelectElement.current.getValue();
        let selectedProvinces = provinceSelectElement.current.getValue();
        let experience = document.getElementById("cv-filter-experience-input").value;
        let filterMails1 = [...mails];
        filterMails1 = filterMails1.filter(mail => {
            if(selectedProvinces.length === 0)
                return true;
            for(var province of selectedProvinces)
                if(mail.cv && mail.cv.provinces.includes(province))
                    return true
            return false
        })
        filterMails1 = filterMails1.filter(mail => {
            if(selectedDomains.length === 0)
                return true;
            for(var domain of selectedDomains)
                if(mail.cv && mail.cv.domains.includes(domain))
                    return true
            return false
        })
        filterMails1 = filterMails1.filter(mail => {
            if(selectedSkills.length === 0)
                return true;
            for(var skill of selectedSkills)
                if(mail.cv && mail.cv.skills.includes(skill))
                    return true
            return false
        })
        filterMails1 = filterMails1.filter(mail => mail.cv && mail.cv.experience >= experience);
        setFilterMails(filterMails1);
    }

    return (
        <div className="employer-application-management-page">
            <EmployerTaskbar />
            <div className="employer-application-management-page-content">
                <div className="employer-application-management-page-cv-filter-container">
                    <div style={{fontWeight: '600', borderBottom: '1px solid darkgray', marginBottom: '10px'}}>Lọc CV của ứng viên</div>
                    <div className="employer-application-management-page-cv-filter">
                        <MultiObjectsInput id="cv-filter-provinces"
                            label="Địa chỉ"
                            objects={provinces.map(province => province.name)}
                            ref={provinceSelectElement}
                        // defaultValue={props.defaultProvinces && props.defaultProvinces} 
                        />
                        <div id="cv-filter-experience">
                            <label>Kinh nghiệm</label>
                            <input id="cv-filter-experience-input" type="number" name="experience" defaultValue={0}></input>
                        </div>
                        <MultiObjectsInput
                            id="cv-filter-domains"
                            label="Vị trí"
                            objects={domains.map(domain => domain.name)}
                            ref={domainSelectElement}
                        // defaultValue={props.defaultDomains && props.defaultDomains} 
                        />
                        <MultiObjectsInput
                            id="cv-filter-skills"
                            label="Kỹ năng"
                            objects={skills.map(skill => skill.name)}
                            ref={skillSelectElement}
                        // defaultValue={props.defaultSkills && props.defaultSkills} 
                        />
                    </div>
                    <div className="cv-filter-button">
                        <button onClick={filterCV}>Lọc</button>
                    </div>
                </div>
                <ApplicationManagement mails={filterMails} recruitments={recruitments.map(recruitment => recruitment.name)} host={0} />
            </div>
        </div>
    )
}