import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../css/button.css"

function Button(props) {
    const [textElement, setTextElement] = useState(props.text);

    useEffect(() => {
        if (props.href !== undefined) {
            setTextElement(
                <div className="button-text">
                    <Link to={props.href}>{props.text}</Link>
                </div>
            );
        }
    }, []);

    return (
        <button className="button" id={props.id} type={props.type}>
            <div className="button-icon"><i className={props.icon}></i></div>
            <div className="button-text">
                {textElement}
            </div>
        </button>
    );
}

export default Button;