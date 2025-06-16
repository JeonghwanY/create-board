import "./LoginPage.css";

import React from "react";
import "./LoginPage.css";

function LoginPage() {
    return (
        <div className="login-container">
            <h1 className="title">Music in the</h1>
            <h2 className="subtitle">JUNGLE</h2>
            <input type="text" placeholder="ID" className="input-box" />
            <input type="password" placeholder="PW" className="input-box" />
            <button className="button">로그인</button>
            <button className="button">회원가입</button>
        </div>
    );
}

export default LoginPage;