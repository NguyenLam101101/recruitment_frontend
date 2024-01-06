import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import "../../css/editCVPage.css";
import TaskBar from "../elements/taskbar";
import { useRole } from "../../service/authenticate";
import { STATECONTEXT } from "../../App";
import UploadCv from "../form/uploadCv";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import axios from "axios";
import PopUp from "../elements/popUp";

export default function EditCVPage(props) {
    const { templateId } = useParams()
    const cvIframe = useRef();
    const cvNameInput = useRef();
    const uploadCvElement = useRef();
    const [cvTemplate, setCVTemplate] = useState("");
    const [cvFile, setCVFile] = useState();
    const user = useRole();
    const [params, setParams] = useSearchParams();
    const id = params.get("id");
    const [tabView, setTabView] = useState("new");
    const [globalState, setGlobalState] = useContext(STATECONTEXT);
    const [isShowUploadForm, setIsShowUploadForm] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if(!id){
            fetch("cvTemplate/template1.html")
            .then(response => response.text())
            .then(htmlContent => setCVTemplate(htmlContent));
        }
        else{
            setTabView("edit");
            axios.get(globalState.appServer + globalState.api.getCvById + "?id=" + id, {withCredentials: true})
            .then(response => response.data)
            .then(data => {
                setCVTemplate(data.htmlContent);
                cvNameInput.current.value = data.name.slice(0, -5);
            });
        }
    }, [id]);

    useEffect(() => {
        if (user && user.role !== "ROLE_EMPLOYEE") {
            if (window.confirm("Vui lòng đăng nhập!")) {
                navigate(globalState.links.loginLink);
            }
            else {
                navigate(globalState.links.homeLink);
            }
        }
       
    }, [user]);

    const exportToHTML = () => {
        let HTMLContent = '<html lang="en">' + cvIframe.current.contentDocument.documentElement.innerHTML + '</html>';
        // console.log(HTMLContent);
        let blob = new Blob([HTMLContent], { type: 'text/html' });
        let fileName = cvNameInput.current.value.trim() !== "" ? cvNameInput.current.value.trim() + ".html" : "CV không có tiêu đề.html";
        let file = new File([blob], fileName, { type: 'text/html' });
        setCVFile(file);
        setIsShowUploadForm(true);
    }

    const exportToPDF = () => {
        let HTMLElement = cvIframe.current.contentDocument.documentElement;
        let fileName = cvNameInput.current.value.trim() !== "" ? cvNameInput.current.value.trim() + ".pdf" : "CV không có tiêu đề.pdf";
        html2canvas(HTMLElement)
            .then(canvas => {
                const url = canvas.toDataURL('image/png');
                const jspdf = new jsPDF();
                jspdf.addImage(url, 'PNG', 0, 0, 210, 297);
                jspdf.save(fileName);
                // aElement.click();
            });
    }

    return (
        <div className="edit-cv-page" style={{ width: '100%', height: "100%" }}>
            <TaskBar />
            <div className="edit-cv-page-content">
                <div className="edit-cv-page-cv-name">
                    <label>Đặt tên cho CV</label>
                    <input type="text" ref={cvNameInput} 
                        placeholder="CV không có tiêu đề"></input>
                </div>
                <div className="edit-cv-page-edit-container">
                    <iframe className="edit-cv-page-template"
                        onResize={(event) => {
                            event.target.style.height = event.target.offsetWidth / 210 * 297 + "px";
                        }}
                        onLoad={(event => {
                            event.target.style.height = event.target.offsetWidth / 210 * 297 + "px";
                            // Set CSS global variable using JavaScript
                            cvIframe.current.contentDocument.documentElement.style.setProperty('--width', event.target.offsetWidth + "px");
                        })}
                        srcDoc={cvTemplate}
                        ref={cvIframe}>
                    </iframe>
                    <div className="edit-cv-page-buttons">
                        <button onClick={exportToHTML}>Lưu</button>
                        <button onClick={exportToPDF}>Tải xuống PDF</button>
                    </div>
                </div>
                <PopUp
                    content={<UploadCv
                        type="html"
                        tabView={tabView}
                        file={cvFile}
                        cvId={id}
                        cancel={() => uploadCvElement.current.style.display = 'none'}
                        success={() => {
                            uploadCvElement.current.style.display = 'none';
                        }}
                    />}
                    isDisplay={isShowUploadForm}
                    close={() => setIsShowUploadForm(false)}
                    title="Kiểm tra lại thông tin"
                >
                </PopUp>       
                </div>
            </div>
    )
}