import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RegisterPage.css";

const API_BASE = "http://localhost:3000";


function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [emailChecked, setEmailChecked] = useState(false);

    const navigate = useNavigate();

    // const checkEmailDuplicate = async () => {
    //     try {
    //         const res = await fetch(`${API_BASE}/auth/check`, {  //이메일 중복 검사(회원가입)
    //             method: "POST",
    //             headers: { "Content-Type": "application/json" },
    //             body: JSON.stringify({ email })
    //         });

    //         if (!res.ok) throw new Error("중복 검사 실패");

    //         const result = await res.json();
    //         if (result.exists) {
    //             alert("이미 사용 중인 이메일입니다.");
    //             setEmailChecked(false);
    //         } else {
    //             alert("사용 가능한 이메일입니다!");
    //             setEmailChecked(true);
    //         }
    //     } catch (err) {
    //         console.error(err);
    //         alert("이메일 확인 중 오류 발생");
    //     }
    // };

    const handleRegister = async () => {
        if (!emailChecked) {
            alert("이메일 중복 확인을 해주세요.");
            return;
        }

        try {
            const res = await fetch(`${API_BASE}/auth/signup`, { //회원 가입 
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, username })
            });

            if (!res.ok) {
                alert("회원가입 실패");
                return;
            }

            const data = await res.json();
            alert("회원가입 성공! 로그인 페이지로 이동합니다.");
            navigate("/")
            // console.log(data);
            // window.location.href = "/login";
        } catch (err) {
            console.error(err);
            alert("서버 오류");
        }
    };

    return (
        <div className="register-container">
            <h2>회원가입</h2>
            <input
                type="text"
                placeholder="이메일"
                className="input-box"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <button className="check-button" onClick={checkEmailDuplicate}>
                이메일 중복 확인
            </button>

            <input
                type="text"
                placeholder="닉네임"
                className="input-box"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />

            <input
                type="password"
                placeholder="비밀번호"
                className="input-box"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button className="register-button" onClick={handleRegister}>
                회원가입
            </button>
        </div>
    );
}

export default RegisterPage;