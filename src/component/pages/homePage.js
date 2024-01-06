import { useState, useEffect, useContext, useRef } from "react";
import TaskBar from "../elements/taskbar";
import RecruitmentSearch from "../form/recruitmentSearch";
import "../../css/homePage.css";
import axios from "axios";
import { STATECONTEXT } from "../../App";
import RecruitmentSummary from "../elements/recruitmentSummary";
import { useNavigate } from "react-router-dom";
import { useRole } from "../../service/authenticate";
import Loading from "../elements/loading";
import Recruitment from "../elements/recruitment";
import InfiniteScroll from "react-infinite-scroll-component";

function HomePage(props) {
    const [page, setPage] = useState(0);
    // const [pageValue, setPageValue] = useState([]);
    // const _PAGE_SIZE = 12;
    // const slider = useRef();
    // const [isLoading, setIsLoading] = useState(true);
    // let _MAX_PAGE = Math.ceil(_ROW_LIMIT / _PAGE_SIZE);
    const [hasMore, setHasMore] = useState(true);
    const _ROW_LIMIT = 10;
    const [globalState, setGlobalState] = useContext(STATECONTEXT);
    const navigate = useNavigate();
    const user = useRole();
    const [recruitments, setRecruitments] = useState([])

    useEffect(() => {
        if (user && user.role === "ROLE_EMPLOYER") {
            if (window.confirm("Chuyển sang website cho nhà tuyển dụng?"))
                navigate(globalState.links.employerHomeLink);
        }
        // if (role === "ROLE_EMPLOYEE") {
        //     axios.get(globalState.appServer + globalState.api.getMostSuitableRecruitments, { withCredentials: true })
        //         .then(response => response.data !== undefined ? response.data : [])
        //         .then(data => {
        //             setRecruitments(data);
        //             // setGlobalState({ ...globalState, newRecruitments: data });
        //             // embedRecruitment(data);
        //         })
        //         .finally(() => setIsLoading(false));
        // } else {
        //     if (globalState.newRecruitments !== undefined) {
        //         setRecruitments(globalState.newRecruitments);
        //         // embedRecruitment(globalState.newRecruitments);
        //     } else {
        //         axios.get(globalState.appServer + globalState.api.getNewRecruitments + page.toString() + "&pageSize=" + _ROW_LIMIT)
        //             .then(response => response.data !== undefined ? response.data : [])
        //             .then(data => {
        //                 setGlobalState({ ...globalState, newRecruitments: data });
        //                 setRecruitments(data);
        //                 // embedRecruitment(data);
        //             })
        //             .finally(() => setIsLoading(false));
        //     }
        // }
    }, [user]);

    const getRecruitments = () => {
        axios.get(globalState.appServer + globalState.api.getNewRecruitments + "?page=" + page + "&pageSize=" + _ROW_LIMIT)
            .then(response => response.data !== undefined ? response.data : [])
            .then(data => {
                setRecruitments([...recruitments, ...data]);
                setPage(page + 1);
                if (data.length < _ROW_LIMIT)
                    setHasMore(false);
            });
    }

    useEffect(() => {
        getRecruitments();
    }, []);

    // const embedRecruitment = (data) => {
    //     _MAX_PAGE = Math.ceil(data.length / _PAGE_SIZE);
    //     let pageValue1 = []
    //     for (var i = 0; i < _MAX_PAGE; i++) {
    //         pageValue1.push(
    //             <div className="home-page-new-recruitments-items">
    //                 {data.slice(i * _PAGE_SIZE, (i + 1) * _PAGE_SIZE).map(newRecruitment =>
    //                     <RecruitmentSummary recruitment={newRecruitment} />
    //                 )}
    //             </div>
    //         )
    //     }
    //     document.getElementsByClassName("home-page-new-recruitments-slider")[0].style.width = _MAX_PAGE * 100 + "%";
    //     setPageValue(pageValue1);
    // }

    return (
        <div className="home-page">
            <TaskBar />
            <div className="home-page-content">
                <RecruitmentSearch />
                <div className="home-page-new-recruitments">
                    {/* <div className="home-page-new-recruitments-title">
                        <img src={require("../../images/newRecruitments.png")}></img>
                    </div> */}
                    {/* {
                        isLoading && <Loading />
                    } */}
                    {/* <div className="home-page-new-recruitments-content" style={{ display: isLoading ? "none" : "flex" }}>
                        <div className="home-page-new-recruitments-pre-page"
                            onClick={() => {
                                let curPage = Math.max(1, page - 1);
                                slider.current.style.transform = "translateX(-" + (curPage - 1) * 100 / _MAX_PAGE + "%)";
                                setPage(curPage);
                            }}>
                            <i className="bi bi-chevron-compact-left"></i>
                        </div>
                        <div className="home-page-new-recruitments-container">
                            <div className="home-page-new-recruitments-slider" ref={slider}>
                                {pageValue}
                            </div>
                        </div>
                        <div className="home-page-new-recruitments-next-page"
                            onClick={() => {
                                let curPage = Math.min(_MAX_PAGE, page + 1);
                                slider.current.style.transform = "translateX(-" + (curPage - 1) * 100 / _MAX_PAGE + "%)";
                                setPage(curPage);
                            }}>
                            <i className="bi bi-chevron-compact-right"></i>
                        </div>
                    </div>
                    <div className="home-page-new-recruitments-page">
                        {page}/{_MAX_PAGE}
                    </div> */}
                    <InfiniteScroll
                        dataLength={recruitments.length}
                        next={getRecruitments}
                        hasMore={hasMore}
                        loader={<div>Loading...</div>}
                    >
                        {
                            recruitments.map(recruitment =>
                                <Recruitment recruitment={recruitment} key={recruitment.id} />
                            )
                        }
                    </InfiniteScroll>
                </div>
            </div>
        </div>
    )
}

export default HomePage;