import { useContext, useEffect, useRef, useState } from "react";
import "../../css/recruitment.css";
import PostRecruitment from "../form/postRecruitment";
import { STATECONTEXT } from "../../App";
import axios from "axios";
import { useRole } from "../../service/authenticate";
import { Form, useNavigate } from "react-router-dom";
import Comment from "./comment";
import Application from "../form/application";
import PopUp from "./popUp";

function Recruitment(props) {
    const [globalState, setGlobalState] = useContext(STATECONTEXT);
    const [recruitment, setRecruitment] = useState();
    const [isShowEditRecruitment, setIsShowEditRecruitment] = useState(false);
    const user = useRole();
    const [reaction, setReaction] = useState();
    const navigate = useNavigate();
    const [comments, setComments] = useState([]);
    const commentsElement = useRef();
    const [newCommentImageUrl, setNewCommentImageUrl] = useState();
    const [isSendingComment, setIsSendingComment] = useState(false);
    const newCommentImageElement = useRef();
    const newCommentContentElement = useRef();
    const [isShowRecruitmentOptions, setIsShowRecruitmentOptions] = useState(false);
    const [isShowApplicationForm, setIsShowApplicationForm] = useState(false);
    const [reactionsClasses, setReactionClasses] = useState();


    useEffect(() => {
        document.addEventListener("click", (event) => {
            if (!event.target.classList.contains("show-recruitment-more-options")) {
                setIsShowRecruitmentOptions(false);
            }
        })
        if (props.recruitment) {
            setRecruitment(props.recruitment);
            classifyReactions(props.recruitment.reactions);
            for (let reaction of props.recruitment.reactions) {
                switch (reaction.hostRole) {
                    case "ROLE_EMPLOYEE":
                        if (user && user.role === "ROLE_EMPLOYEE" && reaction.employee.id === user.profile.id)
                            setReaction(reaction.reaction);
                        break;
                    case "ROLE_EMPLOYER":
                        if (user && user.role === "ROLE_EMPLOYER" && reaction.employer.id === user.profile.id)
                            setReaction(reaction.reaction);
                        break;
                    case "ROLE_ADMIN":
                        if (user && user.role === "ROLE_ADMIN" && reaction.administrator.id === user.profile.id)
                            setReaction(reaction.reaction);
                        break;
                }
            }
            getComments();
        }
    }, [props.recruitment]);

    const classifyReactions = (reactions) => {
        let reactionsClasses1 = { hate: [], dislike: [], neutral: [], like: [], love: [] };
        reactions.forEach(reaction => {
            switch (reaction.reaction) {
                case "hate":
                    switch (reaction.hostRole) {
                        case "ROLE_EMPLOYEE":
                            reactionsClasses1.hate.push(reaction.employee);
                        case "ROLE_EMPLOYER":
                            reactionsClasses1.hate.push(reaction.employer);
                        case "ROLE_ADMIN":
                            reactionsClasses1.hate.push(reaction.administrator);
                    }
                    break;
                case "dislike":
                    switch (reaction.hostRole) {
                        case "ROLE_EMPLOYEE":
                            reactionsClasses1.dislike.push(reaction.employee);
                        case "ROLE_EMPLOYER":
                            reactionsClasses1.dislike.push(reaction.employer);
                        case "ROLE_ADMIN":
                            reactionsClasses1.dislike.push(reaction.administrator);
                    }
                    break;
                case "neutral":
                    switch (reaction.hostRole) {
                        case "ROLE_EMPLOYEE":
                            reactionsClasses1.neutral.push(reaction.employee);
                        case "ROLE_EMPLOYER":
                            reactionsClasses1.neutral.push(reaction.employer);
                        case "ROLE_ADMIN":
                            reactionsClasses1.neutral.push(reaction.administrator);
                    }
                    break;
                case "like":
                    switch (reaction.hostRole) {
                        case "ROLE_EMPLOYEE":
                            reactionsClasses1.like.push(reaction.employee);
                        case "ROLE_EMPLOYER":
                            reactionsClasses1.like.push(reaction.employer);
                        case "ROLE_ADMIN":
                            reactionsClasses1.like.push(reaction.administrator);
                    }
                    break;
                case "love":
                    switch (reaction.hostRole) {
                        case "ROLE_EMPLOYEE":
                            reactionsClasses1.love.push(reaction.employee);
                        case "ROLE_EMPLOYER":
                            reactionsClasses1.love.push(reaction.employer);
                        case "ROLE_ADMIN":
                            reactionsClasses1.love.push(reaction.administrator);
                    }
                    break;
                default:
                    break;
            }
        });
        setReactionClasses(reactionsClasses1);
    }

    const getComments = () => {
        axios.get(globalState.appServer + globalState.api.getComments + "?id=" + props.recruitment.id + "&postType=recruitment")
            .then(response => response.data ? response.data : [])
            .then(data => setComments(data));
    }

    const updateSuccessHandle = () => {
        axios.get(globalState.appServer + globalState.api.getRecruitmentById + recruitment.id)
            .then(response => response.data)
            .then(data => {
                setRecruitment(data);
            })
    }

    const react = (reaction) => {
        if (user && !user.role)
            navigate(globalState.links.loginLink);
        else {
            setReaction(reaction);
            let formData = new FormData();
            formData.set('id', recruitment.id);
            formData.set('postType', 'recruitment');
            formData.set('reaction', reaction);
            axios.post(globalState.appServer + globalState.api.react, formData, { withCredentials: true })
                .then(response => {
                    if (response.data)
                        setRecruitment(response.data);
                    classifyReactions(response.data.reactions);
                });
        }
    }

    const selectCommentImage = () => {
        if (newCommentImageElement.current.files.length < 1) {
            setNewCommentImageUrl(undefined);
            return;
        }
        let imageFile = newCommentImageElement.current.files[0];
        const fileReader = new FileReader();
        fileReader.onload = () => {
            setNewCommentImageUrl(fileReader.result);
        }
        fileReader.readAsDataURL(imageFile);
    }

    const sendComment = () => {
        let content = newCommentContentElement.current.value;
        let image = newCommentImageElement.current.files[0];
        if (!content.trim() && !image)
            return;
        let formData = new FormData();
        formData.set("postType", 'recruitment')
        formData.set("id", recruitment.id);
        if (content)
            formData.set("content", content);
        if (image)
            formData.set("image", image);
        setIsSendingComment(true);
        axios.post(globalState.appServer + globalState.api.comment, formData, { withCredentials: true })
            .then(response => {
                newCommentContentElement.current.value = '';
                newCommentImageElement.current.value = '';
                let comments1 = [...comments];
                comments1.push(response.data);
                setComments(comments1);
            })
            .finally(() => setIsSendingComment(false));
    }

    const saveRecruitment = () => {
        axios.post(globalState.appServer + globalState.api.saveRecruitment + "?recruitmentId=" + recruitment.id, {}, { withCredentials: true })
            .then(response => alert("Đã lưu"));
    }

    return (
        <div className="recruitment">
            <div className="recruitment-header">
                <div className="recruitment-company-logo">
                    <img src={recruitment !== undefined ? recruitment.employer.company.logo : ""}></img>
                </div>
                <div className="recruitment-header-container">
                    <div className="recruitment-name">
                        {recruitment !== undefined ? recruitment.name : undefined}
                    </div>
                    <div className="recruitment-company-name">
                        {recruitment !== undefined ? recruitment.employer.company.name : undefined}
                    </div>
                    <div className="recruitment-time">
                        {recruitment !== undefined ? new Date(recruitment.editedTime).toLocaleString() : undefined}
                    </div>
                </div>
                {
                    user && user.role === "ROLE_EMPLOYER" && recruitment && recruitment.employer.id === user.profile.id &&
                    <div className="recruitment-more-options-container">
                        <i className="bi bi-three-dots-vertical show-recruitment-more-options"
                            onClick={() => setIsShowRecruitmentOptions(true)}></i>
                        <div className="recruitment-more-options" style={{ 'display': isShowRecruitmentOptions ? 'block' : 'none' }}>
                            <button onClick={() => setIsShowEditRecruitment(true)}>
                                <i className="bi bi-pencil-square"></i>
                                Chỉnh sửa
                            </button>
                            <button>
                                <i className="bi bi-trash"></i>
                                Xóa
                            </button>
                        </div>
                    </div>
                }
            </div>
            <div className="recruitment-main-information">
                <div className="recruitment-main-information-position">
                    <i className="bi bi-briefcase"></i>
                    <span className="recruitment-main-information-label">Vị trí công việc</span>
                    <p className="recruitment-main-infomation-data">
                        {recruitment !== undefined ? recruitment.position : undefined}
                    </p>
                </div>
                <div className="recruitment-main-information-type">
                    <i className="bi bi-building"></i>
                    <span className="recruitment-main-information-label">Hình thức làm việc</span>
                    <p className="recruitment-main-infomation-data">
                        {recruitment !== undefined ? recruitment.workType : undefined}
                    </p>
                </div>
                <div className="recruitment-main-information-address">
                    <i className="bi bi-geo-alt"></i>
                    <span className="recruitment-main-information-label">Địa chỉ</span>
                    <p className="recruitment-main-infomation-data">
                        {recruitment ? recruitment.address.province : undefined}
                    </p>
                </div>
                <div className="recruitment-main-information-wage">
                    <i className="bi bi-cash-coin"></i>
                    <span className="recruitment-main-information-label">Mức lương</span>
                    <p className="recruitment-main-infomation-data">
                        {recruitment !== undefined ? recruitment.wage : undefined}

                    </p>
                </div>
                <div className="recruitment-main-information-domains">
                    <i className="bi bi-layout-three-columns"></i>
                    <span className="recruitment-main-information-label">Lĩnh vực</span>
                    <p className="recruitment-main-infomation-data">
                        {recruitment !== undefined ? recruitment.domains.map(domain => domain + ", ") : undefined}
                    </p>
                </div>
                <div className="recruitment-main-information-employeeNumber">
                    <i className="bi bi-lightbulb"></i>
                    <span className="recruitment-main-information-label">Số lượng tuyển dụng</span>
                    <p className="recruitment-main-infomation-data">
                        {recruitment !== undefined && recruitment.employeeNumber}
                    </p>
                </div>
                <div className="recruitment-main-information-experience">
                    <i className="bi bi-pencil-square"></i>
                    <span className="recruitment-main-information-label">Kinh nghiệm</span>
                    <p className="recruitment-main-infomation-data">
                        {recruitment !== undefined ? recruitment.experience + " năm" : undefined}
                    </p>
                </div>
                <div className="recruitment-main-information-date">
                    <i className="bi bi-calendar-minus"></i>
                    <span className="recruitment-main-information-label">Thời hạn tuyển dụng</span>
                    <p className="recruitment-main-infomation-data">
                        {recruitment !== undefined ? recruitment.endDate : undefined}
                    </p>
                </div>
            </div>
            <div className="recruitment-detail-information">
                <div className="recruitment-detail-information-description">
                    <span className="recruitment-detail-information-label big-label">Mô tả công việc</span>
                    <p className="recruitment-main-infomation-data">
                        {recruitment !== undefined ? recruitment.description : undefined}
                    </p>
                </div>
                <div className="recruitment-detail-information-requirement">
                    <span className="recruitment-detail-information-label big-label">Yêu cầu với ứng viên</span>
                    <p className="recruitment-main-infomation-data">
                        {recruitment !== undefined ? recruitment.requirement : undefined}
                    </p>
                </div>
                <div className="recruitment-detail-information-interest">
                    <span className="recruitment-detail-information-label big-label">Quyền lợi của nhân viên</span>
                    <p className="recruitment-main-infomation-data">
                        {recruitment !== undefined ? recruitment.interest : undefined}
                    </p>
                </div>
            </div>
            <div className="recruitment-statistics">
                <div className="recruitment-statistics-reaction">
                    <div className="recruitment-statistics-reaction-icons">
                        {
                            reactionsClasses && reactionsClasses.hate.length > 0 && <span className="statistics-reaction-icon">😒</span>
                        }
                        {
                            reactionsClasses && reactionsClasses.dislike.length > 0 && <span className="statistics-reaction-icon">😑</span>
                        }
                        {
                            reactionsClasses && reactionsClasses.neutral.length > 0 && <span className="statistics-reaction-icon">🙂</span>
                        }
                        {
                            reactionsClasses && reactionsClasses.like.length > 0 && <span className="statistics-reaction-icon">😄</span>
                        }
                        {
                            reactionsClasses && reactionsClasses.love.length > 0 && <span className="statistics-reaction-icon">😍</span>
                        }
                    </div>
                    {recruitment && recruitment.reactions && recruitment.reactions.length}
                </div>
                <div className="recruitment-statistics-comment">
                    <i class="bi bi-chat-dots"></i>
                    {comments.reduce((total, comment) => total + 1 + (comment.responses ? comment.responses.length : 0), 0)}
                </div>
                <div className="recruitment-statistics-application"></div>
            </div>
            <div className="recruitment-action">
                <div className="recruitment-reaction">
                    {
                        reaction === 'hate' ? '😒 hate' :
                            reaction === 'dislike' ? '😑 dislike' :
                                reaction === 'neutral' ? '🙂 neutral' :
                                    reaction === 'like' ? '😄 like' :
                                        reaction === 'love' ? '😍 love' :
                                            <><i className="bi bi-hand-thumbs-up"></i> React</>
                    }
                    <div className="recruitment-reaction-options">
                        <span onClick={() => react("hate")}>😒</span>
                        <span onClick={() => react("dislike")}>😑</span>
                        <span onClick={() => react("neutral")}>🙂</span>
                        <span onClick={() => react("like")}>😄</span>
                        <span onClick={() => react("love")}>😍</span>
                    </div>
                </div>
                <div className="recruitment-comment-icon" onClick={() => {
                    commentsElement.current.style.display = '';
                }}>
                    <i class="bi bi-chat-dots"></i>
                    Bình luận
                </div>
                {
                    user && user.role === 'ROLE_EMPLOYEE' &&
                    <>
                        <div className="recruitment-save" onClick={saveRecruitment}>
                            <i className="bi bi-save"></i>
                            Lưu tin
                        </div>
                        <div className="recruitment-apply" onClick={() => setIsShowApplicationForm(true)}>
                            <i className="bi bi-box-arrow-up-right"></i>
                            Ứng tuyển
                        </div>
                    </>
                }
            </div>
            <div className="recruitment-comment-container" ref={commentsElement} style={{ display: 'none' }}>
                <div className="recruitment-comments">
                    {
                        comments.map((comment, index) =>
                            <Comment comment={comment} key={comment.id}
                                deleteHandle={() => {
                                    let comments1 = [...comments];
                                    comments1.splice(index, 1);
                                    setComments(comments1);
                                }
                                } />)
                    }
                </div>
                <div className="recruitment-new-comment">
                    <div className="recruitment-new-comment-box">
                        <textarea className="recruitment-new-comment-input" ref={newCommentContentElement} rows={1} placeholder="Bình luận..."></textarea>
                        {
                            newCommentImageUrl &&
                            <img className="recruitment-new-comment-image" src={newCommentImageUrl}></img>
                        }
                        <div className="recruitment-new-comment-services">
                            <label className="recruitment-new-comment-image-input">
                                <i className="bi bi-card-image"></i>
                                <input type="file" ref={newCommentImageElement} onChange={selectCommentImage} accept="image/*"></input>
                            </label>
                            <i className="bi bi-send-fill send-icon" onClick={sendComment}></i>
                        </div>
                    </div>
                    {
                        isSendingComment && 'Đang đăng bình luận...'
                    }
                </div>
                <div className="recruitment-comment-hidden">
                    <i class="bi bi-caret-up-fill" onClick={() => commentsElement.current.style.display = 'none'}></i>
                </div>
            </div>
            {
                user && user.role === "ROLE_EMPLOYER" && recruitment && recruitment.employer.id === user.profile.id &&
                <PopUp
                    isDisplay={isShowEditRecruitment}
                    content={
                        <PostRecruitment
                            recruitment={recruitment}
                            type="edit"
                            success={updateSuccessHandle}
                        />}
                    close={() => setIsShowEditRecruitment(false)}
                />
            }
            {
                user && user.role === 'ROLE_EMPLOYEE' &&
                <PopUp
                    title="Thư ứng tuyển"
                    isDisplay={isShowApplicationForm}
                    close={() => setIsShowApplicationForm(false)}
                    content={
                        <Application
                            success={() => {
                                setIsShowApplicationForm(false)
                            }}
                            recruitment={recruitment}
                        />
                    }
                />
            }
        </div >
    )
}

export default Recruitment;