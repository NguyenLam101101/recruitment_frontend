import { useContext, useEffect, useRef } from "react";
import { STATECONTEXT } from "../../App";
import "../../css/cvSummary.css"
import axios from "axios";
import { useRole } from "../../service/authenticate";

export default function CvSummary(props) {
    const [globalState, setGlobalState] = useContext(STATECONTEXT);
    const cvBackground = useRef();
    const user = useRole();

    useEffect(() => {
        if (props.cv) {
            let split_name = props.cv.file.originalName.split(".");
            let type = split_name[split_name.length - 1];
            cvBackground.current.className = "cv-summary-information " + type.toLowerCase();
        }
    }, [props.cv]);

    const deleteCv = (event) => {
        event.stopPropagation();
        if (window.confirm("Bạn có muốn xóa CV này không?")) {
            axios.delete(globalState.appServer + globalState.api.deleteCv + props.cv.id, { withCredentials: true })
                .then(response => {
                    if (props.deleteHandle)
                        props.deleteHandle()
                })
        }
    }

    return (
        <div className="cv-summary"
            title={props.cv ?
                (props.cv.file ? props.cv.file.originalName :
                    (props.cv.file ? props.cv.file.originalName : ""))
                : ""
            }
            onClick={props.handleClick}
            cv_id={props.cv ? props.cv.id : undefined}
            cv_name={props.cv ?
                (props.cv.file ? props.cv.file.originalName :
                    (props.cv.file ? props.cv.file.originalName : ""))
                : ""} >
            <div className="cv-summary-name">
                {props.cv ?
                    (props.cv.file ? props.cv.file.originalName :
                        (props.cv.file ? props.cv.file.originalName : ""))
                    : ""}
            </div>
            <div className="cv-summary-information" ref={cvBackground}>
                <div className="cv-summary-information-domains">
                    <i className="bi bi-layout-three-columns"></i>
                    {props.cv ?
                        props.cv.domains.map(domain => domain + ", ")
                        : undefined}
                </div>
                <div className="cv-summary-information-skills">
                    <i className="bi bi-lightbulb"></i>
                    {props.cv ?
                        props.cv.skills.map(skill => skill + ", ")
                        : undefined}
                </div>
                <div className="cv-summary-information-address">
                    <i className="bi bi-geo-alt"></i>
                    {props.cv ?
                        props.cv.provinces.map(province => province + ", ")
                        : undefined}
                </div>
            </div>
            {
                props.editable !== false && props.cv && user && props.cv.employee.id === user.profile.id &&
                <div className="cv-summary-delete">
                    <i className="bi bi-trash" onClick={(event) => deleteCv(event)} title="Xóa CV"></i>
                </div>
            }
        </div >
    )
}