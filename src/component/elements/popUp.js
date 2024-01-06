import { useEffect, useState } from "react";
import "../../css/popUp.css";

export default function PopUp(props) {
    return (
        <div className="pop-up" style={{'display': props.isDisplay ? 'flex' : 'none'}}>
            <div className="pop-up-container">
                <div className="pop-up-head">
                    <span>{props.title}</span>
                    <i class="bi bi-x-circle pop-up-close" onClick={props.close}></i>
                </div>
                <div className="pop-up-content">
                    {props.content}
                </div>
            </div>
        </div>
    )

}