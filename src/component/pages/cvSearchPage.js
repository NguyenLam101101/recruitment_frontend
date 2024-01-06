import { useContext, useEffect, useRef, useState } from "react";
import TaskBar from "../elements/taskbar";
import CvSearch from "../form/cvSearch";
import { STATECONTEXT } from "../../App";
import { useNavigate, useSearchParams } from "react-router-dom";
import CvSummary from "../elements/cvSummary";
import "../../css/cvSearchPage.css"
import axios from "axios";
import EmployerTaskbar from "../elements/employerTaskbar";

export default function CvSearchPage() {
    const [globalState, setGlobalState] = useContext(STATECONTEXT);
    const [cvs, setCvs] = useState([]);
    const navigate = useNavigate();
    const [params, setParams] = useSearchParams();
    const [domains, setDomains] = useState([]);
    const [skills, setSkills] = useState([]);
    const [experience, setExperience] = useState(0);

    useEffect(() => {
        if(params.get("domains")){
            setDomains(params.get("domains").split(","));
        }
        if(params.get("skills")){
            setSkills(params.get("skills").split(","));
        }
        if(params.get("experience")){
            setExperience(parseInt(params.get("experience")));
        }

        let formData = new FormData();
        formData.set("domains", params.get("domains") ? params.get("domains").split(",") : []);
        formData.set("skills", params.get("skills") ? params.get("skills").split(",") : []);
        formData.set("experience", parseInt(params.get("experience")) ? parseInt(params.get("experience")) : 0);
        axios.post(globalState.appServer + globalState.api.searchCvs, formData, {withCredentials: true})
        .then(response => response.data ? response.data : [])
        .then(data => setCvs(data));
    }, [params.get("domains"), params.get("skills"), params.get("experience")]);
   

    return (
        <div className="cv-search-page">
            <EmployerTaskbar />
            <div className="cv-search-page-content">
                <CvSearch 
                    defaultDomains={domains}
                    defaultSkills={skills}
                    defaultExperience={experience}/>
                <div className="cv-search-results">
                    <div className="cv-search-results-title">Một số CV phù hợp nhu cầu của bạn!</div>
                    <div className="cv-search-results-container">
                        {
                            cvs.map(cv =>
                                <CvSummary key={cv.id} cv={cv} />
                            )
                        }
                    </div>

                </div>
            </div>
        </div>
    )
}