// import { useContext } from "react";
// import { STATECONTEXT } from "../../App";
// import { useEffect } from "react";
// import { useState } from "react";
// import SockJsClient from 'react-stomp';
// import { useCookies } from "react-cookie";

// export default function Notification(props) {
//     const [globalState, setGlobalState] = useContext(STATECONTEXT);
//     const [notifications, setNotifications] = useState("nothing");
//     const [token, setToken] = useState();
//     const [cookie, setCookie] = useCookies([]);

//     useEffect(() => {
//         setToken(cookie["Authorization"].toString());
//     }, [cookie["Authorization"]])

//     return (
//         <div className="notification">
//             {
//                 token &&
//                 <SockJsClient
//                     url={globalState.appServer + '/ws'}
//                     headers={{
//                         Authorization: token
//                     }}
//                     topics={['/user/queue/notification']}
//                     onMessage={(msg) => { console.log("ddd"); setNotifications(msg); }}
//                     onConnect={() => console.log("connected")}
//                 />
//             }
//             {notifications}
//         </div>
//     )
// }