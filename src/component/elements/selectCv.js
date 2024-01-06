import CvSummary from "./cvSummary";
import "../../css/selectCv.css";
import { useContext, useEffect, useState } from "react";
import { STATECONTEXT } from "../../App";
import axios from "axios";

export default function SelectCv(props) {
    const [globalState, setGlobalState] = useContext(STATECONTEXT);
    const [selectedCvId, setSelectedCvId] = useState();
    const [selectedCvName, setSelectedCvName] = useState();
    const [cvs, setCvs] = useState([]);

    useEffect(() =>{
        if(globalState.cvs !== undefined){
            setCvs(globalState.cvs);
        }
        else{
            axios.get(globalState.appServer + "/employee/get-cvs", {withCredentials: true})
            .then(response => response.data !== undefined ? response.data : [])
            .then(data => {
                setCvs(data);
                setGlobalState({...globalState, cvs: data});
            })
            .catch(error => console.error(error));
        }
    }, []);

    const addCv = (event) =>{
        setSelectedCvId(event.currentTarget.getAttribute('cv_id'));
        setSelectedCvName(event.currentTarget.getAttribute('cv_name'));
        Array.from(document.getElementsByClassName("cv-summary")).forEach(element =>{
            if(element === event.currentTarget){
                element.style.opacity = '0.4';
            }
            else{
                element.style.opacity = '1';
            }
        })
    }

    return (
        <div className="select-cv">
            <div className="select-cv-list">
                {
                    cvs.map(cv => <CvSummary cv={cv} handleClick={addCv} editable={false}/>)
                }
            </div>
            <div className="select-cv-button">
                <button className="select-cv-select-button" onClick={() => props.select(selectedCvId, selectedCvName)}>Chọn</button>
            </div>
        </div>
    )
}