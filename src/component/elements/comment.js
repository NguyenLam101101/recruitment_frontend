import { useContext, useEffect, useRef, useState } from "react";
import "../../css/comment.css"
import { STATECONTEXT } from "../../App";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useRole } from "../../service/authenticate";

export default Comment = (props) => {
    const [globalState, setGlobalState] = useContext(STATECONTEXT);
    const user = useRole();
    const navigate = useNavigate();
    const [newResponseImageUrl, setNewResponseImageUrl] = useState();
    const newResponseImageElement = useRef();
    const newResponseElement = useRef();
    const newResponseContentElement = useRef();
    const commentOptionsElement = useRef();
    const responseOptionsElements = useRef([]);
    const [comment, setComment] = useState();
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        setComment(props.comment);
        document.addEventListener("click", (event) => {
            if (!event.target.classList.contains("show-comment-more-options-1"))
                Array.from(document.getElementsByClassName("comment-more-options")).forEach(element => element.style.display = "none");
        })
    }, [props.comment]);

    const selectResponseImage = () => {
        if (newResponseImageElement.current.files.length < 1) {
            setNewResponseImageUrl(undefined);
            return;
        }
        let imageFile = newResponseImageElement.current.files[0];
        const fileReader = new FileReader();
        fileReader.onload = () => {
            setNewResponseImageUrl(fileReader.result);
        }
        fileReader.readAsDataURL(imageFile);
    }

    const sendResponse = () => {
        let content = newResponseContentElement.current.value;
        let image = newResponseImageElement.current.files[0];
        if (!content.trim() && !image)
            return;
        let formData = new FormData();
        formData.set("commentId", comment.id);
        if (content)
            formData.set("content", content);
        if (image)
            formData.set("image", image);
        axios.post(globalState.appServer + globalState.api.replyComment, formData, { withCredentials: true })
            .then(response => {
                let comment1 = { ...comment };
                if (!comment1.responses)
                    comment1.responses = [];
                comment1.responses.push(response.data);
                setComment(comment1);
                newResponseContentElement.current.value = "";
                newResponseImageElement.current.value = "";
            });
    }

    const deleteComment = () => {
        if (window.confirm("Bạn chắc chắn muốn xóa bình luận này chứ?")) {
            setIsDeleting(true);
            axios.delete(globalState.appServer + globalState.api.deleteComment + "?id=" + comment.id, { withCredentials: true })
                .then(response => props.deleteHandle && props.deleteHandle())
                .finally(() => setIsDeleting(false));
        }
    }

    const deleteResponse = (index, id) => {
        if (window.confirm("Bạn chắc chắn muốn xóa bình luận này chứ?")) {
            axios.delete(globalState.appServer + globalState.api.deleteCommentResponse + "?id=" + id, { withCredentials: true })
                .then(response => {
                    let comment1 = { ...comment };
                    comment1.responses.splice(index, 1);
                    setComment(comment1);
                });
        }
    }

    return (
        <div className="comment">
            <div className="comment-main">
                <div className="comment-box">
                    <div className="comment-host">
                        {
                            comment ?
                                comment.hostRole === "ROLE_EMPLOYEE" ? comment.employee.firstName + ' ' + comment.employee.lastName
                                    : comment.hostRole === "ROLE_EMPLOYER" ? comment.employer.firstName + ' ' + comment.employer.lastName
                                        : ""
                                : ""
                        }
                    </div>
                    <div className="comment-content">
                        {
                            comment && comment.content
                        }
                    </div>
                </div>
                {
                    comment && user && user.profile &&(
                        (comment.hostRole === 'ROLE_EMPLOYEE' && comment.employee.id === user.profile.id) ||
                        (comment.hostRole === 'ROLE_EMPLOYER' && comment.employer.id === user.profile.id)
                    ) &&
                    <div className="comment-more-options-container">
                        <div className="show-comment-more-options show-comment-more-options-1"
                            onClick={(event) => {
                                Array.from(document.getElementsByClassName("comment-more-options")).forEach(element => element.style.display = "none");
                                commentOptionsElement.current.style.display = "";
                            }}>
                            <i className="bi bi-three-dots show-comment-more-options-1"></i>
                        </div>
                        <div className="comment-more-options" ref={commentOptionsElement} style={{ display: "none" }}>
                            {/* <button >
                            <i className="bi bi-pencil-square"></i>
                            Chỉnh sửa
                        </button> */}
                            <button onClick={deleteComment}>
                                <i className="bi bi-trash"></i>
                                Xóa
                            </button>
                        </div>
                    </div>
                }
            </div>
            {
                isDeleting && 'Đang xóa ...'
            }
            {
                comment && comment.image &&
                <div className="comment-image">
                    <img src={comment.image}></img>
                </div>
            }
            <div className="comment-services">
                <div className="comment-time">
                    {
                        comment && new Date(comment.time).toLocaleString()
                    }
                </div>
                <i className="bi bi-reply-fill reply-icon"
                    onClick={() => newResponseElement.current.style.display = ''}>
                </i>
            </div>
            <div className="comment-responses">
                {
                    comment && comment.responses &&
                    comment.responses.map((response, index) =>
                        <div className="comment-response-container">
                            <div className="comment-response-main">
                                <div className="comment-response-box">
                                    <div className="comment-response-host">
                                        {
                                            response.hostRole === "ROLE_EMPLOYEE" ? response.employee.firstName + ' ' + response.employee.lastName
                                                : response.hostRole === "ROLE_EMPLOYER" ? response.employer.firstName + ' ' + response.employer.lastName
                                                    : ""
                                        }
                                    </div>
                                    <div className="comment-response-content">
                                        {response.content}
                                    </div>
                                </div>
                                {
                                    user && user.profile && (
                                        (response.hostRole === 'ROLE_EMPLOYEE' && user.profile && response.employee.id === user.profile.id) ||
                                        (response.hostRole === 'ROLE_EMPLOYER' && user.profile && response.employer.id === user.profile.id)
                                    ) &&
                                    <div className="comment-more-options-container">
                                        <div className="show-comment-more-options show-comment-more-options-1"
                                            onClick={(event) => {
                                                Array.from(document.getElementsByClassName("comment-more-options")).forEach(element => element.style.display = "none");
                                                responseOptionsElements.current[index].style.display = "";
                                            }}
                                        >
                                            <i className="bi bi-three-dots show-comment-more-options-1"></i>
                                        </div>
                                        <div className="comment-more-options"
                                            ref={element => responseOptionsElements.current[index] = element}
                                            style={{ display: "none" }}>
                                            {/* <button >
                            <i className="bi bi-pencil-square"></i>
                            Chỉnh sửa
                        </button> */}
                                            <button onClick={() => deleteResponse(index, response.id)}>
                                                <i className="bi bi-trash"></i>
                                                Xóa
                                            </button>
                                        </div>
                                    </div>
                                }
                            </div>
                            {
                                response.image &&
                                <div className="comment-response-image">
                                    <img src={response.image}></img>
                                </div>
                            }
                            <div className="comment-response-time">
                                {new Date(response.time).toLocaleString()}
                            </div>
                        </div>
                    )
                }
                <div className="comment-response-container" ref={newResponseElement} style={{ display: 'none' }}>
                    <div className="new-comment-response-box">
                        <textarea className="new-comment-response-input" ref={newResponseContentElement} rows="1" placeholder="..."></textarea>
                        {
                            newResponseImageUrl &&
                            <img src={newResponseImageUrl} className="new-comment-response-image"></img>
                        }
                        <div className="new-comment-response-services">
                            <label className="new-comment-response-image-input">
                                <i className="bi bi-card-image"></i>
                                <input type="file"
                                    ref={newResponseImageElement}
                                    onChange={selectResponseImage}
                                    accept="image/*"></input>
                            </label>
                            <i className="bi bi-send-fill send-icon" onClick={sendResponse}></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}