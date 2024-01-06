import axios from "axios";
import { useContext, useEffect } from "react";
import { useState } from "react";
import { STATECONTEXT } from "../../App";
import "../../css/notifications.css";
import { Link } from "react-router-dom";
import { useRole } from "../../service/authenticate";
import { useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

export default function Notifications(props) {
    const [notReadNotificationCount, setNotReadNotificationCount] = useState(0);
    const [globalState, setGlobalState] = useContext(STATECONTEXT);
    const [notifications, setNotifications] = useState([]);
    const user = useRole();
    const notificationElement = useRef();
    const notificationListElement = useRef();
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const ROW_LIMIT = 10;

    const getNotifications = () => {
        axios.get(globalState.appServer + globalState.api.getNotifications + "?page=" + page + "&rowLimit=" + ROW_LIMIT, { withCredentials: true })
            .then(response => response.data)
            .then(data => {
                console.log(page);
                console.log(data.notifications);
                setNotifications([...notifications, ...data.notifications]);
                setNotReadNotificationCount(data.notReadCount ? data.notReadCount : 0);
                setPage(page + 1);
                setHasMore(data.notifications.length === ROW_LIMIT);
            });
    }

    useEffect(() => {
        getNotifications();
    }, []);

    useEffect(() => {
        document.addEventListener("click", (event) => {
            if (notificationElement.current && !notificationElement.current.contains(event.target)) {
                notificationListElement.current.style.display = "none";
            }
        })
    }, []);

    const readNotification = (id) => {
        axios.put(globalState.appServer + globalState.api.readNotification + "?id=" + id, {}, { withCredentials: true });
    }

    return (
        <div className="notification" ref={notificationElement}>
            <i class="bi bi-bell-fill" onClick={() => notificationListElement.current.style.display = ""}></i>
            {
                notReadNotificationCount > 0 &&
                <div className="notRead-notification-count">{notReadNotificationCount}</div>
            }
            <div className="notification-container" style={{ display: 'none' }} ref={notificationListElement}>
                {
                    notifications.length === 0 && <div style={{color: '#444', paddingLeft:'15px'}}>Bạn chưa có thông báo nào!</div>   
                }
                <InfiniteScroll
                    dataLength={notifications.length}
                    next={getNotifications}
                    hasMore={hasMore}
                    loader={<div>Loading...</div>}
                >
                    {
                        notifications.map(notification =>
                            <Link to={
                                notification.type === "application" ? globalState.links.applicationDetailLink + "?id=" + notification.objectId :
                                    notification.type === "approval" ? globalState.links.applicationDetailLink + "?id=" + notification.objectId :
                                        notification.type === "replyMail" ? globalState.links.applicationDetailLink + "?id=" + notification.objectId : ""
                            }
                                key={notification.id}>
                                <div className={"notification-option" + (notification.isRead ? "" : " notRead")}
                                    onClick={() => readNotification(notification.id)}>
                                    {notification.type === "application" && <i class="bi bi-send-fill application"></i>}
                                    {notification.type === "replyMail" && <i class="bi bi-reply-fill replyMail"></i>}
                                    {notification.type === "approval" && <i class="bi bi-check-circle-fill approval"></i>}
                                    <div className="notification-content">
                                        <div className="notification-message">{notification.message}</div>
                                        <div className="notification-time">{notification.time[2] + "/" + notification.time[1] + "/" + notification.time[0] + " " + notification.time[3] + ":" + notification.time[4] + ":" + notification.time[5]}</div>
                                    </div>
                                </div>
                            </Link>
                        )
                    }
                </InfiniteScroll>
            </div>
        </div>
    )
}