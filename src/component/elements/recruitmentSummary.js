import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { STATECONTEXT } from "../../App";
import "../../css/recruitmentSummary.css";

export default function RecruitmentSummary(props) {
    const [globalState, setGlobalState] = useContext(STATECONTEXT);
    return (
        <div className="recruitment-summary"
            onClick={() => window.open(globalState.links.recruitmentDetailLink + '?id=' + (props.recruitment !== undefined ? props.recruitment.id : ""), "_blank")}
        >
            <div className="recruitment-summary-header">
                <div className="recruitment-summary-header-company-logo">
                    <img src={props.recruitment !== undefined ? props.recruitment.employer.company.logo : undefined}></img>
                </div>
                <div className="recruitment-summary-header-information">
                    <div className="recruitment-summary-header-name"
                    title={props.recruitment !== undefined ? props.recruitment.name : undefined}>
                        {props.recruitment !== undefined ? props.recruitment.name : undefined}
                    </div>
                    <div className="recruitment-summary-header-company-name">
                        <i className="bi bi-building"></i>
                        {props.recruitment !== undefined ? props.recruitment.employer.company.name : undefined}
                    </div>
                </div>
            </div>

            <div className="recruitment-summary-information">
                <div className="recruitment-summary-information-address">
                    <i className="bi bi-geo-alt-fill"></i>
                    {props.recruitment !== undefined ? props.recruitment.address.province : undefined}
                </div>
                <div className="recruitment-summary-information-wage">
                    <i className="bi bi-cash-coin"></i>
                    {props.recruitment !== undefined ? props.recruitment.wage : undefined}
                </div>
                <div className="recruitment-summary-information-domains"
                title={props.recruitment !== undefined && props.recruitment.domains.map(domain => " "+domain)} >
                    <i className="bi bi-layout-three-columns"></i>
                    {props.recruitment !== undefined && props.recruitment.domains.map(domain => domain + ", ")}
                </div>
                <div className="recruitment-summary-information-skills"
                title={props.recruitment !== undefined && props.recruitment.skills.map(skill => " " + skill)}>
                    <i className="bi bi-lightbulb"></i>
                    {props.recruitment !== undefined && props.recruitment.skills.map(skill => skill + ", ")}
                </div>
            </div>
        </div>
    )
};