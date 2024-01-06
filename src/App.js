import './App.css';
import { Route, Routes } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';
import HomePage from './component/pages/homePage';
import NewsPage from './component/pages/newsPage';
import CvManagementPage from './component/pages/cvManagementPage';
import EmployeeSignupPage from './component/pages/employeeSignupPage';
import { createContext } from 'react';
import LoginPage from './component/pages/loginPage';
import EmployerHomePage from './component/pages/employerHomePage';
import EmployerSignupPage from './component/pages/employerSignupPage';
import CompanyRegister from './component/form/companyRegister';
import RecruitmentDetailPage from './component/pages/recruitmentDetailPage';
import CvContentPage from './component/pages/cvContentPage';
import ApplicationDetailPage from './component/pages/applicationDetailPage';
import EmployerApplicationManagementPage from './component/pages/employerApplicationManagement';
import EmployeeApplicationManagementPage from './component/pages/employeeApplicationManagement';
import RecruitmentManagementPage from './component/pages/recruitmentManagementPage';
import EditCVPage from './component/pages/editCVPage';
import RecruitmentSearchPage from './component/pages/recruitmentSearchPage';
import CvSearchPage from './component/pages/cvSearchPage';
import SavedRecuitmentsPage from './component/pages/savedRecruitmentsPage';

export const STATECONTEXT = createContext();

function App(props) {
  const [globalState, setGlobalState] = useState({
    appServer: 'http://34.126.171.123/api',
    links: {
      homeLink: "/",
      newsLink: "/news",
      loginLink: "/login",
      signupLink: "/sign-up",
      employerSignupLink: "/employer/sign-up",
      companyRegisterLink: "/employer/company-register",
      employerHomeLink: "/employer",
      employerApplicationManagementLink: "/employer/application-management",
      recruitmentManagementLink: "/employer/recruitment-management",
      employeeApplicationManagementLink: "/application-management",
      cvPageLink: "/cv-management",
      recruitmentDetailLink: "/recruitment",
      cvContentLink: "/cv",
      applicationDetailLink: "/application",
      editCVLink: "/edit-cv",
      recruitmentSearchLink: "/search-recruitment",
      cvSearchLink: "/employer/search-cv",
      savedRecruitmentsLink: "/employee/saved-recruitments"
    },
    api:{
      employeeSignup: "/signup-employee",
      employerSignup: "/signup-employer",
      getProvinces: "/get-provinces",
      getDomains: "/get-domains",
      getSkills: "/get-skills",
      hasLoggedIn: "/user/has-logged-in",
      getCvById: "/user/get-cv-by-id",
      getRecruitmentById: "/get-recruitment-by-id?id=",
      getNewRecruitments: "/get-new-recruitments",
      getApplicationById: "/user/get-application-by-id?id=",
      approveApplication: "/employer/approve-application",
      getEmployerPowerBI: "/employer/get-power-bi-embed-info",
      finishApplication: "/employer/finish-application",
      getApplicationsByEmployee: "/employee/get-applications",
      replyMail: "/user/reply-mail",
      uploadCv: "/employee/upload-cv",
      updateCV: "/employee/update-cv",
      getMostSuitableRecruitments : "/employee/get-most-suitable-recruitments",
      searchRecruitments: "/search-recruitments",
      searchCvs: "/employer/search-cvs",
      hasCompany: "/employer/has-company",
      deleteCv: "/employee/delete-cv?id=",
      react: "/user/react",
      getReaction: "/user/get-reaction",
      comment: "/user/comment",
      getComments: "/get-comments",
      replyComment: "/user/reply-comment",
      saveRecruitment: "/employee/save-recruitment",
      deleteComment: "/user/delete-comment",
      deleteCommentResponse: "/user/delete-comment-response",
      getSavedRecruitments: "/employee/get-saved-recruitments",
      getNotifications: "/user/get-notifications",
      readNotification: "/user/read-notification"
    }
  });

  useEffect(() => async function () {
        //check login
        axios.get(globalState.appServer + globalState.api.hasLoggedIn, {withCredentials: true})
        .then(response => response.data !== undefined ? response.data : "")
        .then(role => setGlobalState({...globalState, role: role}))
        .catch(() =>  setGlobalState({...globalState, role: ""}));

        //get provinces
        let response = await axios.get(globalState.appServer + globalState.api.getProvinces);
        let provinces = (response.data !== undefined) ? response.data : [];
        setGlobalState({...globalState, provinces: provinces});

        //get domains
        response = await axios.get(globalState.appServer + "/get-domains");
        let domains = (response.data !== undefined) ? response.data : [];
        setGlobalState({...globalState, domains: domains});

        //get skills
        response = await axios.get(globalState.appServer + "/get-skills");
        let skills = (response.data !== undefined) ? response.data : [];
        setGlobalState({...globalState, skills: skills});
  }, []);

  return (
    <STATECONTEXT.Provider value={[globalState, setGlobalState]}>
       <Routes>
         <Route path={globalState.links.homeLink} element={<HomePage />} />
         <Route path={globalState.links.newsLink} element={<NewsPage />} />
         <Route path={globalState.links.loginLink} element={<LoginPage />} />
         <Route path={globalState.links.signupLink} element={<EmployeeSignupPage />} />
         <Route path={globalState.links.cvPageLink} element={<CvManagementPage />} >
         <Route path=':viewTab' element={<CvManagementPage />}/>
         </Route>
         <Route path={globalState.links.employerSignupLink} element={<EmployerSignupPage />} />
         <Route path={globalState.links.employerHomeLink} element={<EmployerHomePage />} />
         <Route path={globalState.links.companyRegisterLink} element={<CompanyRegister />} />
         <Route path={globalState.links.employerApplicationManagementLink} element={<EmployerApplicationManagementPage />} />
         <Route path={globalState.links.recruitmentDetailLink} element={<RecruitmentDetailPage />}/>
         <Route path={globalState.links.cvContentLink} element={<CvContentPage />}>
           <Route path=':id' element={<CvContentPage />}></Route>
         </Route>
         <Route path={globalState.links.applicationDetailLink} element={<ApplicationDetailPage />}/>
         <Route path={globalState.links.employeeApplicationManagementLink} element={<EmployeeApplicationManagementPage />}/>
         <Route path={globalState.links.recruitmentManagementLink} element={<RecruitmentManagementPage/>}>
         <Route path=':viewTab' element={<RecruitmentManagementPage />}/>
         </Route>
         <Route path={globalState.links.editCVLink} element={<EditCVPage/>}>
          <Route path=':templateId' element={<RecruitmentManagementPage />}/>
         </Route>
         <Route path={globalState.links.recruitmentSearchLink} element={<RecruitmentSearchPage />}/>
         <Route path={globalState.links.cvSearchLink} element={<CvSearchPage />}/>
         <Route path={globalState.links.savedRecruitmentsLink} element={<SavedRecuitmentsPage />}/>
       </Routes>
    </STATECONTEXT.Provider>    
  );
}

export default App;
