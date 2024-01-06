import { useContext, useEffect, useState } from "react"
import ApplicationManagement from "../elements/applicationManagement"
import TaskBar from "../elements/taskbar"
import { STATECONTEXT } from "../../App"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import "../../css/employeeApplicationManagementPage.css"

export default function EmployeeApplicationManagementPage(){
    const [globalState, setGlobalState] = useContext(STATECONTEXT);
    const [applications, setApplications] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(globalState.appServer + globalState.api.getApplicationsByEmployee, {withCredentials: true})
             .then(response => response.data !== undefined ? response.data : [])
             .then(data => {
                console.log(data);
                setApplications(data);
             })
             .catch(error => {
                console.log(error);
                if(error.response.status === 401)
                    navigate(globalState.links.loginLink);
             })
    }, []);

    return(
        <div className="employee-application-management-page">
            <TaskBar />
            <div className="employee-application-management-page-content">
                <ApplicationManagement mails={applications} recruitments={[...new Set(applications.map(applications => applications.recruitment.name))]} host={1}/>
            </div>
        </div>
    )
}