import { PowerBIEmbed } from 'powerbi-client-react';
import { models, embed } from 'powerbi-client';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { STATECONTEXT } from '../../App';
import "../../css/employerReport.css";
import { useNavigate } from 'react-router-dom';

export default function EmployerReport(props) {
    const [globalState, setGlobalState] = useContext(STATECONTEXT);
    const [embedInfo, setEmbedInfo] = useState({employer_id: "", embedToken: ""});
    const navigate = useNavigate();

    useEffect(() => {
        resizeFrame();

        // axios.get(globalState.appServer + globalState.api.getEmployerPowerBI, { withCredentials: true })
        //     .then(response => response.data)
        //     .then(data => {
        //         setEmbedInfo(data);
        //     })
        //     .catch((error) => { 
        //         console.log(error);
        //         if(error.response.status === 401)
        //             navigate(globalState.links.loginLink);
        //     });
    }, []);

    const resizeFrame = () => {
        let reportFrame = document.getElementById("employer-report-container");
        let frameWidth = reportFrame.offsetWidth;
        reportFrame.style.height = frameWidth/1280*1000 + "px";
    }

    return (
        <div className='employer-report' id="employer-report-container" onResize={resizeFrame}>
            <PowerBIEmbed
                embedConfig={
                    {
                        accessToken: embedInfo.embedToken,
                        // embedUrl: "https://app.powerbi.com/reportEmbed?reportId=21df951f-2906-4e16-b002-c665471e546f",
                        embedUrl: "https://app.powerbi.com/view?r=eyJrIjoiNjEzYTJkNDEtNDFmYy00OWVhLTlkNTQtMzAwY2Q1MWY4NTJjIiwidCI6IjA0NzM1MDczLTdkNGMtNDgyMS1iMjViLWQxZWIzN2U2NzA1NyIsImMiOjEwfQ%3D%3D",
                        id: "21df951f-2906-4e16-b002-c665471e546f",
                        permissions: models.Permissions.Read,
                        tokenType: models.TokenType.Embed,
                        type: 'report',
                        pageName: 'employerReport',
                        filters: 
                            [{
                                $schema: "http://powerbi.com/product/schema#advanced",
                                target: {
                                    table: "recruitment_olap dim_employer",
                                    column: "_id"
                                },
                                operator: "In",
                                values: [embedInfo.employer_id],
                                filterType: models.FilterType.BasicFilter,
                                requireSingleSelection: true
                            },
                            {
                                $schema: "http://powerbi.com/product/schema#advanced",
                                target: {
                                    table: "recruitment_olap dim_recruitment",
                                    column: "employer_id"
                                },
                                operator: "In",
                                values: [embedInfo.employer_id],
                                filterType: models.FilterType.BasicFilter,
                                requireSingleSelection: true
                            }],
                        settings: {
                            filterPaneEnabled: false,
                            navContentPaneEnabled: false
                        }
                    }
                }

                cssClassName={"report-frame"}
                // getEmbeddedComponent={
                //     (embeddedReport) => {
                //         window.report = embeddedReport;
                //     }
                // }
            />
        </div>
    )
}