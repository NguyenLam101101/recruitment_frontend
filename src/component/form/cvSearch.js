import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import "../../css/cvSearch.css";
import AddressInput from "../elements/addressInput.js";
import Button from "../elements/button.js";
import MultiObjectsInput from "../elements/multiObjectsInput";
import { STATECONTEXT } from "../../App";
import { useNavigate } from "react-router-dom";

function CvSearch(props) {
    const [domains, setDomains] = useState([]);
    const [skills, setSkills] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const searchForm = useRef();
    const domainSelectElement = useRef();
    const skillSelectElement = useRef();
    const provinceSelectElement = useRef();
    const [globalState, setGlobalState] = useContext(STATECONTEXT);
    const navigate = useNavigate();

    useEffect(() => {
        if (globalState.provinces)
            setProvinces(globalState.provinces);
        else
            axios.get(globalState.appServer + globalState.api.getProvinces)
            .then(response => response.data ? response.data : [])
            .then(data => {
                setProvinces(data);
                setGlobalState({...globalState, provinces: data});
            })

        if (globalState.domains)
            setDomains(globalState.domains);
        else
            axios.get(globalState.appServer + globalState.api.getDomains)
            .then(response => response.data ? response.data : [])
            .then(data => {
                setDomains(data);
                setGlobalState({...globalState, domains: data});
            })

        if (globalState.skills)
            setSkills(globalState.skills);
        else
            axios.get(globalState.appServer + globalState.api.getSkills)
            .then(response => response.data ? response.data : [])
            .then(data => {
                setSkills(data);
                setGlobalState({...globalState, skills: data});
            })
    }, []);

    useEffect(() => {
        if(parseInt(props.defaultExperience))
            document.getElementById("cv-search-experience-input").value = parseInt(props.defaultExperience);
    }, [props.defaultExperience]);

    // useEffect(() => {
    //     search();
    // }, [props.defaultProvinces, props.defaultExperience, props.defaultDomains, props.defaultSkills]);

    // const search = () => {
    //     const formData = new FormData(searchForm.current);
    //     formData.set("provinces", props.defaultProvinces);
    //     formData.set("domains", props.defaultDomains);
    //     formData.set("skills", props.defaultSkills);
    //     formData.set("experience", parseInt(props.defaultExperience) ? parseInt(props.defaultExperience) : 0);
    //     axios.post(globalState.appServer + globalState.api.searchCvs, formData)
    //     .then(response => response.data ? response.data : [])
    //     .then(data => {
    //         if(props.searchHandle)
    //             props.searchHandle(data);
    //     });
    // }

    const searchHandle = () => {
        navigate(globalState.links.cvSearchLink + "?" +
            "domains=" + domainSelectElement.current.getValue() + "&" +
            "skills=" + skillSelectElement.current.getValue() + "&" +
            "experience=" + document.getElementById("cv-search-experience-input").value
            )
    }

    return (
        <div className="cv-search">
            <div className="cv-search-title">
            Bạn muốn tìm CV như thế nào?
            </div>
            <form ref={searchForm}>
                <div className="cv-search-box">
                    {/* <AddressInput /> */}
                    {/* <MultiObjectsInput id="cv-search-provinces" 
                        label="Bạn muốn tìm công việc ở đâu?" 
                        objects={provinces.map(province => province.name)}
                        ref={provinceSelectElement}
                        defaultValue={props.defaultProvinces && props.defaultProvinces}/> */}
                    <div id="cv-search-experience">
                        <label>Số năm kinh nghiệm</label>
                        <input id="cv-search-experience-input" type="number" name="experience" defaultValue={0}></input>
                    </div>        
                    <MultiObjectsInput 
                        id="cv-search-domains" 
                        label="Vị trí bạn muốn tìm" 
                        objects={domains.map(domain => domain.name)}
                        ref={domainSelectElement}
                        defaultValue={props.defaultDomains && props.defaultDomains}/>
                    <MultiObjectsInput 
                        id="cv-search-skills" 
                        label="Những kỹ năng cần có" 
                        objects={skills.map(skill => skill.name)} 
                        ref={skillSelectElement}
                        defaultValue={props.defaultSkills && props.defaultSkills}/>
                </div>
                <div className="cv-search-button">
                    <button type="button" onClick={searchHandle}> 
                        <i className="bi bi-search"></i>
                        Tìm kiếm
                    </button>
                </div>
            </form>
        </div>
    )
}

export default CvSearch;