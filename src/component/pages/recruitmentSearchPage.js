import { useContext, useEffect, useRef, useState } from "react";
import TaskBar from "../elements/taskbar";
import RecruitmentSearch from "../form/recruitmentSearch";
import { STATECONTEXT } from "../../App";
import { useNavigate, useSearchParams } from "react-router-dom";
import RecruitmentSummary from "../elements/recruitmentSummary";
import "../../css/recruitmentSearchPage.css"
import axios from "axios";
import Loading from "../elements/loading";

export default function RecruitmentSearchPage() {
    const [globalState, setGlobalState] = useContext(STATECONTEXT);
    const [recruitments, setRecruitments] = useState([]);
    const navigate = useNavigate();
    const [params, setParams] = useSearchParams();
    const [provinces, setProvinces] = useState([]);
    const [domains, setDomains] = useState([]);
    const [skills, setSkills] = useState([]);
    const [experience, setExperience] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        if (params.get("provinces")) {
            setProvinces(params.get("provinces").split(","));
        }
        if (params.get("domains")) {
            setDomains(params.get("domains").split(","));
        }
        if (params.get("skills")) {
            setSkills(params.get("skills").split(","));
        }
        if (params.get("experience")) {
            setExperience(parseInt(params.get("experience")));
        }

        let formData = new FormData();
        formData.set("provinces", params.get("provinces") ? params.get("provinces").split(",") : []);
        formData.set("domains", params.get("domains") ? params.get("domains").split(",") : []);
        formData.set("skills", params.get("skills") ? params.get("skills").split(",") : []);
        formData.set("experience", parseInt(params.get("experience")) ? parseInt(params.get("experience")) : 0);
        axios.post(globalState.appServer + globalState.api.searchRecruitments, formData)
            .then(response => response.data ? response.data : [])
            .then(data => setRecruitments(data))
            .finally(() => setIsLoading(false));
    }, [params.get("provinces"), params.get("domains"), params.get("skills"), params.get("experience")]);


    const onSearch = (data) => {
        setRecruitments(data);
    }

    return (
        <div className="recruitment-search-page">
            <TaskBar />
            <div className="recruitment-search-page-content">
                <RecruitmentSearch
                    searchHandle={onSearch}
                    defaultProvinces={provinces}
                    defaultDomains={domains}
                    defaultSkills={skills}
                    defaultExperience={experience} />
                <div className="recruitment-search-results">
                    <div className="recruitment-search-results-title">Những việc làm sau có thể phù hợp với bạn!</div>
                    {
                        !isLoading &&
                        <div className="recruitment-search-results-container">
                            {
                                recruitments.map(recruitment =>
                                    <RecruitmentSummary key={recruitment.id} recruitment={recruitment} />
                                )
                            }
                        </div>
                    }
                    {
                        isLoading && <Loading />
                    }
                </div>
            </div>
        </div>
    )
}