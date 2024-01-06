import React, { useRef, useState } from "react";
import "../../css/prompt.css";

const Prompt = React.forwardRef((props, ref) => {
    return (
        <div className="prompt">
            <div className="prompt-message" style={{
                color: "var(--middle-green-color)"
            }}>{props.message !== undefined ? props.message : ""}</div>
            <input  type={["text", "date", "number", "file", "datetime-local"].includes(props.type) ? props.type : "text"}
                ref={ref}
                style = {{
                    width: "100%",
                    height: "35px",
                    marginTop: "15px",
                    border: "1px solid darkgray",
                    borderRadius: "5px"
                }}></input>
            <div className="prompt-buttons"
                style={{
                    textAlign: "center",
                    marginTop: "15px"
                }}>
                <button onClick={props.cancelHandle}>Cancel</button>
                <button 
                    onClick = {props.okHandle}
                    style={{
                        background: "var(--middle-green-color)",
                        color: "#fff"
                    }}
                >OK</button>
            </div>
        </div>
    )
});

export default Prompt;