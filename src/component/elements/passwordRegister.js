import { length } from "localforage";
import React from "react";
// import "../../css/PasswordRegister.css";

class PasswordRegister extends React.PureComponent {
    changePassword(event) {
        let password = event.currentTarget.value;
        if (password.length >= 8){
            document.getElementsByClassName("password-register-password-trigger")[0].style.color = "#669933";
        }
        else{
            document.getElementsByClassName("password-register-password-trigger")[0].style.color = "#DD0000";
        }
    }

    changeComfirmedPassword(event) {
        let password = document.getElementsByClassName("password-register-password-input")[0].value;
        let confirmedPassword = event.currentTarget.value;
        let confirmedPasswordStateElement = document.getElementsByClassName("password-register-confirmed-password-state")[0];
        if(password === confirmedPassword){
            confirmedPasswordStateElement.textContent = " (Khớp)";
            confirmedPasswordStateElement.style.color = "#669933";
        }
        else{
            confirmedPasswordStateElement.textContent = " (Không khớp)";
            confirmedPasswordStateElement.style.color = "#DD0000";
        }
    }

    render() {
        return (
            <div id={this.props.id} className="password-register">
                <div className="password-register-password">
                    <label>Mật khẩu</label>
                    <span className="password-register-password-trigger" style={{color: '#DD0000', fontWeight: '600'}}> (Tối thiểu 8 ký tự)</span>
                    <br />
                    <input className="password-register-password-input" name={this.props.name} type="password" pattern=".{8,40}" required onChange={this.changePassword.bind(this)} style={{width: "100%"}}></input>
                </div>
                <div className="password-register-confirmed-password">
                    <label>Nhập lại mật khẩu</label>
                    <span className="password-register-confirmed-password-state" style={{color: '#DD0000', fontWeight: '600'}}> (Không khớp) </span>
                    <br />
                    <input className="password-register-confirmed-password-input" type="password" onChange={this.changeComfirmedPassword.bind(this)} style={{width: "100%"}}></input>
                </div>
            </div>
        )

    }
}

export default PasswordRegister;