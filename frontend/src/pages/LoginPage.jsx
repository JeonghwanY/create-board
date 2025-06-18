import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";
import VerifyEmailModal from "../components/VerifyEmail";

const API_BASE = "http://localhost:3000";


function LoginPage() {
    const [id, setId] = useState("");
    const [pw, setPw] = useState("");
    const navigate = useNavigate()
    const [showModal, setShowModal] = useState(false);

    /*/////////////////////////////////////로그인 fecth 로직///////////////////////////////*/
    const handleLogin = async () => {
        if (!id.trim() || !pw.trim()) {
            alert("ID와 PW를 모두 입력하세요");
            return;
        }

        try {
            const res = await fetch(`${API_BASE}/auth/signin`, { //로그인
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email: id, password: pw }) // <- 백엔드에서 요구하는 필드명에 맞춰야 함
            });

            if (!res.ok) {
                alert("로그인 실패: 아이디 또는 비밀번호를 확인하세요");
                return;
            }

            const data = await res.json();
            console.log("로그인 성공:", data);
            alert(`${data.username || "로그인"} 성공!`);

            // 토큰 저장 예시 (선택)
            // localStorage.setItem("token", data.token);

            // 페이지 이동 예시
            // window.location.href = "/home";
        } catch (err) {
            console.error(err);
            alert("서버 오류: 로그인 실패");
        }
    };

    return (
        <div className="login-container">
            <h1 className="title">Music in the</h1>
            <h2 className="subtitle">JUNGLE</h2>

            <input
                type="text"
                placeholder="ID"
                className="input-box"
                value={id}
                onChange={(e) => setId(e.target.value)}
            />
            <input
                type="password"
                placeholder="PW"
                className="input-box"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
            />
            <button className="button" onClick={handleLogin}>로그인</button>
            <button className="button" onClick={() => navigate("/register")}>회원가입</button>
            <button className="button" onClick={() => setShowModal(true)}>
                ID/PW 찾기
            </button>
            {showModal && <VerifyEmailModal onClose={() => setShowModal(false)} />}
        </div>
    );
}

export default LoginPage;